// CSV 기사 로더
let articles = [];
let articleIndex = -1;

// CSV 파일 경로
const csvPath = encodeURI('./csv/2025-A-Reply-from-the-Lowlands.csv');

fetch(csvPath)
  .then(resp => resp.text())
  .then(text => {
    // 간단 파싱: 줄 단위 분할 후 첫 열(DateTime)과 두 번째 열(Title) 기준 파싱
    const lines = text.trim().split(/\r?\n/);
    // 첫 줄은 헤더
    lines.shift();
    lines.forEach(line => {
      const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      if (parts.length >= 3) {
        const dateTime = parts[0].replace(/^"|"$/g, '');
        const title = parts[1].replace(/^"|"$/g, '');
        const summary = parts[2].replace(/^"|"$/g, '');
        const url = (parts[4] ? parts[4] : '').replace(/^"|"$/g, '').trim();
        articles.push({dateTime,title,summary,url});
      }
    });
  })
  .catch(err => console.error('CSV load error', err));

function nextArticle() {
  if (!articles.length) return;
  articleIndex = (articleIndex + 1) % articles.length;
  const art = articles[articleIndex];
  const clip = document.getElementById('clip-text');
  if (clip) {
    clip.textContent = art.title + '↵';
    const cw = window.innerWidth - (document.getElementById('article-list')?.offsetWidth || 0) - 40;
    clip.style.width = cw + 'px';
    clip.style.maxWidth = cw + 'px';
    clip.style.whiteSpace = 'normal';
    clip.style.wordBreak = 'keep-all';
    clip.style.overflowWrap = 'break-word';
  }
  window.currentTitleWords = art.title.split(/\s+/);

  const sidebar = document.getElementById('article-list');
  if (sidebar) {
    const item = document.createElement('div');
    item.className = 'article-item';

    // position randomly along vertical axis within viewport
    const maxTop = window.innerHeight - 220; // approximate height of card
    const randTop = Math.floor(Math.random() * maxTop);
    item.style.top = randTop + 'px';

    // random horizontal offset within 0-100px from right edge
    const randRight = Math.floor(Math.random()*200);
    item.style.right = randRight + 'px';

    // macOS style window bar
    const bar = document.createElement('div');
    bar.className = 'window-bar';
    const red = document.createElement('span'); red.className='win-btn red';
    const yellow = document.createElement('span'); yellow.className='win-btn yellow';
    const green = document.createElement('span'); green.className='win-btn green';
    bar.appendChild(red); bar.appendChild(yellow); bar.appendChild(green);
    item.appendChild(bar);

    const h4 = document.createElement('h4');
    h4.textContent = art.title;
    item.appendChild(h4);

    const sum = document.createElement('div');
    sum.className = 'summary';
    sum.textContent = art.summary;
    item.appendChild(sum);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = art.dateTime;

    if (art.url) {
      const linkSpan = document.createElement('span');
      linkSpan.className = 'article-link';
      linkSpan.textContent = `  (${art.url})`;
      meta.appendChild(linkSpan);
    }

    item.appendChild(meta);

    sidebar.appendChild(item);

    // add button behaviors
    red.addEventListener('click', function(e){
      e.stopPropagation();
      item.remove();
    });
    green.addEventListener('click', function(e){
      e.stopPropagation();
      let cur = parseFloat(item.dataset.scale || '1');
      cur *= 1.1;
      item.dataset.scale = cur;
      item.style.transform = `scale(${cur})`;
    });
    yellow.addEventListener('click', function(e){
      e.stopPropagation();
      let cur = parseFloat(item.dataset.scale || '1');
      cur *= 0.9;
      item.dataset.scale = cur;
      item.style.transform = `scale(${cur})`;
    });
  }
}

window.nextArticle = nextArticle;
// provide initial words when CSV loaded
fetch(csvPath)
  .then(resp => resp.text())
  .then(text => {
    const lines = text.trim().split(/\r?\n/);
    lines.shift();
    lines.forEach(line => {
      const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/); // keep previous splits? we changed earlier; maintain; simpler fallback
    });
  }); 