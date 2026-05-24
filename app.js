const slides = document.querySelectorAll('.slide');
const introButtons = document.getElementById('intro-buttons');
const storyButtons = document.getElementById('story-buttons');
const dotsContainer = document.getElementById('dots');
const nav = document.getElementById('nav');
const bgm = document.getElementById('bgm');

const TOTAL = slides.length;
const STORY_LAST = 9; // 스토리 슬라이드 마지막 인덱스 (슬라이드 2~7)
const PROPOSAL_SLIDE = TOTAL - 3;
const CELEBRATION_SLIDE = TOTAL - 2;
const LYRIC_SLIDE = TOTAL - 1;
const CELEBRATION_AUTO_ADVANCE_MS = 2150;

// 타이프라이터 적용 슬라이드 원본 HTML 저장
const TYPEWRITER_SLIDES = {};
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, LYRIC_SLIDE].forEach(i => {
  const els = Array.from(slides[i].querySelectorAll('.question'));
  if (els.length) TYPEWRITER_SLIDES[i] = els.map(el => ({ el, html: el.innerHTML }));
});

function typewriter(el, html, speed, onDone) {
  const tokens = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      tokens.push({ type: 'tag', value: html.slice(i, end + 1) });
      i = end + 1;
    } else {
      tokens.push({ type: 'char', value: html[i] });
      i++;
    }
  }
  el.innerHTML = '';
  let idx = 0;
  function tick() {
    if (idx >= tokens.length) {
      el.innerHTML += '<span class="typewriter-cursor">▼</span>';
      if (onDone) onDone();
      return;
    }
    const t = tokens[idx++];
    el.innerHTML += t.value;
    if (t.type === 'char') setTimeout(tick, speed);
    else tick();
  }
  tick();
}

function typewriterChain(items, speed, onDone) {
  items.slice(1).forEach(item => { item.el.style.visibility = 'hidden'; });
  function next(i) {
    if (i >= items.length) {
      if (onDone) onDone();
      return;
    }
    if (i > 0) {
      const cursor = items[i - 1].el.querySelector('.typewriter-cursor');
      if (cursor) cursor.remove();
      items[i].el.style.visibility = 'visible';
    }
    typewriter(items[i].el, items[i].html, speed, () => next(i + 1));
  }
  next(0);
}

// 슬라이드 번호별 팝업 이미지 매핑
const POPUP_IMAGES = {
  1: 'images/똥개/0.png',
  2: 'images/똥개/1.png',
  3: 'images/똥개/2.png',
  4: 'images/똥개/3.png',
  5: 'images/똥개/4.png',
  6: 'images/똥개/5.png',
  7: 'images/똥개/6.png',
  8: 'images/똥개/7.png',
  9: 'images/똥개/0.png',
};

let current = 0;
let autoAdvanceTimer = null;

function playBgm() {
  if (!bgm || !bgm.paused) return;

  bgm.volume = 0.6;
  bgm.play().catch(() => {});
}

['pointerdown', 'touchstart', 'keydown'].forEach(eventName => {
  document.addEventListener(eventName, playBgm, { once: true });
});

function buildDots() {
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
  clearTimeout(autoAdvanceTimer);

  slides[current].classList.remove('active');
  slides[current].classList.add('exit');

  setTimeout(() => {
    slides[current].classList.remove('exit');
    current = index;
    slides[current].classList.add('active');
    updateDots();
    updateNav();
    onSlideActivate(index);
  }, 500);
}

function updateNav() {
  const isTitle = current === 0;
  const hideNav = isTitle || current >= PROPOSAL_SLIDE;
  const showIntro = current === 1;
  const showStory = current >= 2 && current <= STORY_LAST;
  nav.classList.toggle('hidden', hideNav);
  introButtons.classList.toggle('hidden', !showIntro);
  storyButtons.classList.toggle('hidden', !showStory);
}

function onSlideActivate(index) {
  slides[index].classList.remove('text-complete');
  clearTimeout(autoAdvanceTimer);

  if (TYPEWRITER_SLIDES[index]) {
    const speed = index === LYRIC_SLIDE ? 200 : 150;
    typewriterChain(TYPEWRITER_SLIDES[index], speed, () => {
      slides[index].classList.add('text-complete');
    });
  } else {
    requestAnimationFrame(() => {
      slides[index].classList.add('text-complete');

      if (index === CELEBRATION_SLIDE) {
        autoAdvanceTimer = setTimeout(() => {
          goTo(LYRIC_SLIDE);
        }, CELEBRATION_AUTO_ADVANCE_MS);
      }
    });
  }
}

// 타이틀 슬라이드 버튼
function startGame() {
  playBgm();
  goTo(1);
}
function exitGame() {
  playBgm();
  showPopup('images/똥개/intro.png', '', '돌아가기');
  shakePopup();
}

// 인트로 슬라이드 버튼
function introYes() {
  playBgm();
  goTo(2);
}
function introNo()  {
  playBgm();
  shakeAndPopup();
}

// 스토리 슬라이드 버튼
function storyNext() {
  playBgm();
  goTo(current + 1);
}
function storyNo()   {
  playBgm();
  shakeAndPopup();
}

// 팝업
function showPopup(imgSrc, msg, btnLabel) {
  const src = imgSrc !== undefined ? imgSrc : (POPUP_IMAGES[current] || '');
  const text = msg !== undefined ? msg : '';
  document.getElementById('popup-img').src = src;
  document.getElementById('popup-msg').textContent = text;
  document.getElementById('popup-btn').textContent = btnLabel || 'ㅋㅋㅋ 들어볼게';
  document.getElementById('popup-overlay').classList.remove('hidden');
}

function shakeAndPopup(btnLabel) {
  showPopup(undefined, undefined, btnLabel);
  shakePopup();
}

function shakePopup() {
  const box = document.querySelector('.popup-box');
  box.classList.add('shake');
  setTimeout(() => box.classList.remove('shake'), 600);
}

function closePopup() {
  document.getElementById('popup-overlay').classList.add('hidden');
}

// 청혼 슬라이드 버튼
function onYes() {
  goTo(CELEBRATION_SLIDE);
  spawnHearts();
}

function onNo() {
  slides[current].classList.add('shake');
  setTimeout(() => slides[current].classList.remove('shake'), 600);
}

function spawnHearts() {
  const emojis = ['❤️', '💕', '💗', '💖', '💝', '🌸'];
  const count = 36;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'heart-particle';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * 92 + 4 + 'vw';
      el.style.top = Math.random() * 76 + 10 + 'vh';
      el.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }, i * 80);
  }
}

buildDots();
updateNav();
