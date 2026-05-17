const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('next-btn');
const dotsContainer = document.getElementById('dots');

const TOTAL = slides.length;
const LAST_NAV_SLIDE = 5; // last slide that shows the next button (0-indexed)

let current = 0;

function buildDots() {
  // Dots for slides 0–4 (exclude celebration)
  for (let i = 0; i < TOTAL - 1; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });
}

function goTo(index) {
  if (index === current) return;

  slides[current].classList.remove('active');
  slides[current].classList.add('exit');

  setTimeout(() => {
    slides[current].classList.remove('exit');
    current = index;
    slides[current].classList.add('active');
    updateDots();
    updateNav();
  }, 500);
}

function nextSlide() {
  if (current < LAST_NAV_SLIDE) {
    goTo(current + 1);
  }
}

function updateNav() {
  const isFinalSlides = current >= LAST_NAV_SLIDE;
  nextBtn.classList.toggle('hidden', isFinalSlides);
}

function onYes() {
  goTo(TOTAL - 1); // go to celebration
  spawnHearts();
}

function onNo() {
  // gently nudge back to the proposal
  slides[current].classList.add('shake');
  setTimeout(() => slides[current].classList.remove('shake'), 600);
}

function spawnHearts() {
  const emojis = ['❤️', '💕', '💗', '💖', '💝', '🌸'];
  const count = 20;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'heart-particle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '80vh';
      el.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }, i * 100);
  }
}

// Shake animation via JS (no extra CSS class needed at load time)
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-6px); }
    80%       { transform: translateX(6px); }
  }
  .shake { animation: shake 0.5s ease; }
`;
document.head.appendChild(style);

buildDots();
updateNav();
