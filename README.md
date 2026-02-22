# Local AI Hub

Aplicación web **React** tipo chat (estilo GPT/Gemini) preparada para conectarse a una IA local ejecutándose en tu PC.

## Qué incluye esta base inicial

- Interfaz conversacional para consultas de texto.
- Flujo inicial para solicitudes de generación de imagen.
- Flujo inicial para solicitudes de generación de video.
- Panel para configurar endpoint local y modelo principal.
- Respuestas simuladas listas para reemplazar por tu backend local.

## Ejecutar en local

Como esta primera versión usa módulos ESM por CDN, solo necesitas servir los archivos estáticos:

```bash
python3 -m http.server 4173
```

Luego abre: `http://localhost:4173`

## Próximo paso recomendado

Conectar el botón **Enviar** a tu API local (por ejemplo, `http://localhost:8000/api/ai`) para enrutar prompts a tu modelo en la PC y devolver texto, imágenes o videos reales.
