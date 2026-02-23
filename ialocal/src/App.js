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

  const clearChat = () => {
    setChatHistory([]);
    setResult(null);
    setError('');
  };

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
      setError(requestError.message || 'No se pudo conectar con Aura.');
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
          <span className="badge">Aura · Plataforma creativa</span>
          <h1>Habla y crea contenido con Aura en una sola experiencia</h1>
          <p>
            Aura está lista para uso público con una interfaz simple, clara y pensada para productividad.
            Cambia entre chat, imagen y video para resolver ideas y producir contenido en segundos.
          </p>
          <div className="hero-stats">
            <article>
              <strong>Asistente Aura</strong>
              <span>Conversaciones fluidas con historial continuo.</span>
            </article>
            <article>
              <strong>Flujo unificado</strong>
              <span>Chat, imagen y video desde un mismo panel.</span>
            </article>
            <article>
              <strong>Listo para publicar</strong>
              <span>Diseño moderno orientado a usuarios finales.</span>
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

        <section className="workspace-grid">
          <form onSubmit={sendRequest} className="control-panel">
            <div className="panel-head">
              <label htmlFor="prompt">Instrucción para {selectedMode.label.toLowerCase()}</label>
              <span className="status-pill">{loading ? 'Procesando...' : 'Listo para generar'}</span>
            </div>

            <textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              placeholder={`Describe lo que necesitas en modo ${selectedMode.label.toLowerCase()}...`}
            />

            <div className="panel-actions">
              <button type="submit" disabled={!canSend}>
                {loading ? 'Procesando solicitud...' : `Enviar en modo ${selectedMode.label}`}
              </button>

              {mode === 'chat' && chatHistory.length > 0 && (
                <button type="button" className="secondary-btn" onClick={clearChat}>
                  Limpiar conversación
                </button>
              )}
            </div>
          </form>

          {mode !== 'chat' && (
            <aside className="tips-panel" aria-label="sugerencias">
              <h2>Consejos rápidos</h2>
              <ul>
                <li>Usa objetivos claros y estilo deseado para mejores resultados.</li>
                <li>Incluye formato, duración o resolución cuando sea relevante.</li>
                <li>Itera con variaciones cortas para afinar el resultado final.</li>
              </ul>
            </aside>
          )}
        </section>

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
                  <span>Aura</span>
                  <p>Estoy lista para conversar. Escribe tu primer mensaje y te responderé como un chat continuo.</p>
                </article>
              )}

              {chatHistory.map((message, index) => (
                <article key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
                  <span>{message.role === 'user' ? 'Tú' : 'Aura'}</span>
                  <p>{message.content}</p>
                </article>
              ))}

              {loading && (
                <article className="bubble assistant typing">
                  <span>Aura</span>
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
              <img src={result.mediaUrl} alt="Generación creada por Aura" className="media-preview" />
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
