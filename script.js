let effectIntervals = [];

function generateTimeline() {
  const userInput = document.getElementById('userInput').value;
  const timelineEl = document.getElementById('timeline');
  const emptyEl = document.getElementById('empty');
  const yearRangeEl = document.getElementById('yearRange');

  const lines = userInput.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    timelineEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
    yearRangeEl.textContent = '';
    return;
  }

  const items = lines.map(line => {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 2) {
      const date = parts[0];
      let title = parts[1];
      const description = parts[2] || '';

      // 比翼（★）か破局（✕）かチェック
      const isGame = title.startsWith('★');
      const isBreakup = title.startsWith('✕') || title.startsWith('×');

      if (isGame) title = title.substring(1).trim();
      if (isBreakup) title = title.substring(1).trim();

      const yearMatch = date.match(/(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : 0;
      const monthMatch = date.match(/(\d{1,2})月/);
      const month = monthMatch ? parseInt(monthMatch[1], 10) : 1;
      const dayMatch = date.match(/(\d{1,2})日/);
      const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;

      return { date, title, description, year, isGame, isBreakup, sortKey: year * 10000 + month * 100 + day };
    }
    return null;
  }).filter(item => item !== null);

  if (items.length === 0) {
    timelineEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
    yearRangeEl.textContent = '';
    return;
  }

  items.sort((a, b) => a.sortKey - b.sortKey);
  emptyEl.classList.add('hidden');

  // 年の範囲を表示
  const years = items.map(i => i.year).filter(y => y > 0);
  if (years.length > 0) {
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    yearRangeEl.textContent = minYear === maxYear ? `${minYear}年` : `${minYear}年 - ${maxYear}年`;
  }

  timelineEl.innerHTML = items.map((item, i) => {
    let typeClass = '';
    let badge = '';
    let effectBox = '';

    if (item.isGame) {
      typeClass = 'game';
      badge = '<span class="card-badge">比翼</span>';
      effectBox = '<div class="sakura-box"></div>';
    } else if (item.isBreakup) {
      typeClass = 'breakup';
      badge = '<span class="card-badge">破局</span>';
      effectBox = '<div class="tear-box"></div>';
    }

    const side = i % 2 === 0 ? 'left' : 'right';

    return `
      <div class="timeline-item ${side} ${typeClass}" style="animation-delay:${i * 0.1}s">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          ${effectBox}
          <div class="card-date">${esc(item.date)}</div>
          ${badge}
          <div class="card-title">${esc(item.title)}</div>
          <div class="card-desc">${esc(item.description)}</div>
        </div>
      </div>
    `;
  }).join('');

  setTimeout(startEffects, 500);
}

function esc(t) {
  const d = document.createElement('div');
  d.textContent = t;
  return d.innerHTML;
}

// 桜の花びらSVG
function createPetalSVG() {
  const hue = Math.random() * 15;
  const id = 'p' + Math.random().toString(36).substring(2, 11);

  return `<svg viewBox="0 0 12 20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${id}" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stop-color="hsl(${350 + hue}, 100%, 95%)"/>
        <stop offset="50%" stop-color="hsl(${345 + hue}, 90%, 85%)"/>
        <stop offset="100%" stop-color="hsl(${340 + hue}, 80%, 75%)"/>
      </radialGradient>
      <filter id="glow${id}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="0.8" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <ellipse cx="6" cy="10" rx="5" ry="9" fill="url(#${id})" filter="url(#glow${id})"/>
  </svg>`;
}

function createSakuraInCard(container) {
  const petal = document.createElement('div');
  petal.className = 'sakura';
  petal.innerHTML = createPetalSVG();

  const width = Math.random() * 2 + 3;
  const height = width * (1.4 + Math.random() * 0.3);
  const left = Math.random() * 80 + 10;
  const fallDuration = Math.random() * 2 + 4;
  const driftDuration = Math.random() * 1 + 2;
  const delay = Math.random() * 0.5;
  const startRotate = Math.random() * 360;
  const endRotate = startRotate + (Math.random() > 0.5 ? 120 : -120);
  const driftAmount = (Math.random() * 6 - 3);

  petal.style.left = left + '%';
  petal.style.width = width + 'px';
  petal.style.height = height + 'px';
  petal.style.setProperty('--fall-duration', fallDuration + 's');
  petal.style.setProperty('--drift-duration', driftDuration + 's');
  petal.style.setProperty('--start-rotate', startRotate + 'deg');
  petal.style.setProperty('--end-rotate', endRotate + 'deg');
  petal.style.setProperty('--drift-amount', driftAmount + 'px');
  petal.style.animationDelay = `${delay}s, 0s`;

  container.appendChild(petal);
  setTimeout(() => petal.remove(), (fallDuration + delay) * 1000);
}

function createSnowInCard(container) {
  const snow = document.createElement('div');
  snow.className = 'snowflake';

  const size = Math.random() * 1.5 + 1;
  const left = Math.random() * 80 + 10;
  const fallDuration = Math.random() * 2 + 4;
  const driftDuration = Math.random() * 1 + 2;
  const delay = Math.random() * 0.5;

  snow.style.left = left + '%';
  snow.style.width = size + 'px';
  snow.style.height = size + 'px';
  snow.style.setProperty('--fall-duration', fallDuration + 's');
  snow.style.setProperty('--drift-duration', driftDuration + 's');
  snow.style.animationDelay = `${delay}s, 0s`;

  container.appendChild(snow);
  setTimeout(() => snow.remove(), (fallDuration + delay) * 1000);
}

function startEffects() {
  effectIntervals.forEach(id => clearInterval(id));
  effectIntervals = [];

  document.querySelectorAll('.sakura-box').forEach(box => {
    for (let i = 0; i < 2; i++) {
      setTimeout(() => createSakuraInCard(box), i * 800);
    }
    effectIntervals.push(setInterval(() => createSakuraInCard(box), 1500));
  });

  document.querySelectorAll('.tear-box').forEach(box => {
    for (let i = 0; i < 2; i++) {
      setTimeout(() => createSnowInCard(box), i * 600);
    }
    effectIntervals.push(setInterval(() => createSnowInCard(box), 1200));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('userInput').value.trim()) {
    generateTimeline();
  }
});
