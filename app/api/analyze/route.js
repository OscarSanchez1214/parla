import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // evita que Next intente pre-renderizar

export async function POST(req) {
  try {
    // 1. Leer body
    const { text = '', image, tone = 'natural', goal = 'responder' } = await req.json();

    // 2. Validaciones
    if (!text.trim() && !image) {
      return Response.json({ error: 'Agrega texto o una imagen.' }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'Falta configurar DEEPSEEK_API_KEY en Vercel.' },
        { status: 500 }
      );
    }

    // 3. Instanciar el cliente AQUÍ, no arriba
    const client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey,
    });

    // 4. Construir contenido
    const userContent = [];
    if (image) {
      userContent.push({
        type: 'image_url',
        image_url: { url: image, detail: 'auto' },
      });
    }
    userContent.push({
      type: 'text',
      text:
        `Analiza esta conversación y responde en español.\n` +
        `Objetivo: ${goal}.\n` +
        `Tono preferido: ${tone}.\n` +
        `Texto de la conversación: ${text || '(extrae el chat de la imagen)'}.\n\n` +
        `Devuelve SOLO JSON válido, sin markdown, con esta forma exacta:\n` +
        `{"intent":"...","context":"...","responses":[{"style":"...","text":"..."},{"style":"...","text":"..."},{"style":"...","text":"..."}],"advice":"..."}\n\n` +
        `Reglas:\n` +
        `- Exactamente 3 elementos en "responses".\n` +
        `- Cada "text" debe ser enviable tal cual, sin comillas extra.\n` +
        `- Sé respetuoso, auténtico, no manipulador, no inventes datos.`,
    });

    // 5. Llamar a DeepSeek
    const completion = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-flash',
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente experto en comunicación interpersonal. Siempre respondes con JSON válido y nada más.',
        },
        { role: 'user', content: userContent },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    // 6. Parsear respuesta
    let raw = completion.choices?.[0]?.message?.content?.trim() || '';
    raw = raw.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseErr) {
      console.error('JSON inválido del modelo:', raw);
      return Response.json(
        { error: 'El modelo devolvió un formato inválido. Intenta de nuevo.' },
        { status: 502 }
      );
    }

    const safe = {
      intent: data.intent || 'Sin clasificar',
      context: data.context || 'No se pudo leer el contexto.',
      responses: Array.isArray(data.responses) ? data.responses.slice(0, 3) : [],
      advice: data.advice || '',
    };

    return Response.json(safe);
  } catch (e) {
    console.error('Error en /api/analyze:', e);
    return Response.json(
      { error: e.message || 'Error del servidor' },
      { status: 500 }
    );
  }
}
