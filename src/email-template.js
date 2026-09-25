// ============================================
// Plantilla de email — Ángeles de Luz
// ============================================

export function emailTemplate({ nombre, angel, contenido, fecha, diaDelCiclo }) {
  const nombreAngel = angel.charAt(0).toUpperCase() + angel.slice(1);
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu mensaje de ${nombreAngel}</title>
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
                Mensaje diario · ${fecha}
              </p>
              ${diaDelCiclo ? `
              <p style="margin:6px 0 0; font-size:11px; color:#64748b; letter-spacing:1px;">
                Camino de luz · día ${diaDelCiclo} de 120
              </p>
              ` : ''}
            </td>
          </tr>
          
          <tr>
            <td style="padding:30px 40px 10px;">
              <h2 style="margin:0 0 8px; font-family: Georgia, serif; font-size:22px; color:#ffffff; font-weight:500;">
                Paz y bien, ${nombre || 'alma'}
              </h2>
              <p style="margin:0; font-size:15px; color:#c9a961; font-style:italic;">
                Hoy camina contigo <strong>${nombreAngel}</strong>
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding:20px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: rgba(201,169,97,0.08); border-left:3px solid #c9a961; border-radius:8px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px; font-size:17px; line-height:1.6; color:#ffffff; font-style:italic; font-family: Georgia, serif;">
                      "${contenido.versiculo}"
                    </p>
                    <p style="margin:0; font-size:13px; color:#e4cc8a; letter-spacing:1px;">
                      — ${contenido.cita_versiculo}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding:10px 40px;">
              <h3 style="margin:0 0 10px; font-family: Georgia, serif; font-size:15px; color:#e4cc8a; text-transform:uppercase; letter-spacing:2px; font-weight:600;">
                🙏 Oración
              </h3>
              <p style="margin:0; font-size:15px; line-height:1.7; color:#e2e8f0;">
                ${contenido.oracion}
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding:20px 40px 10px;">
              <h3 style="margin:0 0 10px; font-family: Georgia, serif; font-size:15px; color:#e4cc8a; text-transform:uppercase; letter-spacing:2px; font-weight:600;">
                💭 Reflexión
              </h3>
              <p style="margin:0; font-size:15px; line-height:1.7; color:#e2e8f0;">
                ${contenido.reflexion}
              </p>
            </td>
          </tr>
          
          ${contenido.bendicion ? `
          <tr>
            <td style="padding:20px 40px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: rgba(228,204,138,0.06); border-radius:10px; border:1px solid rgba(201,169,97,0.25);">
                <tr>
                  <td style="padding:20px 24px; text-align:center;">
                    <p style="margin:0 0 6px; font-size:12px; color:#c9a961; text-transform:uppercase; letter-spacing:2px;">
                      Bendición
                    </p>
                    <p style="margin:0; font-size:16px; line-height:1.6; color:#e4cc8a; font-style:italic; font-family: Georgia, serif;">
                      ${contenido.bendicion}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}
          
          <tr>
            <td style="padding:30px 40px; background: rgba(15,36,64,0.5); border-top:1px solid rgba(201,169,97,0.2); text-align:center;">
              <p style="margin:0 0 10px; font-size:13px; color:#94a3b8;">
                Que la luz te acompañe hoy y siempre.
              </p>
              <p style="margin:0; font-size:11px; color:#64748b; line-height:1.6;">
                Recibes este mensaje porque estás suscrito a Ángeles de Luz.
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