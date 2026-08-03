// Función serverless de Vercel: recibe el formulario y envía el correo desde nuestro propio dominio.
// Requisitos (una sola vez, en Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   clave de resend.com
//   MAIL_TO          info@velourpixel.com
//   MAIL_FROM        web@velourpixel.com  (dominio verificado en Resend con SPF/DKIM)
// Cuando estén puestas, cambiamos el fetch del formulario a "/api/contact".

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const nombre = String(b.Nombre || "").trim();
  const contacto = String(b.Contacto || "").trim();
  if (!nombre || !contacto) return res.status(400).json({ error: "missing_fields" });

  const clean = (v) => String(v == null ? "—" : v).slice(0, 4000);
  const rows = [
    ["Nombre / empresa", nombre],
    ["Contacto", contacto],
    ["Servicios", clean(b.Servicios)],
    ["Presupuesto", clean(b.Presupuesto)],
    ["Proyecto", clean(b.Proyecto)],
    ["Origen", clean(b.Origen)],
  ];

  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const html =
    '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;font-size:14px;color:#111">' +
    '<p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#888;margin:0 0 14px">velourpixel.com · nuevo proyecto</p>' +
    '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse">' +
    rows.map(([k, v]) =>
      '<tr><td style="border-bottom:1px solid #eee;color:#888;white-space:nowrap;vertical-align:top">' + esc(k) +
      '</td><td style="border-bottom:1px solid #eee;white-space:pre-line">' + esc(v) + "</td></tr>").join("") +
    "</table></div>";

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Velour Web <" + (process.env.MAIL_FROM || "web@velourpixel.com") + ">",
        to: [process.env.MAIL_TO || "info@velourpixel.com"],
        reply_to: contacto.includes("@") ? contacto : undefined,
        subject: "Nuevo proyecto · " + nombre,
        html,
      }),
    });
    if (!r.ok) return res.status(502).json({ error: "mail_provider", detail: await r.text() });
    return res.status(200).json({ success: "true" });
  } catch (e) {
    return res.status(500).json({ error: "unexpected" });
  }
}
