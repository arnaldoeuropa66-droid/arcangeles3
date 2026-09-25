/* ============================================
   ÁNGELES DE LUZ — Interactividad Completa
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MENÚ MÓVIL
  // ==========================================
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('navLinks');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.textContent = isOpen ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  // ==========================================
  // 2. SMOOTH SCROLL CON OFFSET
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#suscribirse') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // 3. ANIMACIONES AL HACER SCROLL (Fade In Up)
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-section').forEach(el => {
    observer.observe(el);
  });

  // ==========================================
  // 4. MODAL "ANTES DE IRTE..." (Exit Intent)
  // ==========================================
  const modal = document.getElementById('exitModal');
  const modalClose = document.querySelector('.modal-close');
  let modalShown = false;

  const showModal = () => {
    if (!modalShown && !localStorage.getItem('angeles_modal_closed')) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      modalShown = true;
    }
  };

  document.addEventListener('mouseleave', e => {
    if (e.clientY < 0) showModal();
  });

  setTimeout(() => {
    if (window.innerWidth < 768) showModal();
  }, 15000);

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      localStorage.setItem('angeles_modal_closed', 'true');
    });
  }

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      localStorage.setItem('angeles_modal_closed', 'true');
    }
  });

  // ==========================================
  // 5. ESTRELLAS Y DESTELLOS DE FONDO
  // ==========================================
  const starsContainer = document.getElementById('starsContainer');
  if (starsContainer) {
    
    const starCount = 30;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      
      const duration = Math.random() * 15 + 15;
      star.style.animationDuration = `${duration}s`;
      
      const delay = Math.random() * 20;
      star.style.animationDelay = `${delay}s`;
      
      if (Math.random() > 0.7) {
        star.classList.add('golden');
      }

      starsContainer.appendChild(star);
    }
  }

  // ==========================================
  // 6. REPRODUCTOR DE AUDIO
  // ==========================================
  const audioPlayer = document.querySelector('.audio-player');
  if (audioPlayer) {
    const playBtn = audioPlayer.querySelector('.play-btn');
    const audio = audioPlayer.querySelector('audio');
    
    if (playBtn && audio) {
      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play();
          playBtn.textContent = '⏸️';
        } else {
          audio.pause();
          playBtn.textContent = '▶️';
        }
      });
    }
  }

  // ==========================================
  // 7. FORMULARIO NEWSLETTER
  // ==========================================
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      if (email) {
        alert(`¡Gracias! Te enviaremos los pasos a ${email} en los próximos minutos. 🕊️`);
        newsletterForm.reset();
      }
    });
  }

  // ==========================================
  // 8. CONTADOR ANIMADO
  // ==========================================
  const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start).toLocaleString();
      }
    }, 16);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.counter);
        if (target) animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  });

  document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

  // ==========================================
  // 9. ÁNGELES ETÉREOS DIFUMINADOS CON PARALLAX
  // ==========================================
  const angelsLayer = document.getElementById('angelsLayer');
  
  if (angelsLayer && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    
    // ============================================================
    // SVG DE ÁNGEL — Silueta con alas, aureola y túnica
    // ============================================================
    const angelSVG = (color) => {
      const uid = Math.random().toString(36).slice(2, 8);
      const gradId = `ag-${color}-${uid}`;
      const glowId = `gl-${color}-${uid}`;
      const softId = `sf-${color}-${uid}`;
      
      const palette = color === 'gold' 
        ? { core: '#f6e8c0', mid: '#c9a961', deep: '#a8873f', edge: 'rgba(201,169,97,0)' }
        : { core: '#dfeaf8', mid: '#6a9bd4', deep: '#2c5f8a', edge: 'rgba(106,155,212,0)' };

      return `
        <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="${glowId}" cx="50%" cy="42%" r="62%">
              <stop offset="0%"   stop-color="${palette.core}" stop-opacity="0.85"/>
              <stop offset="30%"  stop-color="${palette.mid}"  stop-opacity="0.5"/>
              <stop offset="65%"  stop-color="${palette.mid}"  stop-opacity="0.18"/>
              <stop offset="100%" stop-color="${palette.edge}" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stop-color="${palette.core}" stop-opacity="0.95"/>
              <stop offset="55%"  stop-color="${palette.mid}"  stop-opacity="0.7"/>
              <stop offset="100%" stop-color="${palette.deep}" stop-opacity="0.25"/>
            </linearGradient>
            <filter id="${softId}" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3"/>
            </filter>
          </defs>

          <!-- ============ AURA RADIAL ============ -->
          <ellipse cx="120" cy="100" rx="118" ry="105" fill="url(#${glowId})"/>

          <!-- ============ ALAS (con plumas sugeridas) ============ -->
          <g filter="url(#${softId})">
            <!-- Ala izquierda -->
            <g class="wing-left">
              <!-- Capa exterior de plumas largas -->
              <path d="M118,98
                       C92,72 58,50 26,52
                       C38,68 52,80 72,86
                       C52,86 34,92 22,104
                       C44,104 64,100 84,92
                       C70,100 60,110 54,122
                       C74,116 92,106 108,96 Z"
                    fill="url(#${gradId})"/>
              <!-- Capa interior (más luminosa) -->
              <path d="M118,102
                       C100,88 78,74 56,72
                       C70,84 84,92 96,96
                       C82,98 70,104 62,112
                       C80,108 96,100 110,96 Z"
                    fill="${palette.core}" opacity="0.55"/>
            </g>

            <!-- Ala derecha (espejo) -->
            <g class="wing-right">
              <path d="M122,98
                       C148,72 182,50 214,52
                       C202,68 188,80 168,86
                       C188,86 206,92 218,104
                       C196,104 176,100 156,92
                       C170,100 180,110 186,122
                       C166,116 148,106 132,96 Z"
                    fill="url(#${gradId})"/>
              <path d="M122,102
                       C140,88 162,74 184,72
                       C170,84 156,92 144,96
                       C158,98 170,104 178,112
                       C160,108 144,100 130,96 Z"
                    fill="${palette.core}" opacity="0.55"/>
            </g>
          </g>

          <!-- ============ FIGURA CENTRAL ============ -->
          <g filter="url(#${softId})">
            <!-- Túnica alargada (forma de vestidura angelical) -->
            <path d="M120,104
                     C112,110 106,128 106,150
                     C106,168 110,182 120,190
                     C130,182 134,168 134,150
                     C134,128 128,110 120,104 Z"
                  fill="url(#${gradId})"/>
            
            <!-- Detalle de pliegue central -->
            <path d="M120,112
                     C118,130 118,155 120,182"
                  stroke="${palette.core}" stroke-width="1" 
                  fill="none" opacity="0.5"/>
            
            <!-- Cabeza -->
            <ellipse cx="120" cy="90" rx="10" ry="12" 
                     fill="${palette.core}" opacity="0.95"/>
            
            <!-- Halo / aureola -->
            <ellipse class="halo" cx="120" cy="76" rx="16" ry="4" 
                     fill="none" stroke="${palette.core}" 
                     stroke-width="2" opacity="0.85"/>
            
            <!-- Resplandor sobre la aureola -->
            <ellipse cx="120" cy="76" rx="20" ry="6" 
                     fill="${palette.core}" opacity="0.25"/>
          </g>

          <!-- ============ DESTELLOS ============ -->
          <g opacity="0.85">
            <circle cx="120" cy="90" r="2" fill="${palette.core}"/>
            <circle cx="106" cy="150" r="1.5" fill="${palette.core}" opacity="0.7"/>
            <circle cx="134" cy="150" r="1.5" fill="${palette.core}" opacity="0.7"/>
            <circle cx="60" cy="80" r="1" fill="${palette.core}" opacity="0.6"/>
            <circle cx="180" cy="80" r="1" fill="${palette.core}" opacity="0.6"/>
          </g>
        </svg>
      `;
    };

    // ============================================================
    // CONFIGURACIÓN — Distribución de ángeles en 3 capas
    // ============================================================
    const angelsConfig = [
      // ===== Capa lejana (depth 1) — muy difusa =====
      { top: 8,  left: 5,   size: 180, depth: 1, speed: 0.10, drift: 30,  color: 'blue' },
      { top: 35, left: 82,  size: 200, depth: 1, speed: 0.12, drift: -35, color: 'gold' },
      { top: 65, left: 12,  size: 170, depth: 1, speed: 0.14, drift: 25,  color: 'blue' },
      { top: 20, left: 45,  size: 190, depth: 1, speed: 0.11, drift: -28, color: 'gold' },
      { top: 88, left: 68,  size: 175, depth: 1, speed: 0.13, drift: 32,  color: 'blue' },

      // ===== Capa media (depth 2) =====
      { top: 5,  left: 28,  size: 290, depth: 2, speed: 0.28, drift: 40,  color: 'gold' },
      { top: 50, left: 8,   size: 310, depth: 2, speed: 0.32, drift: -45, color: 'blue' },
      { top: 28, left: 75,  size: 280, depth: 2, speed: 0.26, drift: 35,  color: 'gold' },
      { top: 72, left: 58,  size: 300, depth: 2, speed: 0.30, drift: -30, color: 'blue' },

      // ===== Capa cercana (depth 3) — alas evidentes =====
      { top: 15, left: 62,  size: 460, depth: 3, speed: 0.55, drift: 55,  color: 'gold' },
      { top: 58, left: 30,  size: 480, depth: 3, speed: 0.62, drift: -60, color: 'blue' },
    ];

    const angels = [];

    angelsConfig.forEach((cfg, i) => {
      const el = document.createElement('div');
      el.className = 'angel';
      el.dataset.depth = cfg.depth;
      el.style.top = cfg.top + '%';
      el.style.left = cfg.left + '%';
      el.style.width = cfg.size + 'px';
      el.style.height = (cfg.size * 0.92) + 'px';
      
      const opacity = cfg.depth === 1 ? 0.18 : cfg.depth === 2 ? 0.32 : 0.45;
      el.style.setProperty('--opacity', opacity);
      
      el.innerHTML = angelSVG(cfg.color);
      
      const svg = el.querySelector('svg');
      if (svg) svg.style.animationDelay = (i * 0.6) + 's';
      
      angelsLayer.appendChild(el);

      angels.push({
        el,
        speed: cfg.speed,
        drift: cfg.drift,
        phase: Math.random() * Math.PI * 2,
      });

      setTimeout(() => el.classList.add('visible'), 400 + i * 250);
    });

    // ============================================================
    // BUCLE DE ANIMACIÓN — Parallax + drift continuo
    // ============================================================
    let currentScrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    let rafId = null;
    const startTime = performance.now();

    const updateAngels = (now) => {
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      const elapsed = (now - startTime) / 1000;

      angels.forEach(a => {
        const parallaxY = -currentScrollY * a.speed;
        const driftX = a.drift * Math.sin(elapsed * 0.12 + a.phase);
        const floatY = Math.sin(elapsed * 0.25 + a.phase) * 12;
        const rot = Math.sin(elapsed * 0.12 + a.phase) * 2.5;

        a.el.style.transform = 
          `translate3d(${driftX}px, ${parallaxY + floatY}px, 0) rotate(${rot}deg)`;
      });

      rafId = requestAnimationFrame(updateAngels);
    };

    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId) {
        rafId = requestAnimationFrame(updateAngels);
      }
    });

    rafId = requestAnimationFrame(updateAngels);
  }

});