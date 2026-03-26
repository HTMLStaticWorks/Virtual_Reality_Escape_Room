/* =============================================
   VR ESCAPE ROOM — MAIN JAVASCRIPT
   Shared across all pages
   ============================================= */

(function () {
  'use strict';

  /* ── Dark / Light Mode ── */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');

  function setTheme(dark) {
    if (dark) {
      html.classList.add('dark');
      localStorage.setItem('vr-theme', 'dark');
      updateThemeIcons(true);
    } else {
      html.classList.remove('dark');
      localStorage.setItem('vr-theme', 'light');
      updateThemeIcons(false);
    }
  }

  function updateThemeIcons(dark) {
    const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
    const sunSVG = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707.707M6.343 6.343l-.707.707M12 5a7 7 0 110 14A7 7 0 0112 5z"/></svg>`;
    const icon = dark ? sunSVG : moonSVG;
    if (themeToggle) themeToggle.innerHTML = icon;
    if (themeToggleMobile) themeToggleMobile.innerHTML = icon;
  }

  // Init theme from localStorage
  const saved = localStorage.getItem('vr-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved ? saved === 'dark' : prefersDark);

  if (themeToggle) themeToggle.addEventListener('click', () => setTheme(!html.classList.contains('dark')));
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', () => setTheme(!html.classList.contains('dark')));

  /* ── Mobile Hamburger Menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.add('hidden');
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  // Close on ESC
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ── Scroll: Sticky Nav shadow ── */
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('shadow-lg');
    } else {
      nav.classList.remove('shadow-lg');
    }
  }, { passive: true });

  /* ── Scroll Reveal ── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Add stagger for children
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = delay + 'ms';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Active Nav Link ── */
  function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes(currentPath)) {
        link.classList.add('active');
      } else if (currentPath === '' && href === 'index.html') {
        link.classList.add('active');
      }
    });
  }

  /* ── FAQ Accordion ── */
  function initFAQ() {
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const answer = trigger.nextElementSibling;
        const icon = trigger.querySelector('.faq-icon');
        const isOpen = answer.classList.contains('open');

        // Close all others
        document.querySelectorAll('.faq-answer.open').forEach(a => {
          a.classList.remove('open');
          const prevIcon = a.previousElementSibling.querySelector('.faq-icon');
          if (prevIcon) prevIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          answer.classList.add('open');
          if (icon) icon.style.transform = 'rotate(45deg)';
        }
      });
    });
  }

  /* ── Room Filter ── */
  function initRoomFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        roomCards.forEach(card => {
          if (filter === 'all' || card.dataset.genre === filter) {
            card.style.display = '';
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  /* ── Room Modals ── */
  function initRoomModals() {
    const modal = document.getElementById('room-modal');
    if (!modal) return;

    document.querySelectorAll('.open-modal').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const room = trigger.dataset;
        const titleEl = document.getElementById('modal-title');
        const descEl = document.getElementById('modal-desc');
        const genreEl = document.getElementById('modal-genre');
        const diffEl = document.getElementById('modal-diff');

        if (titleEl) titleEl.textContent = room.title || '';
        if (descEl) descEl.textContent = room.desc || '';
        if (genreEl) genreEl.textContent = room.genre || '';
        if (diffEl) {
          diffEl.innerHTML = '';
          const diff = parseInt(room.diff) || 1;
          for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star' + (i <= diff ? ' active' : '');
            star.textContent = '★';
            diffEl.appendChild(star);
          }
        }
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    document.querySelectorAll('.close-modal').forEach(el => {
      el.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Avatar Selection ── */
  function initAvatarPicker() {
    document.querySelectorAll('.avatar-option').forEach(av => {
      av.addEventListener('click', () => {
        document.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('selected'));
        av.classList.add('selected');
      });
    });
  }

  /* ── Countdown Timer ── */
  function initCountdown() {
    const el = document.getElementById('session-countdown');
    if (!el) return;
    const target = new Date();
    target.setDate(target.getDate() + 3);
    target.setHours(19, 0, 0, 0);

    function update() {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) { el.textContent = 'SESSION STARTED'; return; }
      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      ['days','hrs','mins','secs'].forEach(unit => {
        const numEl = document.getElementById(`cd-${unit}`);
        if (numEl) numEl.textContent = String({ days, hrs, mins, secs }[unit]).padStart(2,'0');
      });
    }
    update();
    setInterval(update, 1000);
  }

  /* ── Progress Bar Animation ── */
  function initProgressBars() {
    const bars = document.querySelectorAll('.progress-fill[data-width]');
    if (!bars.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    bars.forEach(bar => { bar.style.width = '0%'; observer.observe(bar); });
  }

  /* ── Typewriter ── */
  function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const phrases = el.dataset.phrases ? JSON.parse(el.dataset.phrases) : [el.textContent];
    let pi = 0, ci = 0, deleting = false;

    function type() {
      const phrase = phrases[pi];
      if (deleting) {
        el.textContent = phrase.substring(0, ci--);
        if (ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; setTimeout(type, 500); return; }
      } else {
        el.textContent = phrase.substring(0, ++ci);
        if (ci === phrase.length) { deleting = true; setTimeout(type, 2000); return; }
      }
      setTimeout(type, deleting ? 60 : 100);
    }
    el.textContent = '';
    setTimeout(type, 500);
  }

  /* ── Leaderboard row highlight ── */
  function initLeaderboard() {
    document.querySelectorAll('.lb-row').forEach((row, i) => {
      if (i === 0) row.style.color = 'var(--neon-yellow)';
      else if (i === 1) row.style.color = 'rgba(192,192,220,0.9)';
      else if (i === 2) row.style.color = 'var(--neon-magenta)'; // remapped from orange → magenta
    });
  }

  /* ── Form Validation ── */
  function initForms() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('[required]').forEach(field => {
          if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = 'var(--neon-magenta)'; // error = magenta (in palette)
          } else {
            field.style.borderColor = '';
          }
        });
        if (valid) {
          const btn = form.querySelector('[type="submit"]');
          if (btn) {
            btn.textContent = '✓ SENT!';
            btn.style.background = 'var(--neon-cyan)'; // success = cyan (in palette)
            btn.style.color = '#000';
            btn.style.border = 'none';
            setTimeout(() => { btn.textContent = 'SUBMIT'; btn.style = ''; }, 3000);
          }
        }
      });
    });
  }

  /* ── Floating Action Buttons (Back to Top + RTL Toggle) ── */
  function initFloatingButtons() {
    // Create container
    const fabGroup = document.createElement('div');
    fabGroup.className = 'fab-group';

    // Back to Top button
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.className = 'fab-btn';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.title = 'Back to Top';
    backToTop.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/></svg>`;
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    fabGroup.appendChild(backToTop);
    document.body.appendChild(fabGroup);

    // Show/hide Back to Top on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });
  }

  /* ── RTL Toggle (Navbar) ── */
  function initRTLToggle() {
    const rtlToggles = document.querySelectorAll('#rtl-toggle, #rtl-toggle-mobile');
    
    // Restore RTL state from storage
    const savedDir = localStorage.getItem('vr-dir');
    if (savedDir === 'rtl') {
      html.setAttribute('dir', 'rtl');
      rtlToggles.forEach(btn => btn.classList.add('active'));
    }

    rtlToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const isRTL = html.getAttribute('dir') === 'rtl';
        if (isRTL) {
          html.removeAttribute('dir');
          localStorage.setItem('vr-dir', 'ltr');
          rtlToggles.forEach(b => b.classList.remove('active'));
        } else {
          html.setAttribute('dir', 'rtl');
          localStorage.setItem('vr-dir', 'rtl');
          rtlToggles.forEach(b => b.classList.add('active'));
        }
      });
    });
  }

  /* ── Init All ── */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    setActiveNavLink();
    initFAQ();
    initRoomFilter();
    initRoomModals();
    initAvatarPicker();
    initCountdown();
    initProgressBars();
    initTypewriter();
    initLeaderboard();
    initForms();
    initFloatingButtons();
    initRTLToggle();
  });

})();
