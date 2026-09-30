// ── Scroll reveal ──
const supportsMouseGlow = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
if (supportsMouseGlow) {
  const mouseGlow = document.createElement('div');
  mouseGlow.className = 'mouse-glow';
  mouseGlow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(mouseGlow);

  window.addEventListener('pointermove', (event) => {
    mouseGlow.style.left = `${event.clientX}px`;
    mouseGlow.style.top = `${event.clientY}px`;
    mouseGlow.classList.add('visible');
  }, { passive: true });
  document.addEventListener('pointerleave', () => mouseGlow.classList.remove('visible'));
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Active topbar link ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ── Radial FAB nav ──
function initNavFab() {
  const fab = document.getElementById('navfabBtn');
  const halo = document.getElementById('navfabHalo');
  const overlay = document.getElementById('navfabOverlay');
  const container = document.getElementById('navfabItems');
  if (!fab || !container) return;

  const items = [
    { label: 'Home',       icon: 'fa-house',         href: 'index.html',         match: 'index.html' },
    { label: 'About',      icon: 'fa-user',          href: 'about.html',         match: 'about.html' },
    { label: 'Skills',     icon: 'fa-code',          href: 'skills.html',        match: 'skills.html' },
    { label: 'Projects',   icon: 'fa-diagram-project', href: 'projects.html',    match: 'projects.html' },
    { label: 'Experience', icon: 'fa-briefcase',     href: 'experience.html',    match: 'experience.html' },
    { label: 'Contact',    icon: 'fa-envelope',      href: 'contact.html',       match: 'contact.html' },
  ];

  const isMobile = window.innerWidth <= 660;
  const RADIUS = isMobile ? 110 : 200;
  const HALF = isMobile ? 29 : 32;
  const startAngle = 105, endAngle = 255;
  const total = items.length;

  items.forEach((item, i) => {
    const angleDeg = startAngle + (endAngle - startAngle) * (i / (total - 1));
    const angleRad = angleDeg * Math.PI / 180;
    const dx = Math.cos(angleRad) * RADIUS;
    const dy = Math.sin(angleRad) * RADIUS;

    const el = document.createElement('a');
    el.className = 'nav-item' + (item.match === currentPage ? ' active' : '');
    el.href = item.href;
    el.innerHTML = `<i class="fa-solid ${item.icon} nav-icon"></i><span class="lbl">${item.label}</span><span class="tip">${item.label}</span>`;
    el.style.right = `${-dx - HALF}px`;
    el.style.top = `calc(50% + ${dy - HALF}px)`;
    container.appendChild(el);
  });

  let open = false;
  function openMenu() {
    open = true;
    fab.classList.add('open'); halo.classList.add('open'); overlay.classList.add('open');
    document.querySelectorAll('.nav-item').forEach((el, i) => {
      el.style.transitionDelay = (0.05 + i * 0.05) + 's';
      el.classList.add('open');
    });
  }
  function closeMenu() {
    open = false;
    fab.classList.remove('open'); halo.classList.remove('open'); overlay.classList.remove('open');
    document.querySelectorAll('.nav-item').forEach((el, i) => {
      el.style.transitionDelay = ((total - 1 - i) * 0.03) + 's';
      el.classList.remove('open');
    });
  }
  fab.addEventListener('click', () => open ? closeMenu() : openMenu());
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMenu(); });
}
initNavFab();

// ── AI command nav ──
function initAiCommandNav(inputId, feedbackId) {
  const input = document.getElementById(inputId);
  const feedback = document.getElementById(feedbackId);
  if (!input) return;
  const routes = {
    'home': 'index.html', 'index': 'index.html',
    'about': 'about.html',
    'skills': 'skills.html', 'skill': 'skills.html',
    'projects': 'projects.html', 'project': 'projects.html',
    'experience': 'experience.html', 'exp': 'experience.html',
    'contact': 'contact.html'
  };
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    const target = routes[cmd];
    if (target) {
      if (feedback) { feedback.style.color = 'var(--green)'; feedback.textContent = `> navigating to ${cmd} ...`; }
      setTimeout(() => { window.location.href = target; }, 500);
    } else {
      if (feedback) { feedback.style.color = '#ff5a5a'; feedback.textContent = `> unknown: try home / about / skills / projects / experience / contact`; }
    }
  });
}
