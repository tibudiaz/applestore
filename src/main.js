import React, { useMemo, useState } from 'https://esm.sh/react@18.3.1'
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client'
import htm from 'https://esm.sh/htm@3.1.1'

const html = htm.bind(React.createElement)

const initialMessages = [
  {
    role: 'assistant',
    mode: 'text',
    content:
      'Bienvenido a tu experiencia premium de IA local. Tu stack está listo para crear texto, imágenes y video con estilo futurista.',
    time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
  },
]

const modeLabel = { text: 'Texto', image: 'Imagen', video: 'Video' }

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [endpoint, setEndpoint] = useState('http://localhost:8000/api/ai')
  const [model, setModel] = useState('local-gpu-model')

  const status = useMemo(
    () => (endpoint ? `Conectando con tu nodo IA: ${endpoint}` : 'Sin endpoint configurado'),
    [endpoint],
  )

  const metrics = useMemo(
    () => [
      { label: 'Mensajes', value: messages.length.toString().padStart(2, '0') },
      { label: 'Modo activo', value: modeLabel[mode] },
      { label: 'Modelo', value: model || 'No definido' },
    ],
    [messages.length, mode, model],
  )

  const sendPrompt = () => {
    if (!prompt.trim()) return
    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

    const answers = {
      text: `Respuesta estilo flagship desde ${model}. Siguiente paso: activar inferencia real en tu backend local con streaming.`,
      image:
        'Prompt visual recibido. El render hiperrealista se mostrará aquí cuando conectes tu motor local de generación de imágenes.',
      video:
        'Storyboard listo. Aquí aparecerá la secuencia final cuando integres tu pipeline local de video IA.',
    }

    setMessages((prev) => [
      ...prev,
      { role: 'user', mode, content: prompt.trim(), time: now },
      { role: 'assistant', mode, content: answers[mode], time: now },
    ])
    setPrompt('')
  }

  return html`
    <div className="ambient ambient-one"></div>
    <div className="ambient ambient-two"></div>

    <div className="app-shell">
      <aside className="settings-panel glass">
        <div className="brand-row">
          <span className="dot"></span>
          <p>AI EXPERIENCE</p>
        </div>
        <h1>Local AI Hub</h1>
        <p className="subtitle">Una interfaz de élite para tu inteligencia artificial local</p>

        <div className="metrics-grid">
          ${metrics.map(
            (metric) => html`
              <article key=${metric.label} className="metric-card">
                <span>${metric.label}</span>
                <strong>${metric.value}</strong>
              </article>
            `,
          )}
        </div>

        <label>
          Endpoint local
          <input value=${endpoint} onInput=${(e) => setEndpoint(e.target.value)} />
        </label>

        <label>
          Modelo principal
          <input value=${model} onInput=${(e) => setModel(e.target.value)} />
        </label>

        <label>
          Modo de creación
          <select value=${mode} onChange=${(e) => setMode(e.target.value)}>
            <option value="text">Texto inteligente</option>
            <option value="image">Imagen artística</option>
            <option value="video">Video generativo</option>
          </select>
        </label>

        <div className="status-chip">${status}</div>
      </aside>

      <main className="chat-panel glass">
        <header className="chat-header">
          <h2>Centro Conversacional</h2>
          <p>Diseño inmersivo + productividad real</p>
        </header>

        <div className="messages">
          ${messages.map(
            (message, i) => html`
              <article key=${`${message.time}-${i}`} className=${`bubble ${message.role}`}>
                <header>
                  <strong>${message.role === 'user' ? 'Tú' : 'IA local'}</strong>
                  <span className="bubble-mode">${modeLabel[message.mode]}</span>
                  <time>${message.time}</time>
                </header>
                <p>${message.content}</p>
              </article>
            `,
          )}
        </div>

        <footer className="composer">
          <textarea
            rows="3"
            value=${prompt}
            onInput=${(e) => setPrompt(e.target.value)}
            placeholder=${`Describe tu solicitud de ${modeLabel[mode].toLowerCase()}...`}
          ></textarea>
          <button type="button" onClick=${sendPrompt} disabled=${!prompt.trim()}>Generar</button>
        </footer>
      </main>
    </div>
  `
}

createRoot(document.getElementById('root')).render(html`<${App} />`)
