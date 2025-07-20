// CSV 기사 로더
let articles = [];
let articleIndex = -1;

// CSV 파일 경로
const csvPath = encodeURI('./csv/12월.csv');

fetch(csvPath)
  .then(resp => resp.text())
  .then(text => {
    // 간단 파싱: 줄 단위 분할 후 첫 열(DateTime)과 두 번째 열(Title) 기준 파싱
    const lines = text.trim().split(/\r?\n/);
    // 첫 줄은 헤더
    lines.shift();
    lines.forEach(line => {
      const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      if (parts.length >= 8) {
        const dateTime = parts[0].replace(/^"|"$/g, '');
        const title = parts[1].replace(/^"|"$/g, '');
        const summary = parts[2].replace(/^"|"$/g, '');
        const sentiment = parts[7].replace(/^"|"$/g, '').trim();
        articles.push({dateTime,title,summary,sentiment});
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
    clip.style.maxWidth = cw + 'px';
    clip.style.whiteSpace = 'normal';
    clip.style.overflowWrap = 'anywhere';
  }
  window.currentTitleWords = art.title.split(/\s+/);

  const sidebar = document.getElementById('article-list');
  if (sidebar) {
    const item = document.createElement('div');
    item.className = 'article-item';
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
    const ind = document.createElement('span');
    ind.className = 'indicator';
    ind.textContent = art.sentiment.trim().toLowerCase()==='negative'?' ●':' ●';
    ind.style.color = art.sentiment.trim().toLowerCase()==='negative'?'red':'green';
    meta.appendChild(ind);
    item.appendChild(meta);
    sidebar.appendChild(item);
    sidebar.scrollTop = sidebar.scrollHeight;
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