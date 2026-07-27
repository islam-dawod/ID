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

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal-on-scroll animation
const revealEls = document.querySelectorAll('.card, .feature, .section-head, .contact-card');
revealEls.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => observer.observe(el));

// Contact form (front-end only demo — wire to a backend or service to actually send)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const name = document.getElementById('name').value.trim();
  note.hidden = false;
  note.textContent = `شكرًا ${name}! تم استلام رسالتك، وسأتواصل معك قريبًا.`;
  form.reset();
});
