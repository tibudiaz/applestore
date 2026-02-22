import React, { useMemo, useState } from 'https://esm.sh/react@18.3.1'
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client'
import htm from 'https://esm.sh/htm@3.1.1'

const html = htm.bind(React.createElement)

const modeLabel = { text: 'Respuesta', image: 'Imagen', video: 'Video' }
const modePromptLabel = { text: 'respuesta', image: 'imagen', video: 'video' }

const initialMessages = [
  {
    id: crypto.randomUUID(),
    role: 'assistant',
    mode: 'text',
    content:
      '¡Listo! Este chat está preparado para conectarse a tu IA local y trabajar como ChatGPT con texto, imagen o video.',
    time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
  },
]

async function callLocalAI({ endpoint, model, mode, prompt, quality }) {
  const payload = {
    model,
    mode,
    prompt,
    quality,
    stream: false,
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    return {
      content: data.content ?? data.message ?? 'Respuesta recibida desde tu IA local.',
      assetUrl: data.assetUrl ?? data.imageUrl ?? data.videoUrl ?? null,
      mimeType: data.mimeType ?? null,
    }
  } catch {
    const mockedAsset =
      mode === 'image'
        ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=100'
        : mode === 'video'
          ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
          : null

    return {
      content:
        mode === 'text'
          ? `Respuesta simulada en calidad ${quality} para el modelo ${model}. Conecta tu endpoint para usar inferencia real.`
          : `Generación simulada de ${modeLabel[mode].toLowerCase()} en calidad ${quality}. Reemplaza con tu backend local cuando lo tengas listo.`,
      assetUrl: mockedAsset,
      mimeType: mode === 'image' ? 'image/jpeg' : mode === 'video' ? 'video/mp4' : null,
    }
  }
}

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [quality, setQuality] = useState('best')
  const [endpoint, setEndpoint] = useState('http://localhost:8000/api/chat')
  const [model, setModel] = useState('local-gpu-model')
  const [isLoading, setIsLoading] = useState(false)

  const status = useMemo(
    () => (isLoading ? 'Consultando IA local…' : endpoint ? `Conectado a: ${endpoint}` : 'Sin endpoint'),
    [endpoint, isLoading],
  )

  const sendPrompt = async () => {
    if (!prompt.trim() || isLoading) return

    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      mode,
      content: prompt.trim(),
      quality,
      time: now,
    }

    setMessages((prev) => [...prev, userMessage])
    setPrompt('')
    setIsLoading(true)

    const ai = await callLocalAI({ endpoint, model, mode, prompt: userMessage.content, quality })

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        mode,
        content: ai.content,
        quality,
        assetUrl: ai.assetUrl,
        mimeType: ai.mimeType,
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      },
    ])

    setIsLoading(false)
  }

  return html`
    <div className="app-shell">
      <aside className="sidebar glass">
        <h1>Local AI Chat</h1>
        <p>Interfaz estilo ChatGPT para trabajar con tu IA local.</p>

        <label>
          Endpoint API local
          <input value=${endpoint} onInput=${(e) => setEndpoint(e.target.value)} />
        </label>

        <label>
          Modelo
          <input value=${model} onInput=${(e) => setModel(e.target.value)} />
        </label>

        <label>
          Tipo de salida
          <select value=${mode} onChange=${(e) => setMode(e.target.value)}>
            <option value="text">Solo respuestas</option>
            <option value="image">Crear imagen</option>
            <option value="video">Crear video</option>
          </select>
        </label>

        <label>
          Calidad
          <select value=${quality} onChange=${(e) => setQuality(e.target.value)}>
            <option value="best">Máxima (best)</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
          </select>
        </label>

        <div className="status-chip">${status}</div>
      </aside>

      <main className="chat glass">
        <section className="messages">
          ${messages.map(
            (message) => html`
              <article key=${message.id} className=${`bubble ${message.role}`}>
                <header>
                  <strong>${message.role === 'assistant' ? 'IA local' : 'Tú'}</strong>
                  <span>${modeLabel[message.mode]}</span>
                  ${message.quality ? html`<span className="quality">${message.quality}</span>` : null}
                  <time>${message.time}</time>
                </header>
                <p>${message.content}</p>

                ${message.assetUrl && message.mode === 'image'
                  ? html`
                      <figure className="asset-box">
                        <img src=${message.assetUrl} alt="Imagen generada por IA" loading="lazy" />
                        <a href=${message.assetUrl} download="imagen-generada-maxima-calidad.jpg"
                          >Descargar imagen en máxima calidad</a
                        >
                      </figure>
                    `
                  : null}

                ${message.assetUrl && message.mode === 'video'
                  ? html`
                      <figure className="asset-box">
                        <video src=${message.assetUrl} controls playsinline></video>
                        <a href=${message.assetUrl} download="video-generado-maxima-calidad.mp4"
                          >Descargar video en máxima calidad</a
                        >
                      </figure>
                    `
                  : null}
              </article>
            `,
          )}
        </section>

        <footer className="composer">
          <textarea
            rows="3"
            value=${prompt}
            onInput=${(e) => setPrompt(e.target.value)}
            placeholder=${`Escribe tu solicitud para ${modePromptLabel[mode]}...`}
          ></textarea>
          <button type="button" onClick=${sendPrompt} disabled=${!prompt.trim() || isLoading}>
            ${isLoading ? 'Generando…' : 'Enviar'}
          </button>
        </footer>
      </main>
    </div>
  `
}

createRoot(document.getElementById('root')).render(html`<${App} />`)
