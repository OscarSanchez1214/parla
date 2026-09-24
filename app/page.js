'use client';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [tone, setTone] = useState('natural');
  const [goal, setGoal] = useState('responder');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function analyze() {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      let body = { text, tone, goal };
      if (image) body.image = image;
      const r = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'No fue posible analizar');
      setResult(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function file(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 7 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 7 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(f);
  }

  return (
    <main>
      {/* ============ HEADER ============ */}
      <header className="topbar">
        <div className="brand">
          PARLA<span>IA</span>
        </div>
        <nav className="topnav">
          <a href="#demo">Demo</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#app" className="cta-mini">Acceder a PARLA</a>
        </nav>
      </header>

      {/* ============ HERO ============ */}
      <section className="hero" id="app">
        <h1 className="pixel">
          NUNCA TE QUEDES<br />SIN RESPUESTA
        </h1>
        <p className="sub">
          Pega el mensaje que te enviaron o sube una captura del chat.
          PARLA IA lee la intención y te devuelve <b>3 respuestas listas para enviar</b>.
        </p>

        <div className="banner">
          <p>
            La única app que implementa <span className="accent">técnicas probadas</span> de
            respuesta para dominar cualquier tipo de interacción.
          </p>
          <button className="btn-primary" onClick={analyze} disabled={loading}>
            {loading ? 'ANALIZANDO...' : 'ACCEDER A PARLA ↗'}
          </button>
        </div>

        <div className="trust">
          <span>◈ Entras con tu cuenta de Google</span>
          <span>◈ Corre sobre Google Gemini</span>
          <span>◈ Respuestas gratis, para más, suscríbete</span>
        </div>

        <div className="freebadge">
          <div className="levelbox">
            <b>GRATIS · 3 MINUTOS / SIN REGISTRARTE</b>
            <h3>¿EN QUÉ NIVEL ESTÁS?</h3>
            <p>19 preguntas te dirán en qué banda de la pirámide estás — y cuál es la única sección que te conviene mover primero.</p>
          </div>
          <button className="btn-ghost">Hacer el test</button>
        </div>
      </section>

      {/* ============ WORKSPACE REAL (tu app funcional) ============ */}
      <section className="workspace" id="demo">
        <div className="section-head">
          <span className="kicker">CONVERSACIONES REALES</span>
          <h2>LO QUE PARLA IA PUEDE HACER POR TI</h2>
          <p>Capturas de chats reales</p>
          <div className="tabs">
            <span className="tab active">WhatsApp</span>
            <span className="tab">Instagram</span>
            <span className="tab">Tinder</span>
          </div>
        </div>

        <div className="appgrid">
          {/* Columna izquierda: entradas */}
          <div className="panel">
            <label>01 / CONVERSACIÓN</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Pega aquí los mensajes de WhatsApp, Instagram, Tinder, correo..."
            />
            <div className="upload">
              <input type="file" accept="image/*" onChange={file} />
              <span className="ico">▧</span>
              <div>
                <b>Subir captura de pantalla</b>
                <small>OCR multimodal · PNG, JPG · Máx. 7 MB</small>
              </div>
              {image && (
                <button className="rm" onClick={() => setImage(null)}>
                  ×
                </button>
              )}
            </div>
            {image && (
              <img src={image} alt="Vista previa" className="image-preview" />
            )}
          </div>

          {/* Columna derecha: configuración */}
          <div className="panel options">
            <label>02 / CONFIGURACIÓN</label>
            <div>
              <small>OBJETIVO</small>
              <select value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="responder">Responder con naturalidad</option>
                <option value="conocer">Conocer mejor a la persona</option>
                <option value="poner-limites">Poner límites</option>
                <option value="aclarar">Aclarar un malentendido</option>
                <option value="cerrar">Cerrar la conversación</option>
              </select>
            </div>
            <div>
              <small>TONO</small>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="natural">Natural y auténtico</option>
                <option value="directo">Directo y seguro</option>
                <option value="ingenioso">Ingenioso y divertido</option>
                <option value="persuasivo">Persuasivo y cálido</option>
                <option value="neutro">Neutro y profesional</option>
              </select>
            </div>
            <button
              className="btn-primary full"
              disabled={loading || (!text.trim() && !image)}
              onClick={analyze}
            >
              {loading ? 'ANALIZANDO...' : 'ANALIZAR Y GENERAR ↗'}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {result && (
          <section className="results">
            <div className="resulthead">
              <label>03 / RESPUESTAS GENERADAS</label>
              <span>{result.intent}</span>
            </div>
            <div className="context">
              <b>Lectura del contexto:</b> {result.context}
            </div>
            <div className="cards">
              {result.responses?.map((x, i) => (
                <article key={i}>
                  <div className="cardtop">
                    <b>OPCIÓN 0{i + 1}</b>
                    <span>{x.style}</span>
                  </div>
                  <p>{x.text}</p>
                  <button onClick={() => navigator.clipboard.writeText(x.text)}>
                    COPIAR ↗
                  </button>
                </article>
              ))}
            </div>
            <div className="advice">
              <b>✦ Sugerencia</b>
              <p>{result.advice}</p>
            </div>
          </section>
        )}
      </section>

      {/* ============ CARTAS / MÉTODO ============ */}
      <section className="method">
        <span className="kicker">LAS CARTAS QUE REPARTIMOS</span>
        <h2>APRENDE A JUGAR<br />LAS CARTAS QUE TE DA PARLA IA</h2>

        <div className="method-grid">
          <div className="method-text">
            <p>
              Una IA que responde bien cambia cualquier mensaje: bien puedes
              retomar la conversación en 10 palabras, o pasar a la acción con
              un cierre que no suene forzado.
            </p>
            <p>
              Nadie controla lo que pasa en la vida de la otra persona ni la
              reacción de tu entorno: eso no se puede dominar. Lo que sí se
              puede controlar es la <b>comunicación humana</b>, y cómo se
              bloquea o se abre una conversación según lo que dices.
            </p>
            <p>
              Por eso creemos que <b>PARLA IA</b> es la escalera para aprender
              a sacarle el jugo a la comunicación con amigos, familia, en el
              trabajo, con una pareja o con quien quieras. Aprendes a jugar
              las cartas que te da la vida.
            </p>
          </div>

          <div className="cards-deck">
            <div className="deck-card card-1">
              <span className="suit">♥</span>
              <b>MANTENER EL INTERÉS</b>
              <small>No dejes que la conversación se enfríe. Hay formas.</small>
            </div>
            <div className="deck-card card-2">
              <span className="suit">◆</span>
              <b>HUMOR A TU FAVOR</b>
              <small>Una respuesta con gracia cambia el tono en 3 segundos.</small>
            </div>
            <div className="deck-card card-3">
              <span className="suit">♣</span>
              <b>INICIATIVA Y SEGURIDAD</b>
              <small>Di lo que quieres sin sonar agresivo ni tibio.</small>
            </div>
          </div>
        </div>

        <p className="method-foot">
          Las cartas te las damos nosotros. Jugarlas es aprender.
        </p>
      </section>

      {/* ============ TESTIMONIOS ============ */}
      <section className="testimonials" id="testimonios">
        <span className="kicker">SOBRE LA APP</span>
        <div className="tgrid">
          <article>
            <p>“Bro, estoy hablando con una chica en Tinder. La IA me sugiere un mensaje de cierre y funcionó. Sin contestar en 3 días. Mejoré.”</p>
            <footer><span className="av">K</span> Kevin R.</footer>
          </article>
          <article>
            <p>“Bro, yo antes le metía prompts gigantes a chatgpt y me salía con textos que parecían libros. Ahora uso PARLA IA y es otro nivel.”</p>
            <footer><span className="av">B</span> Bruno M.</footer>
          </article>
        </div>

        <span className="kicker mt">SOBRE ELITE LABIA</span>
        <div className="tgrid three">
          <article>
            <p>“Hermano, honestamente estoy sorprendido. Las respuestas se sienten naturales, no forzadas.”</p>
            <footer><span className="av">S</span> Sebastián A.</footer>
          </article>
          <article>
            <p>“En un principio pensé que era una app de ligue, pero terminó siendo útil para ordenar mis ideas antes de responder a mi jefe.”</p>
            <footer><span className="av">D</span> Diego V.</footer>
          </article>
          <article>
            <p>“Al inicio dudé del precio, pero después de un mes la uso todos los días. Vale la pena.”</p>
            <footer><span className="av">A</span> Andrés O.</footer>
          </article>
        </div>

        <p className="disclaimer">
          Capturas reales. Los nombres han sido cambiados para protegerlos.
        </p>
      </section>

      {/* ============ COMUNIDAD ============ */}
      <section className="community">
        <div className="community-box">
          <div>
            <b>✦ Comunidad PARLA IA en Telegram</b>
            <p>+300 usuarios con acceso libre. Entra al grupo y lee las guías de respuesta que están publicadas.</p>
          </div>
          <button className="btn-primary">Únete →</button>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <div className="foot-stats">
          <div><b>3</b><small>Respuestas por mensaje</small></div>
          <div><b>5</b><small>Técnicas probadas</small></div>
          <div><b>0</b><small>Fricción al usar</small></div>
          <div><b>24/7</b><small>Siempre disponible</small></div>
          <div><b>+300</b><small>Usuarios en la app</small></div>
        </div>
        <p className="legal">
          Al usar este sitio aceptas los <a href="#">Términos</a> y la <a href="#">Política de privacidad</a>.
          <br />Hecho con ❤ en LATAM · <a href="#">Únete</a> a la comunidad.
        </p>
      </footer>
    </main>
  );
}
