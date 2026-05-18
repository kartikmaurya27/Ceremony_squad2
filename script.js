/* ============================================================
   LUMIÈRE EVENTS — Premium Interactive JavaScript
   ============================================================ */

'use strict';

/* =============================================
   1. PRELOADER
   ============================================= */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    // Trigger hero reveal animations after preloader
    triggerHeroAnimations();
  }, 2500);
});

// Block scroll during preload
document.body.style.overflow = 'hidden';


/* =============================================
   2. CUSTOM CURSOR
   ============================================= */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover state on interactive elements
const hoverTargets = document.querySelectorAll(
  'a, button, .service-card, .gm-item, .price-card, .tc-btn, .gf-btn, .back-top'
);
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});


/* =============================================
   3. PARTICLE CANVAS
   ============================================= */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 1.8 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    // Gold, purple or orange tones
    const palette = [
      `rgba(201,168,76,${this.opacity})`,
      `rgba(123,47,247,${this.opacity * 0.6})`,
      `rgba(232,108,44,${this.opacity * 0.5})`,
      `rgba(240,208,128,${this.opacity * 0.4})`,
    ];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (
      this.x < -10 || this.x > canvas.width  + 10 ||
      this.y < -10 || this.y > canvas.height + 10
    ) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(201,168,76,${0.04 * (1 - dist / 120)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();


/* =============================================
   4. NAVBAR
   ============================================= */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
  toggleBackTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}


/* =============================================
   5. HERO ANIMATIONS
   ============================================= */
function triggerHeroAnimations() {
  const revealEls = document.querySelectorAll('.reveal-up');
  revealEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 120);
  });
}


/* =============================================
   6. SCROLL REVEAL (Intersection Observer)
   ============================================= */
const srElements = document.querySelectorAll(
  '.service-card, .gm-item, .stat-item, .testi-card, .event-item, ' +
  '.price-card, .about-visual, .about-text, .ci-item, .contact-form-wrap, ' +
  '.footer-col, .footer-brand, .footer-newsletter'
);

srElements.forEach(el => el.classList.add('sr'));

const srObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 90);
      srObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

srElements.forEach(el => srObserver.observe(el));


/* =============================================
   7. SECTION HEADER REVEAL
   ============================================= */
const headerEls = document.querySelectorAll('.section-header, .section-eyebrow, .section-title, .section-sub');
headerEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      headerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

headerEls.forEach(el => headerObserver.observe(el));


/* =============================================
   8. STATS COUNTER
   ============================================= */
const statNums = document.querySelectorAll('.stat-num');

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased  = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));


/* =============================================
   9. GALLERY FILTER
   ============================================= */
const filterBtns  = document.querySelectorAll('.gf-btn');
const galleryItems = document.querySelectorAll('.gm-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    galleryItems.forEach(item => {
      const cat = item.getAttribute('data-cat');
      if (filter === 'all' || cat === filter) {
        item.style.opacity   = '0';
        item.style.transform = 'scale(0.9)';
        item.style.display   = '';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity   = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity   = '0';
        item.style.transform = 'scale(0.85)';
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  });
});

// Gallery Lightbox
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const caption = item.querySelector('h4')?.textContent || '';
    const cat     = item.querySelector('.gmi-cat')?.textContent || '';
    const bg      = getComputedStyle(item.querySelector('.gmi-inner')).background;

    const lbImg     = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const lightbox  = document.getElementById('lightbox');

    lbImg.style.background = bg;
    lbImg.style.display    = 'block';
    lbCaption.textContent  = `${cat} — ${caption}`;
    lightbox.classList.add('open');
  });
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});


/* =============================================
   10. TESTIMONIALS CAROUSEL
   ============================================= */
const track    = document.getElementById('testi-track');
const cards    = document.querySelectorAll('.testi-card');
const dotsWrap = document.getElementById('tc-dots');
const prevBtn  = document.getElementById('tprev');
const nextBtn  = document.getElementById('tnext');

