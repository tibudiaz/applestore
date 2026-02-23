import { useMemo, useState } from 'react';
import './App.css';

const MODES = [
  { id: 'chat', label: 'Chat', emoji: '💬', description: 'Conversación natural con tu IA local.' },
  { id: 'image', label: 'Imagen', emoji: '🖼️', description: 'Generación de imágenes desde un prompt.' },
  { id: 'video', label: 'Video', emoji: '🎬', description: 'Creación de video guiada por texto.' },
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
  const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINT);
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSend = prompt.trim().length > 0 && endpoint.trim().length > 0 && !loading;

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
      const response = await fetch(endpoint.trim(), {
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
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />

      <main className="main-card">
        <header className="hero">
          <span className="badge">Local AI + Firebase</span>
          <h1>Tu asistente inteligente, desde cualquier lugar</h1>
          <p>
            Esta interfaz se despliega en Firebase, pero envía tus peticiones a la IA local de tu PC.
            Elige si quieres conversar, generar una imagen o pedir un video.
          </p>
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
          <label htmlFor="endpoint">Endpoint de tu IA local</label>
          <input
            id="endpoint"
            value={endpoint}
            onChange={(event) => setEndpoint(event.target.value)}
            placeholder="http://127.0.0.1:8080/api/generate"
          />

          <label htmlFor="prompt">Prompt para {selectedMode.label.toLowerCase()}</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={5}
            placeholder={`Describe lo que necesitas en modo ${selectedMode.label.toLowerCase()}...`}
          />

          <button type="submit" disabled={!canSend}>
            {loading ? 'Conectando con IA local...' : `Enviar en modo ${selectedMode.label}`}
          </button>
        </form>

        {error && <p className="feedback error">{error}</p>}

        {mode === 'chat' && chatHistory.length > 0 && (
          <section className="results-box">
            <h2>Conversación</h2>
            <div className="chat-flow">
              {chatHistory.map((message, index) => (
                <article key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
                  <span>{message.role === 'user' ? 'Tú' : 'IA local'}</span>
                  <p>{message.content}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {result && mode !== 'chat' && (
          <section className="results-box">
            <h2>Resultado de {selectedMode.label}</h2>

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
