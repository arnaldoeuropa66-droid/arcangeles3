/* ============================================
   Banner de cookies — AEPD compliant
   ============================================ */

(function() {
  'use strict';

  const STORAGE_KEY = 'angeles_cookie_consent_v1';
  const CONSENT_VERSION = 1;

  // ============================================
  // Estado del consentimiento
  // ============================================
  function getConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.version !== CONSENT_VERSION) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(categories) {
    const data = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      categories
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    applyConsent(categories);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: data }));
  }

  function applyConsent(categories) {
    // Aquí se activarían/desactivarían los scripts según la categoría aceptada.
    // Ejemplo:
    // if (categories.analytics) { /* cargar Google Analytics */ }
    // if (categories.marketing) { /* cargar píxeles publicitarios */ }
    console.log('Cookie consent aplicado:', categories);
  }

  // ============================================
  // Construcción del banner
  // ============================================
  function createBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <div class="cookie-banner__text">
          <strong>🍪 Usamos cookies</strong><br>
          Utilizamos cookies propias y de terceros para mejorar tu experiencia y analizar el uso de la web. Puedes aceptarlas todas, rechazarlas o configurarlas. Más información en nuestra
          <a href="/pages/cookies.html">Política de Cookies</a>.
        </div>
        <div class="cookie-banner__actions">
          <button type="button" class="cookie-banner__btn cookie-banner__btn--reject" data-action="reject">
            Rechazar
          </button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--config" data-action="config">
            Configurar
          </button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--accept" data-action="accept">
            Aceptar todas
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    return banner;
  }

  // ============================================
  // Panel de configuración
  // ============================================
  function createConfigPanel() {
    const panel = document.createElement('div');
    panel.className = 'cookie-config';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Configuración de cookies');
    panel.innerHTML = `
      <div class="cookie-config__inner">
        <h2>Configuración de cookies</h2>
        <p>Elige qué categorías de cookies permites. Tu elección se guarda durante 12 meses.</p>

        <div class="cookie-category">
          <div class="cookie-category__info">
            <h3>Cookies necesarias</h3>
            <p>Imprescindibles para el funcionamiento del sitio. No se pueden desactivar.</p>
          </div>
          <label class="cookie-category__switch">
            <input type="checkbox" checked disabled>
            <span class="cookie-category__slider"></span>
          </label>
        </div>

        <div class="cookie-category">
          <div class="cookie-category__info">
            <h3>Cookies analíticas</h3>
            <p>Nos ayudan a entender cómo se usa la web para mejorarla.</p>
          </div>
          <label class="cookie-category__switch">
            <input type="checkbox" data-category="analytics" checked>
            <span class="cookie-category__slider"></span>
          </label>
        </div>

        <div class="cookie-category">
          <div class="cookie-category__info">
            <h3>Cookies de marketing</h3>
            <p>Se usan para mostrarte contenido y anuncios personalizados.</p>
          </div>
          <label class="cookie-category__switch">
            <input type="checkbox" data-category="marketing" checked>
            <span class="cookie-category__slider"></span>
          </label>
        </div>

        <div class="cookie-config__actions">
          <button type="button" class="cookie-banner__btn cookie-banner__btn--accept" data-action="save">
            Guardar preferencias
          </button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--accept" data-action="accept-all">
            Aceptar todas
          </button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--reject" data-action="reject-all">
            Rechazar todas
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    return panel;
  }

  // ============================================
  // Lógica de interacción
  // ============================================
  function init() {
    const existingConsent = getConsent();

    if (existingConsent) {
      applyConsent(existingConsent.categories);
      return;
    }

    const banner = createBanner();
    const configPanel = createConfigPanel();

    // Mostrar banner tras un pequeño delay (mejor UX)
    setTimeout(() => banner.classList.add('visible'), 600);

    function closeBanner() {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 500);
    }

    function handleBannerAction(action) {
      if (action === 'accept') {
        const cats = { necessary: true, analytics: true, marketing: true };
        saveConsent(cats);
        closeBanner();
      } else if (action === 'reject') {
        const cats = { necessary: true, analytics: false, marketing: false };
        saveConsent(cats);
        closeBanner();
      } else if (action === 'config') {
        banner.classList.remove('visible');
        configPanel.classList.add('visible');
      }
    }

    function handleConfigAction(action) {
      if (action === 'accept-all') {
        configPanel.querySelectorAll('[data-category]').forEach(cb => cb.checked = true);
      } else if (action === 'reject-all') {
        configPanel.querySelectorAll('[data-category]').forEach(cb => cb.checked = false);
      } else if (action === 'save') {
        const cats = { necessary: true };
        configPanel.querySelectorAll('[data-category]').forEach(cb => {
          cats[cb.dataset.category] = cb.checked;
        });
        saveConsent(cats);
        configPanel.classList.remove('visible');
        closeBanner();
      }
    }

    banner.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (btn) handleBannerAction(btn.dataset.action);
    });

    configPanel.addEventListener('click', (e) => {
      if (e.target === configPanel) return; // no cerrar al hacer click fuera
      const btn = e.target.closest('[data-action]');
      if (btn) handleConfigAction(btn.dataset.action);
    });
  }

  // ============================================
  // API pública para que el usuario pueda reabrir
  // ============================================
  window.openCookieConfig = function() {
    const existing = getConsent();
    const panel = document.querySelector('.cookie-config') || createConfigPanel();
    if (existing) {
      panel.querySelectorAll('[data-category]').forEach(cb => {
        cb.checked = !!existing.categories[cb.dataset.category];
      });
    }
    panel.classList.add('visible');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();