let currentSlide = 0;
let slidesVisible = window.innerWidth < 700 ? 1 : 2;
const totalSlides = cards.length;
const maxSlide    = totalSlides - slidesVisible;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('tc-dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

function updateDots() {
  document.querySelectorAll('.tc-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, maxSlide));
  const cardWidth = cards[0].offsetWidth + 24; // gap
  track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  updateDots();
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

// Auto-play
let autoPlay = setInterval(() => {
  currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
  goToSlide(currentSlide);
}, 5000);

track.addEventListener('mouseenter', () => clearInterval(autoPlay));
track.addEventListener('mouseleave', () => {
  autoPlay = setInterval(() => {
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    goToSlide(currentSlide);
  }, 5000);
});

// Touch swipe
let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend',   e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
});

window.addEventListener('resize', () => {
  slidesVisible = window.innerWidth < 700 ? 1 : 2;
  goToSlide(0);
});


/* =============================================
   11. PARALLAX EFFECTS
   ============================================= */
function handleParallax() {
  const scrollY = window.scrollY;

  // Hero visual subtle parallax
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.style.transform = `translateY(calc(-50% + ${scrollY * 0.12}px))`;
  }

  // Hero shapes parallax
  const hs1 = document.querySelector('.hs1');
  const hs2 = document.querySelector('.hs2');
  const hs3 = document.querySelector('.hs3');
  if (hs1) hs1.style.transform = `translate(${scrollY * 0.06}px, ${-scrollY * 0.08}px)`;
  if (hs2) hs2.style.transform = `translate(${-scrollY * 0.04}px, ${scrollY * 0.06}px)`;
  if (hs3) hs3.style.transform = `translate(${scrollY * 0.03}px, ${-scrollY * 0.05}px)`;
}

window.addEventListener('scroll', handleParallax, { passive: true });


/* =============================================
   12. CONTACT FORM
   ============================================= */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check-circle"></i> Enquiry Sent!';
      btn.style.background = 'linear-gradient(135deg, #2a6a4a, #3a9a6a)';

      showToast('Thank you! We\'ll be in touch within 24 hours. ✨');

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled  = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3500);
    }, 1800);
  });
}

// Newsletter form
const nlForm = document.querySelector('.nl-form');
if (nlForm) {
  const nlBtn   = nlForm.querySelector('button');
  const nlInput = nlForm.querySelector('input');

  nlBtn.addEventListener('click', () => {
    if (!nlInput.value || !nlInput.value.includes('@')) {
      nlInput.style.borderColor = '#e86c2c';
      setTimeout(() => { nlInput.style.borderColor = ''; }, 2000);
      return;
    }
    nlBtn.textContent = '✓ Done!';
    showToast('You\'re subscribed! Welcome to the Lumière family. 🥂');
    setTimeout(() => {
      nlBtn.textContent = 'Subscribe';
      nlInput.value = '';
    }, 3000);
  });
}


