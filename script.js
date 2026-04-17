/* ============================================
   Singes Projects S.A.S — JavaScript
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
    if (header) {
      header.classList.add('scrolled');
    }
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
  // 6. Google News RSS Feed
  // ==========================================
  const newsGrid = document.getElementById('news-grid');
  const newsPreviewGrid = document.getElementById('news-preview-grid');

  if (newsGrid || newsPreviewGrid) {
    loadGoogleNews();
  }

  // ==========================================
  // 7. Contact Form — Send to Email
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
        // Set reply-to field
        const replyToField = document.getElementById('replyto-field');
        if (replyToField) replyToField.value = email;

        const submitBtn = contactForm.querySelector('.form-submit');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner-small"></div> Enviando...';
        submitBtn.disabled = true;

        // Send via mailto as primary method
        const mailtoLink = `mailto:ingesprojects@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
          `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${formData.get('phone') || 'No proporcionado'}\nServicio: ${formData.get('service') || 'No seleccionado'}\n\nMensaje:\n${message}`
        )}`;

        // Try Formspree first, fall back to mailto
        fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            submitBtn.innerHTML = '✓ Mensaje Enviado';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            contactForm.reset();
          } else {
            // Fallback to mailto
            window.location.href = mailtoLink;
            submitBtn.innerHTML = '✓ Abriendo correo...';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
          }

          setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 4000);
        })
        .catch(() => {
          // Fallback to mailto
          window.location.href = mailtoLink;
          submitBtn.innerHTML = '✓ Abriendo correo...';
          submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
          
          setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 4000);
        });
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
  // 8. Active Navigation Link
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
  // 9. Newsletter Form
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
  // 10. Parallax-like effect for hero
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
  // 11. Year in footer
  // ==========================================
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

// ==========================================
// Google News RSS Functions (Global scope)
// ==========================================
let currentCategory = 'general';
let allNewsArticles = [];

function loadGoogleNews(category) {
  category = category || currentCategory;
  currentCategory = category;

  // RSS2JSON API
  const rssUrl = getTopicId(category);
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  const newsGrid = document.getElementById('news-grid');
  const newsPreviewGrid = document.getElementById('news-preview-grid');

  // Show loading
  if (newsGrid) {
    newsGrid.innerHTML = `
      <div class="news-loading" style="grid-column: 1/-1;">
        <div class="loading-spinner"></div>
        <p>Cargando noticias...</p>
      </div>
    `;
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok' && data.items) {
        allNewsArticles = data.items;
        renderNews(data.items, newsGrid, false);
        renderNews(data.items.slice(0, 3), newsPreviewGrid, true);

        // Update timestamp
        const updateTime = document.getElementById('last-update-time');
        if (updateTime) {
          const now = new Date();
          updateTime.textContent = now.toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }

        // Save to localStorage for cache
        localStorage.setItem('newsCache', JSON.stringify({
          timestamp: Date.now(),
          articles: data.items,
          category: category
        }));
      } else {
        showNewsError(newsGrid);
        showNewsError(newsPreviewGrid);
      }
    })
    .catch(() => {
      // Try loading from cache
      const cached = localStorage.getItem('newsCache');
      if (cached) {
        const cacheData = JSON.parse(cached);
        allNewsArticles = cacheData.articles;
        renderNews(cacheData.articles, newsGrid, false);
        renderNews(cacheData.articles.slice(0, 3), newsPreviewGrid, true);
      } else {
        showNewsError(newsGrid);
        showNewsError(newsPreviewGrid);
      }
    });
}

function getTopicId(category) {
  const topics = {
    'technology': 'https://www.eltiempo.com/rss/tecnosfera.xml',
    'business': 'https://www.eltiempo.com/rss/economia.xml',
    'science': 'https://www.eltiempo.com/rss/salud.xml',
    'world': 'https://www.eltiempo.com/rss/mundo.xml',
    'general': 'https://www.eltiempo.com/rss/colombia.xml'
  };
  return topics[category] || topics['general'];
}

function renderNews(articles, container, isPreview) {
  if (!container) return;

  if (!articles || articles.length === 0) {
    container.innerHTML = `
      <div class="news-empty" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
        <p>No se encontraron noticias.</p>
      </div>
    `;
    return;
  }

  const html = articles.map((article, index) => {
    const date = new Date(article.pubDate);
    const formattedDate = date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Extract source name from title if possible
    const titleParts = article.title.split(' - ');
    const source = titleParts.length > 1 ? titleParts.pop() : 'Noticias';
    const cleanTitle = titleParts.join(' - ');

    // Extract image from rich description/content if RSS fields are empty
    let imageUrl = article.thumbnail || article.enclosure?.link;
    if (!imageUrl) {
      const content = article.description || article.content || '';
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch) imageUrl = imgMatch[1];
    }
    const hasImage = !!imageUrl;
    const gradientIndex = (index % 6) + 1;

    return `
      <article class="news-card animate-on-scroll animated" data-index="${index}">
        <div class="news-card-image">
          ${hasImage
            ? `<img src="${imageUrl}" alt="${cleanTitle}" width="600" height="375" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder gradient-${gradientIndex}\\' role=\\'img\\'><svg width=\\'48\\' height=\\'48\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\' opacity=\\'0.6\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><path d=\\'M21 15l-5-5L5 21\\'/></svg></div>'">`
            : `<div class="img-placeholder gradient-${gradientIndex}" role="img">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>`
          }
          <span class="news-card-category">${source}</span>
        </div>
        <div class="news-card-body">
          <div class="news-card-meta">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <time datetime="${article.pubDate}">${formattedDate}</time>
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
              </svg>
              ${source}
            </span>
          </div>
          <h3>${cleanTitle}</h3>
          <p>${article.description ? article.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : ''}</p>
          <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="news-read-more" aria-label="Leer más: ${cleanTitle}">
            Leer Más
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </article>
    `;
  }).join('');

  container.innerHTML = html;
}

function showNewsError(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="news-error" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin: 0 auto 1rem;">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <h3 style="color: #64748b;">No se pudieron cargar las noticias</h3>
      <p style="color: #94a3b8;">Verifica tu conexión a internet e intenta de nuevo.</p>
      <button onclick="loadGoogleNews()" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Reintentar</button>
    </div>
  `;
}

function filterByCategory(category, event) {
  if (event) event.preventDefault();
  loadGoogleNews(category);
}

function searchNews(event) {
  if (event) event.preventDefault();
  const searchInput = document.getElementById('news-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  if (!query) {
    renderNews(allNewsArticles, document.getElementById('news-grid'), false);
    return;
  }

  const filtered = allNewsArticles.filter(article =>
    article.title.toLowerCase().includes(query) ||
    (article.description && article.description.toLowerCase().includes(query))
  );

  renderNews(filtered, document.getElementById('news-grid'), false);
}
