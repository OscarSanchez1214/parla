import "./styles.css";

export const metadata = {
  title: "PARLA IA — Nunca te quedes sin respuesta",
  description:
    "Pega el mensaje que te enviaron o sube una captura del chat. PARLA IA lee la intención y te devuelve 3 respuestas listas para enviar.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0508",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
