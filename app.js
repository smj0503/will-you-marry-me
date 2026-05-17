const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('next-btn');
const introButtons = document.getElementById('intro-buttons');
const dotsContainer = document.getElementById('dots');

const TOTAL = slides.length;
const LAST_NAV_SLIDE = 10; // last slide that shows the next button (0-indexed)

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
  const showIntro = current === 0;
  const showNext = current > 0 && current < LAST_NAV_SLIDE;
  introButtons.classList.toggle('hidden', !showIntro);
  nextBtn.classList.toggle('hidden', !showNext);
}

// 첫 번째 슬라이드 버튼
function introYes() {
  goTo(1);
}

function introNo() {
  document.getElementById('popup-overlay').classList.remove('hidden');
}

function closePopup() {
  document.getElementById('popup-overlay').classList.add('hidden');
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

buildDots();
updateNav();