/* =============================================
   13. TOAST NOTIFICATION
   ============================================= */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-star"></i> ${message}`;
  toast.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 32px;
    background: linear-gradient(135deg, #1e1a10, #2a2210);
    border: 1px solid rgba(201,168,76,0.4);
    color: #e8e4dc;
    padding: 14px 22px;
    border-radius: 12px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.05em;
    z-index: 9999;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 340px;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s ease;
  `;
  toast.querySelector('i').style.color = '#c9a84c';

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity   = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}


/* =============================================
   14. BACK TO TOP
   ============================================= */
const backTop = document.getElementById('backTop');

function toggleBackTop() {
  backTop.classList.toggle('visible', window.scrollY > 500);
}

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* =============================================
   15. SMOOTH ANCHOR SCROLLING
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});


/* =============================================
   16. DYNAMIC GRADIENT BORDER ON CARDS (Mouse Track)
   ============================================= */
document.querySelectorAll('.service-card, .price-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = ((e.clientX - rect.left) / rect.width)  * 100;
    const y     = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `
      radial-gradient(circle at ${x}% ${y}%,
        rgba(201,168,76,0.07) 0%,
        var(--card) 60%
      )
    `;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});


/* =============================================
   17. TICKER PAUSE ON HOVER
   ============================================= */
const ticker = document.querySelector('.ticker-inner');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}


/* =============================================
   18. NUMBER FORMATTING HELPER (already in counter)
   ============================================= */


/* =============================================
   19. TYPING EFFECT — Hero Tagline (subtle)
   ============================================= */
function initTypingEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  const phrases = [
    'Weddings · DJ Nights · Birthdays · Concerts · Corporate Galas',
    'Destination Events · Themed Parties · Award Ceremonies',
    'Mehendi Nights · Receptions · Product Launches · Concerts',
  ];
  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  let typingSpeed = 55;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      tagline.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        typingSpeed = 2800; // pause before delete
      } else {
        typingSpeed = 55;
      }
    } else {
      tagline.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typingSpeed = 400;
      } else {
        typingSpeed = 28;
      }
    }
    setTimeout(type, typingSpeed);
  }

  // Start after preloader
  setTimeout(type, 3000);
}
initTypingEffect();


/* =============================================
   20. GLOWING CURSOR TRAIL
   ============================================= */
const trailCount = 8;
const trail = [];

for (let i = 0; i < trailCount; i++) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: ${4 - i * 0.3}px;
    height: ${4 - i * 0.3}px;
    border-radius: 50%;
    background: rgba(201,168,76,${0.5 - i * 0.05});
    pointer-events: none;
    z-index: 9990;
    transform: translate(-50%,-50%);
    transition: left ${0.05 + i * 0.03}s linear, top ${0.05 + i * 0.03}s linear;
  `;
  document.body.appendChild(dot);
  trail.push({ el: dot, x: 0, y: 0 });
}

document.addEventListener('mousemove', (e) => {
  trail.forEach((t, i) => {
    setTimeout(() => {
      t.el.style.left = e.clientX + 'px';
      t.el.style.top  = e.clientY + 'px';
    }, i * 20);
  });
});


/* =============================================
   21. SERVICE CARDS — TILT EFFECT
   ============================================= */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -5;
    const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  5;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
});


/* =============================================
   22. UPCOMING EVENTS — LIVE COUNTDOWN
   ============================================= */
function buildCountdowns() {
  // Each event date as YYYY-MM-DD
  const eventDates = [
    { date: '2025-06-28', id: 0 },
    { date: '2025-07-05', id: 1 },
    { date: '2025-07-12', id: 2 },
    { date: '2025-07-20', id: 3 },
  ];

  const items = document.querySelectorAll('.event-item');

  eventDates.forEach((ev, i) => {
    if (!items[i]) return;
    const el = document.createElement('p');
    el.style.cssText = 'font-size:0.7rem; color:var(--gold); letter-spacing:0.12em; margin-top:4px;';
    items[i].querySelector('.ei-info').appendChild(el);

    function tick() {
      const now  = new Date();
      const end  = new Date(ev.date + 'T00:00:00');
      const diff = end - now;
      if (diff <= 0) { el.textContent = 'Event Live Now!'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);
      el.textContent = `⏳ ${d}d ${h}h ${m}m ${s}s remaining`;
    }
    tick();
    setInterval(tick, 1000);
  });
}
buildCountdowns();


/* =============================================
   23. SCROLL PROGRESS BAR
   ============================================= */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light));
  z-index: 9999;
  width: 0%;
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(201,168,76,0.5);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });


/* =============================================
   24. INIT — final touches
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Mark first nav link active
  if (allNavLinks.length) allNavLinks[0].classList.add('active');

  // Ensure hero reveals fire if preloader already done
  setTimeout(triggerHeroAnimations, 100);

  console.log(
    '%c LUMIÈRE EVENTS ',
    'background: linear-gradient(135deg,#9a7530,#c9a84c,#f0d080); color:#0a0a0b; font-size:14px; font-weight:bold; padding:6px 16px; border-radius:4px;'
  );
  console.log('%c Crafting Unforgettable Experiences ✨', 'color:#c9a84c; font-size:11px;');
});
