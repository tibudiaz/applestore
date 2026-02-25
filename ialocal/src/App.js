import { useEffect, useMemo, useState } from 'react';
import './App.css';

const MODE_INFO = {
  chat: { label: 'Chat', emoji: '💬', description: 'Conversación natural con memoria de contexto.' },
  image: { label: 'Imagen', emoji: '🖼️', description: 'Generación visual con presets de calidad controlada.' },
  video: { label: 'Video', emoji: '🎬', description: 'Clips en cola con presets fijos para evitar abuso.' },
};

const VIDEO_PRESETS = [
  { id: 'clip-fast', label: 'Clip rápido · 4s · 720p', duration: 4, quality: '720p' },
  { id: 'story-standard', label: 'Historia · 8s · 1080p', duration: 8, quality: '1080p' },
  { id: 'cinematic-pro', label: 'Cinemático · 12s · 1080p', duration: 12, quality: '1080p' },
];

const IMAGE_PRESETS = [
  { id: 'img-fast', label: 'Rápida · 1024x1024', resolution: '1024x1024' },
  { id: 'img-pro', label: 'Pro · 1536x1024', resolution: '1536x1024' },
];

const DEFAULT_ENDPOINT = process.env.REACT_APP_LOCAL_AI_URL || 'http://127.0.0.1:8080/api/generate';
const FIREBASE_API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
const FIREBASE_DATABASE_URL = process.env.REACT_APP_FIREBASE_DATABASE_URL;
const firebaseReady = Boolean(FIREBASE_API_KEY && FIREBASE_DATABASE_URL);

const toResponseText = (payload) => {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  const hit = [payload.response, payload.message, payload.output, payload.text, payload.result, payload.data]
    .find((candidate) => typeof candidate === 'string' && candidate.trim());
  return hit || JSON.stringify(payload, null, 2);
};

const toMediaUrl = (payload) => {
  if (!payload || typeof payload !== 'object') return '';
  return [payload.url, payload.mediaUrl, payload.imageUrl, payload.videoUrl, payload.file]
    .find((candidate) => typeof candidate === 'string' && candidate.trim()) || '';
};

