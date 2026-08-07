// Bilingual toggle (Arabic default, English optional)
const langToggle = document.getElementById('langToggle');
const LANG_KEY = 'site-lang';

function applyLang(lang) {
  const en = lang === 'en';
  const root = document.documentElement;
  root.lang = en ? 'en' : 'ar';
  root.dir = en ? 'ltr' : 'rtl';

  // swap inner HTML for elements that have an English variant
  document.querySelectorAll('[data-en]').forEach((el) => {
    if (el.dataset.ar === undefined) el.dataset.ar = el.innerHTML.trim();
    el.innerHTML = en ? el.dataset.en : el.dataset.ar;
  });
  // swap aria-labels
  document.querySelectorAll('[data-en-label]').forEach((el) => {
    if (el.dataset.arLabel === undefined) el.dataset.arLabel = el.getAttribute('aria-label') || '';
    el.setAttribute('aria-label', en ? el.dataset.enLabel : el.dataset.arLabel);
  });

  if (langToggle) {
    langToggle.textContent = en ? 'ع' : 'EN';
    langToggle.setAttribute('aria-label', en ? 'التبديل إلى العربية' : 'Switch to English');
  }
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
}

let savedLang = 'ar';
try { if (localStorage.getItem(LANG_KEY) === 'en') savedLang = 'en'; } catch (e) {}
applyLang(savedLang);

if (langToggle) {
  langToggle.addEventListener('click', () => {
    applyLang(document.documentElement.lang === 'ar' ? 'en' : 'ar');
  });
}

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close menu when a link is clicked (mobile)
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Back-to-top: force smooth scroll to the very top (href="#top" alone fails
// because the sticky header is always in view)
const backTopBtn = document.querySelector('.back-top');
if (backTopBtn) {
  backTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Scroll progress bar
const progress = document.createElement('div');
progress.className = 'scroll-progress';
document.body.appendChild(progress);

// Header shadow on scroll
const header = document.querySelector('.site-header');
const onScroll = () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop || document.body.scrollTop;
  const height = h.scrollHeight - h.clientHeight;
  progress.style.width = height > 0 ? (scrolled / height) * 100 + '%' : '0%';
  if (header) header.classList.toggle('scrolled', scrolled > 8);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal-on-scroll animation (with per-group stagger)
const revealEls = document.querySelectorAll(
  '.card, .feature, .work, .section-head, .contact-inner, .contact-actions, .social'
);
revealEls.forEach((el) => el.classList.add('reveal'));

// Stagger items that share the same grid/parent
document.querySelectorAll('.cards, .features, .portfolio-grid').forEach((grid) => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = (i % 3) * 0.09 + 0.05 * Math.floor(i / 3) + 's';
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
        // clear stagger delay so it doesn't affect later hover transitions
        setTimeout(() => { entry.target.style.transitionDelay = ''; }, 1000);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => observer.observe(el));
