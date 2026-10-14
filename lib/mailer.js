const https = require('https');
const nodemailer = require('nodemailer');

const FROM_EMAIL = () => process.env.EMAIL_FROM || '"KAWSAY Cultura" <notificaciones@asoma.live>';

function isEmailConfigured() {
  return !!(process.env.RESEND_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS));
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  }
  return null;
}

/**
 * Envío directo a través de la API REST oficial de Resend (Rápido, confiable en Serverless y sin bloqueos de puerto)
 */
async function sendViaResendApi({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      from: FROM_EMAIL(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html
    });

    const req = https.request('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body || '{}');
          if (res.statusCode >= 400) {
            return reject(new Error(json.message || `Resend Error HTTP ${res.statusCode}: ${body}`));
          }
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Enviar correo (usa Resend API como primera opción, SMTP como segunda, o simulación si no hay credenciales)
 */
async function dispatchEmail({ to, subject, html, logType = 'Email' }) {
  // 1. Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const data = await sendViaResendApi({ to, subject, html });
      console.log(`🚀 [RESEND API] ${logType} enviado exitosamente a ${to} (ID: ${data.id})`);
      return { success: true, id: data.id, provider: 'resend' };
    } catch (err) {
      console.error(`⚠️ [RESEND API Error] al enviar a ${to}:`, err.message);
      // continuar con fallback
    }
  }

  // 2. SMTP tradicional (Nodemailer)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: FROM_EMAIL(),
        to,
        subject,
        html
      });
      console.log(`📧 [SMTP] ${logType} enviado a ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId, provider: 'smtp' };
    } catch (err) {
      console.error(`⚠️ [SMTP Error] al enviar a ${to}:`, err.message);
      return { success: false, error: err.message };
    }
  }

  // 3. Simulación para desarrollo local si no hay credenciales
  console.log(`[SIMULACIÓN ${logType.toUpperCase()}] Para: ${to} | Asunto: ${subject}`);
  return { success: true, simulated: true };
}

/**
 * Enviar correo de Bienvenida / Registro
 */
async function sendWelcomeEmail({ to, email, name = 'Usuario', role = 'espectador' }) {
  const recipient = to || email;
  const roleName = role ? role.toUpperCase() : 'ESPECTADOR';
  const subject = `✨ ¡Bienvenido/a a KAWSAY, ${name}! Tu cuenta está lista`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0c; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 40px auto; background-color: #121216; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; }
        .header { background: #18181b; padding: 24px; border-bottom: 1px solid #27272a; text-align: center; }
        .logo { font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #ffffff; }
        .logo span { color: #c6f135; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .badge { display: inline-block; background: rgba(198, 241, 53, 0.15); color: #c6f135; border: 1px solid rgba(198, 241, 53, 0.3); font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; }
        .title { font-size: 22px; font-weight: 800; margin: 0 0 12px; color: #ffffff; }
        .text { color: #a1a1aa; font-size: 14px; margin-bottom: 24px; }
        .card { background: #1c1c22; border: 1px solid #2e2e38; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
        .btn { display: inline-block; background: #c6f135; color: #000000 !important; text-decoration: none; font-weight: 900; font-size: 13px; letter-spacing: 0.5px; padding: 14px 28px; border-radius: 8px; text-align: center; text-transform: uppercase; }
        .footer { background: #0e0e11; padding: 20px; text-align: center; font-size: 11px; color: #71717a; border-top: 1px solid #27272a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">KAWSAY <span>QUITO</span></div>
        </div>
        <div class="content">
          <div class="badge">Cuenta Activada Exitosamente</div>
          <h1 class="title">¡Hola, ${name}!</h1>
          <p class="text">
            Te damos la bienvenida a la plataforma que centraliza y conecta toda la cultura viva de Quito. Ahora puedes descubrir eventos exclusivos, guardar tus favoritos en el calendario y explorar los espacios culturales en tiempo real.
          </p>
          <div class="card">
            <div style="font-size: 11px; color: #c6f135; font-weight: 800; text-transform: uppercase; margin-bottom: 8px;">Detalles de tu cuenta</div>
            <div style="color: #ffffff; font-size: 13px;"><strong>Correo:</strong> ${recipient}</div>
            <div style="color: #ffffff; font-size: 13px; margin-top: 4px;"><strong>Perfil:</strong> ${roleName}</div>
          </div>
          <div style="text-align: center; margin: 32px 0 16px;">
            <a href="https://asoma.live" class="btn" target="_blank">Explorar Cartelera de Quito →</a>
          </div>
        </div>
        <div class="footer">
          © 2026 KAWSAY — Descubre lo que está pasando en Quito.<br>
          <a href="https://asoma.live" style="color: #a1a1aa; text-decoration: underline;">asoma.live</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return dispatchEmail({ to: recipient, subject, html, logType: 'Bienvenida' });
}

/**
 * Enviar código OTP para Recuperación de Contraseña
 */
async function sendPasswordResetEmail({ to, email, name = 'Usuario', code }) {
  const recipient = to || email;
  const subject = `🔐 Código ${code} para restablecer tu contraseña en KAWSAY`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0c; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 540px; margin: 40px auto; background-color: #121216; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; }
        .header { background: #18181b; padding: 22px; border-bottom: 1px solid #27272a; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #ffffff; }
        .logo span { color: #c6f135; }
        .content { padding: 32px 28px; line-height: 1.6; text-align: center; }
        .title { font-size: 20px; font-weight: 800; margin: 0 0 12px; color: #ffffff; }
        .text { color: #a1a1aa; font-size: 14px; margin-bottom: 24px; }
        .code-box { background: #09090b; border: 2px dashed #c6f135; border-radius: 10px; padding: 18px; margin: 24px 0; font-family: monospace; font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #c6f135; display: inline-block; width: 80%; }
        .warning { font-size: 12px; color: #71717a; margin-top: 18px; }
        .footer { background: #0e0e11; padding: 18px; text-align: center; font-size: 11px; color: #71717a; border-top: 1px solid #27272a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">KAWSAY <span>QUITO</span></div>
        </div>
        <div class="content">
          <h1 class="title">Recuperación de Contraseña</h1>
          <p class="text">
            Hola ${name}. Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en KAWSAY. Introduce el siguiente código de seguridad en la aplicación:
          </p>
          <div class="code-box">${code}</div>
          <p class="text" style="margin-top: 12px;">
            Este código de verificación expira en <strong>15 minutos</strong>.
          </p>
          <div class="warning">
            Si no solicitaste este código, puedes ignorar este mensaje con tranquilidad. Tu contraseña permanecerá intacta.
          </div>
        </div>
        <div class="footer">
          © 2026 KAWSAY — Plataforma Cultural de Quito.<br>
          <a href="https://asoma.live" style="color: #a1a1aa; text-decoration: underline;">asoma.live</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return dispatchEmail({ to: recipient, subject, html, logType: 'Recuperación OTP' });
}

module.exports = {
  isEmailConfigured,
  getTransporter,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
