import { Resend } from 'resend';
import { emailTemplate } from './email-template.js';
import { emailConfirmacion } from './email-confirmacion.js';

// ============================================
// CONFIGURACIÓN
// ============================================
const BASE_URL = 'https://angeles-de-luz.arnaldoeuropa66.workers.dev';
const DIAS_EXPIRACION_TOKEN = 1; // 24 horas
const FECHA_BASE_CICLO = new Date('2026-09-23T00:00:00Z');
const DIAS_CICLO = 120;

// ============================================
// UTILIDADES
// ============================================
function calcularDiaCiclo(fecha) {
  const fechaUTC = new Date(fecha.toISOString().split('T')[0] + 'T00:00:00Z');
  const dias = Math.floor((fechaUTC - FECHA_BASE_CICLO) / (1000 * 60 * 60 * 24));
  return ((dias % DIAS_CICLO) + DIAS_CICLO) % DIAS_CICLO + 1;
}

const ANGELES_VALIDOS = ['miguel', 'gabriel', 'rafael', 'uriel', 'chamuel', 'zadkiel', 'jophiel'];

function generarToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================
// WORKER
// ============================================
export default {
  // ============================================
  // FETCH — Sirve la web y los endpoints de API
  // ============================================
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --------------------------------------------
    // /api/status — Health check
    // --------------------------------------------
    if (url.pathname === '/api/status') {
      try {
        const usuariosPrueba = await env.DB.prepare(
          'SELECT COUNT(*) as total FROM usuarios_prueba WHERE activo = 1'
        ).first();

        const contenidoTotal = await env.DB.prepare(
          'SELECT COUNT(*) as total FROM contenido_diario'
        ).first();

        return new Response(JSON.stringify({
          status: 'ok',
          mensaje: 'Ángeles de Luz — API funcionando',
          base_datos: 'conectada',
          usuarios_prueba_activos: usuariosPrueba?.total || 0,
          piezas_contenido: contenidoTotal?.total || 0,
          timestamp: new Date().toISOString()
        }, null, 2), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          status: 'error',
          mensaje: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // --------------------------------------------
    // /api/contenido-hoy — Devuelve el contenido del día del ciclo
    // --------------------------------------------
    if (url.pathname === '/api/contenido-hoy') {
      const angel = url.searchParams.get('angel');
      const fechaParam = url.searchParams.get('fecha');
      const fechaStr = fechaParam || new Date().toISOString().split('T')[0];

      if (!angel) {
        return new Response(JSON.stringify({
          status: 'error',
          mensaje: 'Falta el parámetro ?angel=. Ejemplo: /api/contenido-hoy?angel=miguel'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        return new Response(JSON.stringify({
          status: 'error',
          mensaje: 'Formato de fecha inválido. Usa YYYY-MM-DD.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      try {
        const fecha = new Date(fechaStr + 'T00:00:00Z');
        const diaDelCiclo = calcularDiaCiclo(fecha);

        const contenido = await env.DB.prepare(
          `SELECT angel_slug, dia_ciclo, versiculo, cita_versiculo, 
                  oracion, reflexion, bendicion, imagen_url
           FROM contenido_diario
           WHERE angel_slug = ? AND dia_ciclo = ?
           LIMIT 1`
        ).bind(angel, diaDelCiclo).first();

        if (!contenido) {
          return new Response(JSON.stringify({
            status: 'sin_contenido',
            mensaje: `No hay contenido para el ángel "${angel}" en el día del ciclo ${diaDelCiclo}.`,
            angel,
            fecha: fechaStr,
            dia_ciclo: diaDelCiclo
          }, null, 2), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          status: 'ok',
          angel,
          fecha: fechaStr,
          dia_ciclo: diaDelCiclo,
          contenido
        }, null, 2), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });

      } catch (error) {
        return new Response(JSON.stringify({
          status: 'error',
          mensaje: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // --------------------------------------------
    // /api/suscribirse — Alta de nuevo suscriptor
    // POST con { email, nombre, angel, canal, consentimiento }
    // --------------------------------------------
    if (url.pathname === '/api/suscribirse' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { email, nombre, angel, canal, consentimiento } = body;

        // Validaciones
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return new Response(JSON.stringify({
            status: 'error',
            mensaje: 'Email inválido.'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (!angel || !ANGELES_VALIDOS.includes(angel)) {
          return new Response(JSON.stringify({
            status: 'error',
            mensaje: 'Ángel inválido.'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (!consentimiento) {
          return new Response(JSON.stringify({
            status: 'error',
            mensaje: 'Debes aceptar la política de privacidad.'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // ¿Ya existe?
        const existente = await env.DB.prepare(
          'SELECT id, activo, fecha_confirmacion FROM usuarios_prueba WHERE email = ? LIMIT 1'
        ).bind(email).first();

        if (existente && existente.fecha_confirmacion) {
          return new Response(JSON.stringify({
            status: 'ya_suscrito',
            mensaje: 'Este email ya está suscrito. Revisa tu bandeja de entrada.'
          }), {
            status: 409,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Generar token y fechas
        const token = generarToken();
        const ahora = Math.floor(Date.now() / 1000);
        const expiracion = ahora + (DIAS_EXPIRACION_TOKEN * 86400);
        const ip = request.headers.get('CF-Connecting-IP') || 'desconocida';

        // Insertar o actualizar
        if (existente) {
          await env.DB.prepare(
            `UPDATE usuarios_prueba 
             SET token_confirmacion = ?, fecha_expiracion_token = ?, ip_registro = ?, 
                 consentimiento_version = ?, angel_slug = ?, canal = ?, nombre = ?, activo = 0
             WHERE email = ?`
          ).bind(token, expiracion, ip, 'v1.0', angel, canal || 'email', nombre || null, email).run();
        } else {
          await env.DB.prepare(
            `INSERT INTO usuarios_prueba 
             (email, nombre, angel_slug, canal, activo, fecha_alta, token_confirmacion, 
              fecha_expiracion_token, ip_registro, consentimiento_version)
             VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`
          ).bind(email, nombre || null, angel, canal || 'email', ahora, token, expiracion, ip, 'v1.0').run();
        }

        // Enviar email de confirmación
        const resend = new Resend(env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
          from: 'Ángeles de Luz <onboarding@resend.dev>',
          to: [email],
          subject: '🕊️ Confirma tu suscripción a Ángeles de Luz',
          html: emailConfirmacion({ nombre, email, token, angel, baseUrl: BASE_URL })
        });

        if (error) {
          console.error('Error enviando email de confirmación:', error.message);
          return new Response(JSON.stringify({
            status: 'error',
            mensaje: 'No se pudo enviar el email de confirmación.'
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          status: 'ok',
          mensaje: 'Te hemos enviado un email. Revisa tu bandeja de entrada (y spam) para confirmar tu suscripción.'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error('Error en /api/suscribirse:', error.message);
        return new Response(JSON.stringify({
          status: 'error',
          mensaje: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // --------------------------------------------
    // /api/confirmar — Confirmación de email con token
    // GET ?token=xxx
    // --------------------------------------------
    if (url.pathname === '/api/confirmar') {
      const token = url.searchParams.get('token');

      if (!token) {
        return new Response('Token no proporcionado.', {
          status: 400,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }

      try {
        const usuario = await env.DB.prepare(
          `SELECT id, email, nombre, angel_slug, fecha_expiracion_token, fecha_confirmacion
           FROM usuarios_prueba
           WHERE token_confirmacion = ?
           LIMIT 1`
        ).bind(token).first();

        if (!usuario) {
          return new Response('Token inválido o ya utilizado. Si crees que es un error, escríbenos.', {
            status: 404,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        }

        if (usuario.fecha_confirmacion) {
          return Response.redirect(`${BASE_URL}/confirmado.html`, 302);
        }

        const ahora = Math.floor(Date.now() / 1000);

        if (usuario.fecha_expiracion_token && ahora > usuario.fecha_expiracion_token) {
          return new Response('El enlace ha caducado. Por favor, solicita una nueva suscripción desde la web.', {
            status: 410,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        }

        // Activar usuario
        await env.DB.prepare(
          `UPDATE usuarios_prueba 
           SET activo = 1, fecha_confirmacion = ?, token_confirmacion = NULL, fecha_expiracion_token = NULL
           WHERE id = ?`
        ).bind(ahora, usuario.id).run();

        return Response.redirect(`${BASE_URL}/confirmado.html`, 302);

      } catch (error) {
        console.error('Error en /api/confirmar:', error.message);
        return new Response('Error al procesar la confirmación.', {
          status: 500,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    }

    // --------------------------------------------
    // Todo lo demás → assets estáticos
    // --------------------------------------------
    return env.ASSETS.fetch(request);
  },

  // ============================================
  // SCHEDULED — Se ejecuta automáticamente según el cron
  // (todos los días a las 6:00 UTC)
  // ============================================
  async scheduled(event, env, ctx) {
    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const diaDelCiclo = calcularDiaCiclo(ahora);

    console.log('═══════════════════════════════════════════');
    console.log('🕊️  CRON ÁNGELES DE LUZ — Ejecución diaria');
    console.log(`📅 Fecha: ${fecha}`);
    console.log(`📆 Día del ciclo: ${diaDelCiclo}/${DIAS_CICLO}`);
    console.log(`⏰ Hora UTC: ${ahora.toISOString()}`);
    console.log('───────────────────────────────────────────');

    try {
      const resend = new Resend(env.RESEND_API_KEY);

      const usuarios = await env.DB.prepare(
        `SELECT id, email, nombre, angel_slug, canal
         FROM usuarios_prueba
         WHERE activo = 1
         ORDER BY angel_slug, email`
      ).all();

      if (!usuarios.results || usuarios.results.length === 0) {
        console.log('ℹ️ No hay usuarios activos para enviar.');
        return;
      }

      console.log(`👥 Usuarios activos: ${usuarios.results.length}`);
      console.log('───────────────────────────────────────────');

      for (const usuario of usuarios.results) {
        const contenido = await env.DB.prepare(
          `SELECT versiculo, cita_versiculo, oracion, reflexion, bendicion
           FROM contenido_diario
           WHERE angel_slug = ? AND dia_ciclo = ?
           LIMIT 1`
        ).bind(usuario.angel_slug, diaDelCiclo).first();

        if (!contenido) {
          console.log(`⏭️ Sin contenido para ${usuario.angel_slug} (día ${diaDelCiclo})`);
          continue;
        }

        const { data, error } = await resend.emails.send({
          from: 'Ángeles de Luz <onboarding@resend.dev>',
          to: [usuario.email],
          subject: `Tu mensaje de hoy: ${usuario.angel_slug}`,
          html: emailTemplate({
            nombre: usuario.nombre,
            angel: usuario.angel_slug,
            contenido,
            fecha,
            diaDelCiclo
          }),
        });

        if (error) {
          console.error(`❌ Error enviando a ${usuario.email}:`, error.message);
        } else {
          console.log(`✅ Enviado a ${usuario.email} (ID: ${data.id})`);

          await env.DB.prepare(
            `INSERT INTO envios_diarios (usuario_id, angel_slug, fecha_envio, canal, estado)
             VALUES (?, ?, ?, ?, 'enviado')`
          ).bind(usuario.id, usuario.angel_slug, Math.floor(ahora.getTime() / 1000), usuario.canal).run();
        }
      }

      console.log('───────────────────────────────────────────');
      console.log('✅ Cron completado');
      console.log('═══════════════════════════════════════════');

    } catch (error) {
      console.error('❌ Error en el cron:', error.message);
      console.error(error.stack);
    }
  }
};