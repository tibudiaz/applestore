import { useMemo, useState } from 'react';
import './App.css';

const MODES = [
  { id: 'chat', label: 'Chat', emoji: '💬', description: 'Conversación natural con contexto continuo.' },
  { id: 'image', label: 'Imagen', emoji: '🖼️', description: 'Generación visual cinematográfica desde texto.' },
  { id: 'video', label: 'Video', emoji: '🎬', description: 'Storyboard y clips guiados por tu prompt.' },
];

const DEFAULT_ENDPOINT = process.env.REACT_APP_LOCAL_AI_URL || 'http://127.0.0.1:8080/api/generate';

const toResponseText = (payload) => {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;

  const candidates = [
    payload.response,
    payload.message,
    payload.output,
    payload.text,
    payload.result,
    payload.data,
  ];

  const hit = candidates.find((candidate) => typeof candidate === 'string' && candidate.trim());
  return hit || JSON.stringify(payload, null, 2);
};

const toMediaUrl = (payload) => {
  if (!payload || typeof payload !== 'object') return '';

  const mediaCandidates = [payload.url, payload.mediaUrl, payload.imageUrl, payload.videoUrl, payload.file];
  return mediaCandidates.find((candidate) => typeof candidate === 'string' && candidate.trim()) || '';
};

function App() {
  const [mode, setMode] = useState('chat');
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSend = prompt.trim().length > 0 && !loading;

  const selectedMode = useMemo(
    () => MODES.find((item) => item.id === mode) || MODES[0],
    [mode]
  );

  const sendRequest = async (event) => {
    event.preventDefault();
    if (!canSend) return;

    const cleanPrompt = prompt.trim();
    const outgoingHistory = mode === 'chat'
      ? [...chatHistory, { role: 'user', content: cleanPrompt }]
      : [];

    if (mode === 'chat') {
      setChatHistory(outgoingHistory);
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(DEFAULT_ENDPOINT.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          prompt: cleanPrompt,
          history: outgoingHistory,
          source: 'firebase-web-client',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const payload = await response.json();
      const responseText = toResponseText(payload);
      const mediaUrl = toMediaUrl(payload);

      if (mode === 'chat') {
        setChatHistory((current) => [...current, { role: 'assistant', content: responseText }]);
      }

      setResult({
        text: responseText,
        mediaUrl,
        raw: payload,
      });
      setPrompt('');
    } catch (requestError) {
      setError(requestError.message || 'No se pudo conectar con la IA local.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="bg-mesh bg-mesh-a" />
      <div className="bg-mesh bg-mesh-b" />
      <div className="noise-layer" />

      <main className="main-card">
        <header className="hero">
          <span className="badge">Private Endpoint · Local AI</span>
          <h1>Una experiencia premium para conversar y crear con tu IA</h1>
          <p>
            El endpoint ahora está protegido y no es editable desde la interfaz.
            Puedes chatear de forma continua (con historial), o cambiar a imagen/video para generar contenido creativo.
          </p>
          <div className="hero-stats">
            <article>
              <strong>100% Chat real</strong>
              <span>Conserva contexto de mensajes previos.</span>
            </article>
            <article>
              <strong>Seguro por diseño</strong>
              <span>Endpoint oculto en configuración interna.</span>
            </article>
            <article>
              <strong>Modo Studio</strong>
              <span>Interfaz inspirada en productos top de internet.</span>
            </article>
          </div>
        </header>

        <section className="mode-grid" aria-label="selector de modo">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`mode-card ${mode === item.id ? 'active' : ''}`}
              onClick={() => setMode(item.id)}
            >
              <span className="mode-emoji" aria-hidden="true">{item.emoji}</span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </button>
          ))}
        </section>

        <form onSubmit={sendRequest} className="control-panel">
          <label htmlFor="prompt">Prompt para {selectedMode.label.toLowerCase()}</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={5}
            placeholder={`Describe lo que necesitas en modo ${selectedMode.label.toLowerCase()}...`}
          />

          <button type="submit" disabled={!canSend}>
            {loading ? 'Procesando solicitud...' : `Enviar en modo ${selectedMode.label}`}
          </button>
        </form>

        {error && <p className="feedback error">{error}</p>}

        {mode === 'chat' && (
          <section className="results-box">
            <div className="results-head">
              <h2>Conversación</h2>
              <span className="results-chip">Historial activo</span>
            </div>
            <div className="chat-flow">
              {chatHistory.length === 0 && (
                <article className="bubble assistant empty-state">
                  <span>IA local</span>
                  <p>Estoy lista para conversar. Escribe tu primer mensaje y te responderé como un chat continuo.</p>
                </article>
              )}

              {chatHistory.map((message, index) => (
                <article key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
                  <span>{message.role === 'user' ? 'Tú' : 'IA local'}</span>
                  <p>{message.content}</p>
                </article>
              ))}

              {loading && (
                <article className="bubble assistant typing">
                  <span>IA local</span>
                  <p>Escribiendo...</p>
                </article>
              )}
            </div>
          </section>
        )}

        {result && mode !== 'chat' && (
          <section className="results-box">
            <div className="results-head">
              <h2>Resultado de {selectedMode.label}</h2>
              <span className="results-chip">Generación completada</span>
            </div>

            {result.mediaUrl && mode === 'image' && (
              <img src={result.mediaUrl} alt="Generación creada por IA local" className="media-preview" />
            )}

            {result.mediaUrl && mode === 'video' && (
              <video src={result.mediaUrl} className="media-preview" controls />
            )}

            <pre>{result.text}</pre>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
