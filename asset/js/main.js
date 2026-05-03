/* ══════════════════════════════════════════════
   OSTERIA DEL SUD — main.js
   Dipendenze: GSAP + ScrollTrigger, Swiper
   ══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════
   GSAP — ANIMAZIONI
   ══════════════════════ */

// Hero & Page Hero entrance
gsap.from('#heroContent > *, .page-hero-content > *', {
  opacity: 0, y: 30,
  stagger: .14, duration: 1.3,
  ease: 'power3.out', delay: .2
});

// Scroll reveals
gsap.utils.toArray('.reveal').forEach(el => {
  const cssDelay = parseFloat(el.style.transitionDelay) || 0;
  
  // Disabilita temporaneamente le transizioni CSS per evitare "scatti" dovuti al conflitto tra GSAP e transition:all
  el.style.transition = 'none';

  gsap.fromTo(el,
    { opacity: 0, y: 32 },
    {
      opacity: 1, y: 0, duration: 1.1, ease: 'power2.out',
      delay: cssDelay,
      scrollTrigger: { trigger: el, start: 'top 87%' },
      onComplete: () => {
        // Ripristina la transizione CSS per permettere effetti hover fluenti
        el.style.transition = '';
      }
    }
  );
});

// Section titles — clip reveal
document.querySelectorAll('.section-title, .filo-title, .menu-title, .spec-title, .cta-title, .cat-section-title').forEach(el => {
  el.style.overflow = 'hidden';
  el.style.display = 'block';
  gsap.fromTo(el,
    { yPercent: 100, opacity: 0 },
    {
      yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    }
  );
});

// Parallax — Hero background
gsap.to('.hero-ph', {
  yPercent: 25, ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top', end: 'bottom top',
    scrub: 1.2
  }
});

// Parallax — Hero content fade on scroll
gsap.to('#heroContent', {
  yPercent: 18, opacity: 0, ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'center top', end: 'bottom top',
    scrub: 1.2
  }
});

// Parallax — About photos
document.querySelectorAll('.about-ph-inner').forEach(el => {
  gsap.fromTo(el,
    { yPercent: -5 },
    {
      yPercent: 10, ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.about-ph'),
        start: 'top bottom', end: 'bottom top', scrub: 1.2
      }
    }
  );
});

// Parallax — Filosofia photo
const filoPh = document.querySelector('.filo-ph-inner');
if (filoPh) {
  gsap.fromTo(filoPh,
    { yPercent: -8 },
    {
      yPercent: 8, ease: 'none',
      scrollTrigger: {
        trigger: filoPh.closest('.ph-wrap'),
        start: 'top bottom', end: 'bottom top', scrub: 1.2
      }
    }
  );
}

// Gallery — horizontal drift on scroll
gsap.to('.swiper-gallery .swiper-wrapper', {
  x: -40, ease: 'none',
  scrollTrigger: {
    trigger: '.gallery',
    start: 'top bottom', end: 'bottom top', scrub: 1
  }
});

// Stats — scale on enter
gsap.fromTo('.stats-grid',
  { scale: .97 },
  {
    scale: 1, ease: 'power2.out',
    scrollTrigger: {
      trigger: '.stats',
      start: 'top 80%', end: 'top 30%', scrub: .6
    }
  }
);

/* ══════════════════════
   STATS COUNTERS
   ══════════════════════ */
document.querySelectorAll('.stat-n[data-target]').forEach(el => {
  const t = +el.dataset.target;
  ScrollTrigger.create({
    trigger: el, start: 'top 82%', once: true,
    onEnter: () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: t, duration: 2, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(obj.v); },
        onComplete() { el.textContent = t; }
      });
    }
  });
});

/* ══════════════════════
   MENU TABS
   ══════════════════════ */
const menuTabs = document.querySelectorAll('.menu-tab');
const menuPanes = document.querySelectorAll('.menu-pane');

if (menuTabs.length > 0) {
  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      menuPanes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const pane = document.getElementById('pane-' + tab.dataset.pane);
      if (pane) {
        pane.classList.add('active');
        gsap.from(pane.querySelectorAll('.mi'), {
          opacity: 0, y: 14,
          stagger: .07, duration: .5, ease: 'power2.out'
        });
      }
    });
  });
}

/* ══════════════════════
   SWIPER GALLERY
   ══════════════════════ */
new Swiper('.swiper-gallery', {
  slidesPerView: 'auto',
  spaceBetween: 16,
  grabCursor: true,
  freeMode: { enabled: true, momentumRatio: .5 }
});

// Nav scroll
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
}

// Mobile Menu Toggle
const navToggle = document.getElementById('navToggle');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  nav.querySelectorAll('.nav-links a, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });
}

// Page hero parallax
if (document.querySelector('#pageHeroBg')) {
  gsap.to('#pageHeroBg', {
    yPercent: 20, ease: 'none',
    scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
  });
}

// Category filter
const catFilter = document.querySelector('.cat-filter');
if (catFilter) {
  const swipers = {};
  const catBtns = document.querySelectorAll('.cat-btn');
  const catSections = document.querySelectorAll('.cat-section');

  function initSwipersForCat(catId) {
    const swiperEl = document.querySelector(`#cat-${catId} .piatti-swiper`);
    if (!swiperEl || swipers[catId]) return;
    swipers[catId] = new Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 12,
      grabCursor: true,
      pagination: { el: swiperEl.querySelector('.swiper-pagination'), clickable: true }
    });
  }

  // Init visible swiper on load
  initSwipersForCat('primi');

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;

      catBtns.forEach(b => b.classList.remove('active'));
      catSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const section = document.getElementById('cat-' + cat);
      section.classList.add('active');

      // Init swiper for this category if not done yet
      initSwipersForCat(cat);

      // Refresh ScrollTrigger per calcolare le nuove altezze delle sezioni
      ScrollTrigger.refresh();

      // Animate rows in
      const cards = section.querySelectorAll('.piatto-row, .vino-row, .piatto-card');
      gsap.from(cards, {
        opacity: 0, y: 16,
        stagger: .06, duration: .5, ease: 'power2.out',
        onStart: function() {
           // Prevents css fighting
           cards.forEach(r => r.style.transition = 'none');
        },
        onComplete: function() {
           cards.forEach(r => r.style.transition = '');
        }
      });

      // Smooth scroll to filter
      catFilter.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Swiper atmosfera
if (document.querySelector('.atm-swiper')) {
  new Swiper('.atm-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    grabCursor: true,
    freeMode: { enabled: true, momentumRatio: .5 },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 768: { spaceBetween: 24 } }
  });
}


// Close modal on backdrop click
const bookingModal = document.getElementById('bookingModal');
if (bookingModal) {
  bookingModal.addEventListener('click', (e) => {
    const dialogDimensions = bookingModal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      bookingModal.close();
      document.getElementById('bmFormContainer').style.display = 'block';
      document.getElementById('bmSuccess').style.display = 'none';
      document.getElementById('bookingForm').reset();
    }
  });
}

// Forza un refresh di tutti i trigger quando le immagini (e le altezze) sono definitive
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});
