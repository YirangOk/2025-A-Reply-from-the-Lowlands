// 클리핑 마스크 동그라미 움직임
var clipBg = document.getElementById('clip-bg');

function getMaskRadius() {
  // 기존: window.innerWidth * 0.4 또는 0.2
  // 3분의 2로 줄임: 0.4 * 2/3 = 0.266..., 0.2 * 2/3 = 0.133...
  const base = window.innerWidth <= 600 ? window.innerWidth * 0.2667 : window.innerWidth * 0.1333;
  return base * 1.5;
}
var maskOrigin = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};
var lastMask = {
  x: maskOrigin.x,
  y: maskOrigin.y
};
var maskRadius = getMaskRadius();

function setClipMaskPos(pos, r = getMaskRadius()) {
  var val = `circle(${r}px at ${pos.x}px ${pos.y}px)`;
  clipBg.style.clipPath = val;
  clipBg.style.webkitClipPath = val;
}

// 초기에는 마스크가 0 크기로 숨겨짐
setClipMaskPos(lastMask, 0);

var maskRevealed = false;

var shakeInterval = null;
function startClipShake() {
  if (shakeInterval) return;
  // 처음 클릭 시 마스크를 서서히 확대
  if (!maskRevealed) {
    maskRevealed = true;
    setClipMaskPos(lastMask); // r defaults to full radius, CSS transition animates
  }
  shakeInterval = setInterval(function () {
    var clipEl = document.getElementById('clip-text');
    var rect = clipEl ? clipEl.getBoundingClientRect() : {left:0, top:0, right:window.innerWidth, bottom:window.innerHeight};
    var minX = rect.left;
    var maxX = rect.right;
    var minY = rect.top;
    var maxY = rect.bottom;
    lastMask.x = Math.random() * (maxX - minX) + minX;
    lastMask.y = Math.random() * (maxY - minY) + minY;
    setClipMaskPos(lastMask);
  }, 200);
}
function stopClipShake() {
  clearInterval(shakeInterval);
  shakeInterval = null;
}
window.addEventListener('resize', function () {
  maskRadius = getMaskRadius();
  setClipMaskPos(lastMask);
});
// 외부에서 startClipShake, stopClipShake을 쓸 수 있게 window에 등록
window.startClipShake = startClipShake;
window.stopClipShake = stopClipShake;
window.getClipMaskCenter = function() { return { x: lastMask.x, y: lastMask.y }; }; 