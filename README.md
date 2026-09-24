# LabIA Copilot

## Instalación local
1. Instala Node.js 18+.
2. Ejecuta `npm install`.
3. Copia `.env.example` a `.env.local` y agrega `OPENAI_API_KEY`.
4. Ejecuta `npm run dev` y abre http://localhost:3000.

## Despliegue en Vercel
Importa el proyecto, configura `OPENAI_API_KEY` y opcionalmente `OPENAI_MODEL` en Environment Variables, luego despliega.

## Seguridad y mejoras recomendadas
- Añadir autenticación Google con Auth.js.
- Implementar límites por usuario y registro de consumo.
- No almacenar conversaciones sin consentimiento explícito.
- Añadir moderación, cifrado y política de privacidad.
