/* ============================================
   IngesProyect — JavaScript
   Interactividad y funcionalidades
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Mobile Navigation
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  const navOverlay = document.getElementById('nav-overlay');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('open');
      document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('open');
        navOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close nav when clicking a link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================
  // 2. Header Scroll Effect
  // ==========================================
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initial check

  // ==========================================
  // 3. Smooth Scrolling for Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 4. Scroll Animations (Intersection Observer)
  // ==========================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    animatedElements.forEach(el => el.classList.add('animated'));
  }

  // ==========================================
  // 5. Counter Animation for Stats
  // ==========================================
  const counters = document.querySelectorAll('[data-counter]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // ==========================================
  // 6. Testimonial Carousel
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let autoPlayInterval;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  if (slides.length > 0) {
    showSlide(0);
    startAutoPlay();
  }

  // ==========================================
  // 7. News Category Filters
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      newsCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (category === 'all' || cardCategory === category) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 8. Contact Form Validation
  // ==========================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      let isValid = true;
      const errors = [];

      // Basic validation
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');

      if (!name || name.trim().length < 2) {
        isValid = false;
        errors.push('Por favor, ingresa tu nombre completo.');
      }

      if (!email || !isValidEmail(email)) {
        isValid = false;
        errors.push('Por favor, ingresa un correo electrónico válido.');
      }

      if (!subject || subject.trim().length < 3) {
        isValid = false;
        errors.push('Por favor, ingresa un asunto.');
      }

      if (!message || message.trim().length < 10) {
        isValid = false;
        errors.push('El mensaje debe tener al menos 10 caracteres.');
      }

      if (isValid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.textContent = '✓ Mensaje Enviado';
          submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            contactForm.reset();
          }, 3000);
        }, 1500);
      } else {
        showFormErrors(errors);
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(e => e.remove());

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = `
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      padding: 1rem 1.2rem;
      margin-bottom: 1rem;
      color: #dc2626;
      font-size: 0.9rem;
      animation: fadeInUp 0.3s ease;
    `;

    errorDiv.innerHTML = errors.map(e => `<p style="margin: 0.3rem 0;">⚠ ${e}</p>`).join('');
    contactForm.prepend(errorDiv);

    setTimeout(() => {
      errorDiv.style.opacity = '0';
      errorDiv.style.transition = 'opacity 0.3s ease';
      setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
  }

  // ==========================================
  // 9. Active Navigation Link
  // ==========================================
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a:not(.nav-cta a)');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else if (currentPage === 'index.html' && href.startsWith('#')) {
        // Handle same-page anchors
      }
    });
  }

  setActiveNavLink();

  // ==========================================
  // 10. Newsletter Form
  // ==========================================
  const newsletterForm = document.getElementById('newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button');

      if (emailInput.value && isValidEmail(emailInput.value)) {
        submitBtn.textContent = '✓ ¡Suscrito!';
        submitBtn.style.background = 'rgba(34, 197, 94, 0.3)';
        emailInput.value = '';

        setTimeout(() => {
          submitBtn.textContent = 'Suscribirse';
          submitBtn.style.background = '';
        }, 3000);
      }
    });
  }

  // ==========================================
  // 11. Parallax-like effect for hero
  // ==========================================
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const shapes = hero.querySelectorAll('.hero-shape');
      shapes.forEach((shape, i) => {
        const speed = 0.05 * (i + 1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }

  // ==========================================
  // 12. Year in footer
  // ==========================================
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
