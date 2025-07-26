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
dateDiv.style.font = "bold 20px 'Happiness-Sans-Regular', sans-serif";
dateDiv.style.color = 'var(--color-accent)';
dateDiv.style.pointerEvents = 'none';
dateDiv.style.transition = 'opacity 0.4s, left 0.3s, top 0.3s, clip-path 0.3s';
dateDiv.style.opacity = '0';
dateDiv.style.whiteSpace = 'nowrap';
dateDiv.style.userSelect = 'none';
dateDiv.style.padding = '5px 20px';
// dateDiv.style.border = '2px solid #aebab8';
dateDiv.style.borderRadius = '100px';
dateDiv.style.background = 'rgba(255,255,255,0.2)';

dateDiv.textContent = formatDate(currentDate);

function updateDateDivText() {
  dateDiv.textContent = formatDate(currentDate);
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
// center-text 숨김
var centerTextDiv = document.getElementById('center-text');
if (centerTextDiv) centerTextDiv.style.display = 'none'; 