// Matter.js 엔진이 이미 생성되어 있다고 가정
// 날짜 상태 및 포맷 함수
var currentDate = new Date(2024, 11, 3, 22, 27); // 11=12월 (JS는 0부터 시작)
function formatDate(date) {
  var y = date.getFullYear();
  var m = (date.getMonth() + 1).toString().padStart(2, '0');
  var d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 날짜 HTML 요소 생성 및 스타일 적용
var dateDiv = document.getElementById('date-text');
if (!dateDiv) {
  dateDiv = document.createElement('div');
  dateDiv.id = 'date-text';
  document.body.appendChild(dateDiv);
}
dateDiv.style.position = 'fixed';
dateDiv.style.zIndex = 10;
dateDiv.style.width = '200px';
dateDiv.style.height = '200px';
dateDiv.style.font = "bold 20px 'Tasan-Regular', sans-serif";
dateDiv.style.color = 'var(--color-accent)';
dateDiv.style.pointerEvents = 'none';
dateDiv.style.transition = 'opacity 0.4s, left 0.3s, top 0.3s, clip-path 0.3s';
dateDiv.style.opacity = '0';
dateDiv.style.userSelect = 'none';
dateDiv.style.borderRadius = '50%';
dateDiv.style.background = 'rgba(255,255,255,0)';
dateDiv.style.overflow = 'visible';

// -------------------- Link Circle --------------------
var linkDiv=document.getElementById('link-circle');
if(!linkDiv){
  linkDiv=document.createElement('div');
  linkDiv.id='link-circle';
  document.body.appendChild(linkDiv);
}
linkDiv.style.position='fixed';
linkDiv.style.zIndex=9;
linkDiv.style.width='700px';
linkDiv.style.height='700px';
linkDiv.style.font="normal 12px 'Tasan-Regular', sans-serif";
linkDiv.style.color='var(--color-accent)';
linkDiv.style.pointerEvents='none';
linkDiv.style.transition='opacity 0.4s, left 0.8s, top 0.8s, clip-path 0.8s';
linkDiv.style.opacity='0';
linkDiv.style.userSelect='none';
linkDiv.style.borderRadius='50%';
linkDiv.style.background='rgba(0,0,0,0)';
linkDiv.style.overflow='visible';

function renderLinkCircular(text){
  linkDiv.innerHTML='';
  var radius=350;
  var chars=text.split('');
  var n=chars.length;
  var startAngle=-90;
  chars.forEach(function(ch,idx){
    var angle=startAngle+idx*360/n;
    var span=document.createElement('span');
    span.textContent=ch;
    span.style.position='absolute';
    span.style.left='50%';
    span.style.top='50%';
    span.style.transformOrigin='0 0';
    span.style.transform=`rotate(${angle}deg) translate(0, -${radius}px) rotate(${-angle}deg)`;
    linkDiv.appendChild(span);
  });
}

function updateLinkDivText(text){
  renderLinkCircular(text);
  linkDiv.classList.add('flash-bright');
  setTimeout(function(){ linkDiv.classList.remove('flash-bright'); },300);

  linkDiv.style.wordBreak='break-all';
}

window.setLinkText=function(str){ updateLinkDivText(str); };

function renderDateCircular(text){
  // clear previous
  dateDiv.innerHTML = '';
  var radius = 100; // px
  var chars = text.split('');
  var n = chars.length;
  var startAngle = -90; // start at top
  chars.forEach(function(ch, idx){
    var angle = startAngle + idx * 360 / n;
    var span = document.createElement('span');
    span.textContent = ch;
    span.style.position = 'absolute';
    span.style.left = '50%';
    span.style.top = '50%';
    span.style.transformOrigin = '0 0';
    span.style.transform = `rotate(${angle}deg) translate(0, -${radius}px) rotate(${ -angle }deg)`;
    dateDiv.appendChild(span);
  });
}

renderDateCircular(formatDate(currentDate));

function updateDateDivText() {
  renderDateCircular(formatDate(currentDate));
  // flash effect
  dateDiv.classList.add('flash-bright');
  setTimeout(function(){ dateDiv.classList.remove('flash-bright'); },300);
}

function moveDateDivToMask() {
  if (!window.getClipMaskCenter) return;
  var center = window.getClipMaskCenter();
  const sidebar = document.getElementById('article-list');
  const sidebarWidth = sidebar ? sidebar.offsetWidth : 0;
  const maxX = window.innerWidth - sidebarWidth - 10; // 10px margin
  const clampedX = Math.min(center.x, maxX);
  // 중앙 정렬을 위해 transform 사용
  dateDiv.style.left = `${clampedX}px`;
  dateDiv.style.top = `${center.y}px`;
  dateDiv.style.transform = 'translate(-50%, -50%)';

  // linkDiv follows same center
  linkDiv.style.left=`${clampedX}px`;
  linkDiv.style.top=`${center.y}px`;
  linkDiv.style.transform='translate(-50%, -50%)';
}

// 날짜가 바뀌면 텍스트만 갱신
function addOneDay() {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDateDivText();
}
window.addOneDay = addOneDay;

// 마스크가 움직일 때마다 날짜 위치 갱신 (200ms마다)
setInterval(moveDateDivToMask, 500);
// 리사이즈 시에도 위치 갱신
window.addEventListener('resize', moveDateDivToMask);
// 최초 1회 위치 갱신
moveDateDivToMask();

// 노출 애니메이션 함수
function fadeInDateDiv() {
  dateDiv.style.opacity = '1';
}
window.fadeInDate = fadeInDateDiv;

// also expose fadeIn for link
function fadeInLink(){ linkDiv.style.opacity='1'; }
window.fadeInLink=fadeInLink;

// center-text 숨김
var centerTextDiv = document.getElementById('center-text');
if (centerTextDiv) centerTextDiv.style.display = 'none'; 

function setDateFromString(dtStr){
  // expected formats: 'YYYY-MM-DD' or 'YYYY-MM-DD,HH:MM'
  try{
    var parts = dtStr.split(/[,-]/); // split by hyphen or comma
    var y=parseInt(parts[0],10);
    var m=parseInt(parts[1],10)-1; // month 0-based
    var d=parseInt(parts[2],10);
    var h=0, min=0;
    if(parts.length>=5){h=parseInt(parts[3],10);min=parseInt(parts[4],10);}
    currentDate = new Date(y,m,d,h,min);
    updateDateDivText();
  }catch(e){console.warn('setDateFromString parse error',e);}
}
window.setDateFromString=setDateFromString; 

// -------------------- Title Follow --------------------
var titleDiv=document.getElementById('title-follow');
if(!titleDiv){
  titleDiv=document.createElement('div');
  titleDiv.id='title-follow';
  document.body.appendChild(titleDiv);
}
var titleOffset={x:0,y:0};

function setTitleFollow(text){
  titleDiv.textContent=text;
  // random offset within -50..50 px horizontal and vertical
  titleOffset.x=Math.floor(Math.random()*101)-50; // -50..50
  titleOffset.y=Math.floor(Math.random()*101)-50;
  // random width 80-300px
  var w=Math.floor(Math.random()*221)+80;
  titleDiv.style.maxWidth=w+'px';
  titleDiv.style.width=w+'px';
  updateTitlePosition();
}

function updateTitlePosition(){
  const sidebar=document.getElementById('article-list');
  const sidebarWidth=sidebar? sidebar.offsetWidth:0;
  var center={x: window.innerWidth/2, y: window.innerHeight/2};
  if(window.getClipMaskCenter) center=window.getClipMaskCenter();
  const maxX = window.innerWidth - sidebarWidth - 10;
  const clampedX = Math.min(center.x, maxX);
  titleDiv.style.left=`${clampedX+titleOffset.x}px`;
  titleDiv.style.top=`${center.y+titleOffset.y}px`;
  titleDiv.style.transform='translate(-50%, -50%)';
}

window.setTitleFollow=setTitleFollow;

// modify moveDateDivToMask to also move title
const _origMove=moveDateDivToMask;
moveDateDivToMask=function(){
  _origMove();
  updateTitlePosition();
} 