# Local AI Hub

Aplicación web **React** estilo ChatGPT para conectarte a una IA local y generar:

- Respuestas de texto.
- Imágenes.
- Videos.

También permite visualizar y descargar imágenes/videos generados en máxima calidad (`best`).

## Ejecutar en local

```bash
python3 -m http.server 4173
```

Abrir: `http://localhost:4173`

## Endpoint esperado

La app envía peticiones `POST` al endpoint configurado (por defecto `http://localhost:8000/api/chat`) con este payload:

```json
{
  "model": "local-gpu-model",
  "mode": "text | image | video",
  "prompt": "tu mensaje",
  "quality": "best | high | medium",
  "stream": false
}
```

Respuesta sugerida de tu backend:

```json
{
  "content": "texto de respuesta",
  "assetUrl": "https://...",
  "mimeType": "image/jpeg | video/mp4"
}
```

## Archivos de colecciones

Se crearon estos archivos base para que los completes:

- `src/collections/endpoints.collection.json`
- `src/collections/models.collection.json`
- `src/collections/workflows.collection.json`