const firebaseRequest = async (path, method = 'GET', authToken = '', body) => {
  const authQuery = authToken ? `?auth=${encodeURIComponent(authToken)}` : '';
  const response = await fetch(`${FIREBASE_DATABASE_URL}/${path}.json${authQuery}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Firebase error ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
};

function App() {
  const [mode, setMode] = useState('chat');
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [enableImage, setEnableImage] = useState(true);
  const [enableVideo, setEnableVideo] = useState(true);
  const [videoPreset, setVideoPreset] = useState(VIDEO_PRESETS[0].id);
  const [imagePreset, setImagePreset] = useState(IMAGE_PRESETS[0].id);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem('auraSession');
    return raw ? JSON.parse(raw) : null;
  });
  const [jobs, setJobs] = useState([]);

  const canSend = prompt.trim().length > 0 && !loading;
  const selectedMode = MODE_INFO[mode];
  const selectedVideoPreset = VIDEO_PRESETS.find((item) => item.id === videoPreset) || VIDEO_PRESETS[0];
  const selectedImagePreset = IMAGE_PRESETS.find((item) => item.id === imagePreset) || IMAGE_PRESETS[0];

  useEffect(() => {
    localStorage.setItem('auraSession', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    if (!firebaseReady || !session?.idToken || !session?.localId) {
      setJobs([]);
      return undefined;
    }

    const syncJobs = async () => {
      try {
        const value = await firebaseRequest(`users/${session.localId}/jobs`, 'GET', session.idToken);
        const parsed = Object.entries(value || {})
          .map(([id, job]) => ({ id, ...job }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setJobs(parsed);
      } catch {
        setJobs([]);
      }
    };

    syncJobs();
    const intervalId = setInterval(syncJobs, 4000);
    return () => clearInterval(intervalId);
  }, [session]);

  const authenticate = async (registerMode) => {
    if (!firebaseReady) return;
    const endpoint = registerMode ? 'signUp' : 'signInWithPassword';
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword, returnSecureToken: true }),
      }
    );

    if (!response.ok) throw new Error('No se pudo iniciar sesión en Firebase Auth.');
    const payload = await response.json();
    setSession(payload);
    setAuthEmail('');
    setAuthPassword('');
  };

  const signOutSession = () => {
    setSession(null);
    setJobs([]);
  };

  const clearChat = () => {
    setChatHistory([]);
    setResult(null);
    setError('');
  };

  const sendRequest = async (event) => {
    event.preventDefault();
    if (!canSend) return;

    if ((mode === 'image' && !enableImage) || (mode === 'video' && !enableVideo)) {
      setError(`El modo ${selectedMode.label.toLowerCase()} está desactivado por política operativa.`);
      return;
    }

    const cleanPrompt = prompt.trim();
    const outgoingHistory = mode === 'chat' ? [...chatHistory, { role: 'user', content: cleanPrompt }] : [];
    if (mode === 'chat') setChatHistory(outgoingHistory);

    setLoading(true);
    setError('');
    setResult(null);

    let jobId = '';

    try {
      if (firebaseReady && session?.idToken && session?.localId && mode !== 'chat') {
        const activeJob = await firebaseRequest('system/activeJob', 'GET', session.idToken);
        if (activeJob?.status === 'processing') {
          throw new Error('Servidor ocupado: ya existe una tarea en proceso.');
        }

        await firebaseRequest('system/activeJob', 'PUT', session.idToken, {
          status: 'processing',
          uid: session.localId,
          mode,
          createdAt: Date.now(),
        });

        const created = await firebaseRequest(`users/${session.localId}/jobs`, 'POST', session.idToken, {
          mode,
          prompt: cleanPrompt,
          status: 'processing',
          createdAt: Date.now(),
          preset: mode === 'video' ? selectedVideoPreset : selectedImagePreset,
        });
        jobId = created.name;
      }

      const response = await fetch(DEFAULT_ENDPOINT.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt: cleanPrompt,
          history: outgoingHistory,
          source: 'firebase-web-client',
          constraints: {
            imageEnabled: enableImage,
            videoEnabled: enableVideo,
            preset: mode === 'video' ? selectedVideoPreset : selectedImagePreset,
          },
          user: session ? { uid: session.localId, email: session.email } : null,
        }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const payload = await response.json();
      const responseText = toResponseText(payload);
      const mediaUrl = toMediaUrl(payload);

      if (mode === 'chat') {
        setChatHistory((current) => [...current, { role: 'assistant', content: responseText }]);
      }

      if (firebaseReady && session?.idToken && session?.localId && jobId) {
        await firebaseRequest(`users/${session.localId}/jobs/${jobId}`, 'PATCH', session.idToken, {
          status: 'completed',
          resultText: responseText,
          mediaUrl,
          generatedFileName: payload.fileName || payload.file || '',
          completedAt: Date.now(),
        });

        await firebaseRequest('system/activeJob', 'PUT', session.idToken, { status: 'idle', releasedAt: Date.now() });
      }

      setResult({ text: responseText, mediaUrl, raw: payload });
      setPrompt('');
    } catch (requestError) {
      setError(requestError.message || 'No se pudo conectar con Aura.');

      if (firebaseReady && session?.idToken && session?.localId && jobId) {
        await firebaseRequest(`users/${session.localId}/jobs/${jobId}`, 'PATCH', session.idToken, {
          status: 'failed',
          error: requestError.message,
          completedAt: Date.now(),
        });
        await firebaseRequest('system/activeJob', 'PUT', session.idToken, { status: 'idle', releasedAt: Date.now() });
      }
    } finally {
      setLoading(false);
    }
  };

  const statusText = useMemo(() => {
    if (!firebaseReady) return 'Configura Firebase para cola persistente.';
    if (!session) return 'Inicia sesión para guardar trabajos aunque cierres la página.';
    return `Sesión activa: ${session.email}`;
  }, [session]);

  return (
    <div className="app-shell">
      <main className="main-card">
        <header className="hero">
          <span className="badge">Aura · Modo chat + render en cola</span>
          <h1>Interfaz conversacional con controles de recursos</h1>
          <p>Más estilo chat, interruptores tipo iPhone y presets cerrados para video/imagen.</p>
        </header>

        <section className="session-bar">
          <div className="account-state">
            <strong>{statusText}</strong>
            <span>Realtime Database mantiene trazabilidad de tareas para una sola máquina de inferencia.</span>
          </div>

          {firebaseReady && !session && (
            <div className="auth-form">
              <input placeholder="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
              <input type="password" placeholder="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
              <button type="button" className="secondary-btn" onClick={() => authenticate(false)}>Entrar</button>
              <button type="button" className="secondary-btn" onClick={() => authenticate(true)}>Registrar</button>
            </div>
          )}

          {session && <button type="button" className="secondary-btn" onClick={signOutSession}>Cerrar sesión</button>}
        </section>

        <section className="toggle-row" aria-label="selector de modo">
          {Object.entries(MODE_INFO).map(([key, info]) => (
            <button key={key} type="button" className={`mode-pill ${mode === key ? 'active' : ''}`} onClick={() => setMode(key)}>
              {info.emoji} {info.label}
            </button>
          ))}
        </section>

        <section className="workspace-grid">
          <div className="chat-layout">
            <div className="chat-title"><h2>{selectedMode.label}</h2><p>{selectedMode.description}</p></div>
            <form onSubmit={sendRequest} className="control-panel">
              <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={5} placeholder={`Escribe tu mensaje para ${selectedMode.label.toLowerCase()}...`} />

              <div className="toggle-controls">
                <div className="ios-toggle"><span>Imagen</span><button type="button" aria-label="toggle imagen" className={`switch ${enableImage ? 'on' : ''}`} onClick={() => setEnableImage((s) => !s)}><span /></button></div>
                <div className="ios-toggle"><span>Video</span><button type="button" aria-label="toggle video" className={`switch ${enableVideo ? 'on' : ''}`} onClick={() => setEnableVideo((s) => !s)}><span /></button></div>
              </div>

              {mode === 'image' && <div className="preset-grid">{IMAGE_PRESETS.map((preset) => <button key={preset.id} type="button" className={`preset-btn ${imagePreset === preset.id ? 'active' : ''}`} onClick={() => setImagePreset(preset.id)}>{preset.label}</button>)}</div>}
              {mode === 'video' && <div className="preset-grid">{VIDEO_PRESETS.map((preset) => <button key={preset.id} type="button" className={`preset-btn ${videoPreset === preset.id ? 'active' : ''}`} onClick={() => setVideoPreset(preset.id)}>{preset.label}</button>)}</div>}

              <div className="panel-actions">
                <button type="submit" disabled={!canSend}>{loading ? 'Procesando...' : 'Enviar'}</button>
                {mode === 'chat' && chatHistory.length > 0 && <button type="button" className="secondary-btn" onClick={clearChat}>Limpiar chat</button>}
              </div>
            </form>
          </div>

          <aside className="jobs-panel">
            <h3>Trabajos del usuario</h3>
            {!session && <p>Inicia sesión para persistir colas y resultados.</p>}
            {session && jobs.length === 0 && <p>No hay trabajos aún.</p>}
            {session && jobs.length > 0 && <ul>{jobs.map((job) => <li key={job.id}><strong>{job.mode.toUpperCase()} · {job.status}</strong><span>{job.generatedFileName || job.prompt}</span></li>)}</ul>}
          </aside>
        </section>

        {error && <p className="feedback error">{error}</p>}

        {mode === 'chat' && <section className="results-box"><div className="chat-flow">{chatHistory.length === 0 && <article className="bubble assistant empty-state"><span>Aura</span><p>Estoy lista para conversar contigo en estilo chat.</p></article>}{chatHistory.map((message, index) => <article key={`${message.role}-${index}`} className={`bubble ${message.role}`}><span>{message.role === 'user' ? 'Tú' : 'Aura'}</span><p>{message.content}</p></article>)}{loading && <article className="bubble assistant typing"><span>Aura</span><p>Escribiendo...</p></article>}</div></section>}

        {result && mode !== 'chat' && (
          <section className="results-box">
            {result.mediaUrl && mode === 'image' && <img src={result.mediaUrl} alt="Generación creada por Aura" className="media-preview" />}
            {result.mediaUrl && mode === 'video' && <video src={result.mediaUrl} className="media-preview" controls />}
            <pre>{result.text}</pre>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
