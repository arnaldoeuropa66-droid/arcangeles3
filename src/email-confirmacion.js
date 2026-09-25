// ============================================
// Plantilla de email de confirmación — Ángeles de Luz
// ============================================

export function emailConfirmacion({ nombre, email, token, angel, baseUrl }) {
  const nombreAngel = angel.charAt(0).toUpperCase() + angel.slice(1);
  const urlConfirmacion = `${baseUrl}/api/confirmar?token=${token}`;
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirma tu suscripción</title>
</head>
<body style="margin:0; padding:0; background-color:#0f172a; font-family: Georgia, 'Times New Roman', serif; color:#e2e8f0;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0f172a; padding:40px 20px;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background: linear-gradient(180deg, #1a3a5c 0%, #0f2440 100%); border-radius:16px; overflow:hidden; border:1px solid rgba(201,169,97,0.3);">
          
          <tr>
            <td style="padding:40px 30px 30px; text-align:center; border-bottom:2px solid #c9a961;">
              <div style="font-size:36px; margin-bottom:10px;">🕊️</div>
              <h1 style="margin:0; font-family: Georgia, serif; font-size:28px; color:#e4cc8a; font-weight:600; letter-spacing:1px;">
                Ángeles de Luz
              </h1>
              <p style="margin:8px 0 0; font-size:13px; color:#94a3b8; letter-spacing:2px; text-transform:uppercase;">
                Confirma tu suscripción
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 20px; font-family: Georgia, serif; font-size:22px; color:#ffffff; font-weight:500;">
                Paz y bien, ${nombre || 'alma'}
              </h2>
              
              <p style="margin:0 0 20px; font-size:16px; line-height:1.7; color:#e2e8f0;">
                Hemos recibido tu solicitud para caminar junto a <strong style="color:#e4cc8a;">${nombreAngel}</strong>. 
                Solo falta un paso: confirma tu email para activar tu suscripción.
              </p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:30px auto;">
                <tr>
                  <td style="background:#c9a961; border-radius:10px;">
                    <a href="${urlConfirmacion}" style="display:inline-block; padding:16px 32px; font-family: Arial, sans-serif; font-size:16px; font-weight:600; color:#0f172a; text-decoration:none;">
                      ✨ Confirmar mi suscripción
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin:20px 0 0; font-size:14px; line-height:1.7; color:#94a3b8; text-align:center;">
                O copia y pega este enlace en tu navegador:
              </p>
              <p style="margin:10px 0 0; font-size:12px; line-height:1.5; color:#64748b; text-align:center; word-break:break-all;">
                ${urlConfirmacion}
              </p>
              
              <p style="margin:30px 0 0; font-size:13px; line-height:1.7; color:#94a3b8;">
                <strong style="color:#e4cc8a;">⏰ Este enlace caduca en 24 horas.</strong><br>
                Si no has solicitado esta suscripción, puedes ignorar este mensaje.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding:30px 40px; background: rgba(15,36,64,0.5); border-top:1px solid rgba(201,169,97,0.2); text-align:center;">
              <p style="margin:0; font-size:11px; color:#64748b; line-height:1.6;">
                Recibes este mensaje porque alguien ha solicitado suscribirse a Ángeles de Luz con tu email.<br>
                Si no fuiste tú, ignora este mensaje.
              </p>
            </td>
          </tr>
          
        </table>
        
        <p style="margin:20px 0 0; font-size:11px; color:#475569; text-align:center;">
          © 2026 Ángeles de Luz
        </p>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
}