import React, { useMemo, useState } from 'https://esm.sh/react@18.3.1'
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client'
import htm from 'https://esm.sh/htm@3.1.1'

const html = htm.bind(React.createElement)

const initialMessages = [
  {
    role: 'assistant',
    mode: 'text',
    content:
      '¡Listo! Soy tu centro de IA local. Puedo responder consultas y preparar generación de imágenes y video usando tu PC.',
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
    () => (endpoint ? `Conexión pendiente a: ${endpoint}` : 'Sin endpoint configurado'),
    [endpoint],
  )

  const sendPrompt = () => {
    if (!prompt.trim()) return
    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

    const answers = {
      text: `Respuesta simulada de ${model}. Próximo paso: conectarlo a tu backend local en PC.`,
      image: 'Solicitud de imagen en cola. Aquí se integrará la salida de tu modelo local.',
      video: 'Solicitud de video en cola. Aquí se integrará el render de tu IA local.',
    }

    setMessages((prev) => [
      ...prev,
      { role: 'user', mode, content: prompt.trim(), time: now },
      { role: 'assistant', mode, content: answers[mode], time: now },
    ])
    setPrompt('')
  }

  return html`
    <div className="app-shell">
      <aside className="settings-panel">
        <h1>Local AI Hub</h1>
        <p className="subtitle">Chat tipo GPT/Gemini conectado a IA local</p>

        <label>
          Endpoint local
          <input value=${endpoint} onInput=${(e) => setEndpoint(e.target.value)} />
        </label>

        <label>
          Modelo principal
          <input value=${model} onInput=${(e) => setModel(e.target.value)} />
        </label>

        <label>
          Modo
          <select value=${mode} onChange=${(e) => setMode(e.target.value)}>
            <option value="text">Texto</option>
            <option value="image">Imagen</option>
            <option value="video">Video</option>
          </select>
        </label>

        <div className="status-chip">${status}</div>
      </aside>

      <main className="chat-panel">
        <div className="messages">
          ${messages.map(
            (message, i) => html`
              <article key=${`${message.time}-${i}`} className=${`bubble ${message.role}`}>
                <header>
                  <strong>${message.role === 'user' ? 'Tú' : 'IA local'}</strong>
                  <span>${modeLabel[message.mode]}</span>
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
            placeholder=${`Escribe tu solicitud de ${modeLabel[mode].toLowerCase()}...`}
          ></textarea>
          <button type="button" onClick=${sendPrompt} disabled=${!prompt.trim()}>Enviar</button>
        </footer>
      </main>
    </div>
  `
}

createRoot(document.getElementById('root')).render(html`<${App} />`)
