/* ===================================================
   ZAMIR CONSTRUCCIONES — Interactive Scripts
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* -------------------------------------------------
     1. STICKY HEADER
     ------------------------------------------------- */
  const header = document.querySelector('.site-header');

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load

  /* -------------------------------------------------
     2. MOBILE MENU
     ------------------------------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = mainNav.querySelectorAll('a');

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('open');
    mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
    });
  });

  /* -------------------------------------------------
     3. ACTIVE NAV HIGHLIGHT ON SCROLL
     ------------------------------------------------- */
  const sections = document.querySelectorAll('main > section[id]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* -------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS
     ------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* -------------------------------------------------
     5. COUNTER ANIMATION (Hero Stats)
     ------------------------------------------------- */
  const statValues = document.querySelectorAll('.stat strong');

  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const match = text.match(/([+]?)(\d+)([%+]?)/);

    if (!match) return;

    const prefix = match[1];
    const target = parseInt(match[2], 10);
    const suffix = match[3];
    const duration = 2000;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(target * eased);
      el.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach(el => statsObserver.observe(el));

  /* -------------------------------------------------
     6. CONTACT FORM VALIDATION
     ------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = contactForm.querySelector('#nombre');
      const email = contactForm.querySelector('#email');
      let valid = true;

      // Reset previous error styles
      [nombre, email].forEach(input => {
        input.style.borderColor = '';
      });

      // Name validation
      if (!nombre.value.trim()) {
        nombre.style.borderColor = '#ef5350';
        nombre.focus();
        valid = false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.style.borderColor = '#ef5350';
        if (valid) email.focus();
        valid = false;
      }

      if (valid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
          contactForm.reset();
          formSuccess.classList.add('show');
          submitBtn.textContent = 'Enviar Mensaje →';
          submitBtn.disabled = false;

          setTimeout(() => {
            formSuccess.classList.remove('show');
          }, 5000);
        }, 1200);
      }
    });
  }

  /* -------------------------------------------------
     7. SMOOTH SCROLL (fallback for older browsers)
     ------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
