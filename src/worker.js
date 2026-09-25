import { Resend } from 'resend';
import { emailTemplate } from './email-template.js';

// ============================================
// CONFIGURACIÓN DEL CICLO
// ============================================
const FECHA_BASE = new Date('2026-09-23T00:00:00Z');
const DIAS_CICLO = 120;

/**
 * Calcula el día del ciclo (1-120) para una fecha dada.
 * Si la fecha es anterior a la base, envuelve correctamente.
 */
function calcularDiaCiclo(fecha) {
  const fechaUTC = new Date(fecha.toISOString().split('T')[0] + 'T00:00:00Z');
  const dias = Math.floor((fechaUTC - FECHA_BASE) / (1000 * 60 * 60 * 24));
  return ((dias % DIAS_CICLO) + DIAS_CICLO) % DIAS_CICLO + 1;
}

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
    // Parámetros: ?angel=miguel  (obligatorio)
    //             ?fecha=2026-09-22  (opcional, por defecto hoy)
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