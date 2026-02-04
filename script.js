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
}

function esc(t) {
  const d = document.createElement('div');
  d.textContent = t;
  return d.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('userInput').value.trim()) generateTimeline();
});
