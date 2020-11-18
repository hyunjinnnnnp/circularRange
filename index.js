const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const degree2Radian = (degrees) => degrees * (Math.PI / 180);
let timeId;

let width, height, mouseClickedX, mouseClickedY, centerX, centerY;
let mousePressed = false;

const circleSize = 300;
const thickness = 5;
const thumbCircleSize = 50;

let angle = -89;
let speed = 0.2;

window.addEventListener("load", () => {
  canvas.width = 900;
  canvas.height = 900;

  width = canvas.width;
  height = canvas.height;
  centerX = (width - circleSize) / 2;
  centerY = (height - circleSize) / 2;

  timeId = setInterval(hangingthumb, 10);
});

function drawDashedLine() {
  // 점선
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.setLineDash([7, 10]);
  ctx.lineWidth = 1;
  ctx.arc(width / 2, height / 2, circleSize, 0, Math.PI * 180);
  ctx.stroke();
}
function drawStartPoint() {
  ctx.beginPath();
  ctx.arc(width / 2, (width - circleSize) / 4, 10, 0, 360);
  ctx.lineWidth = 5;
  ctx.setLineDash([]);
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.fill();
}
function drawPath(theta) {
  // 마우스 따라서 그려지는 선
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, circleSize, degree2Radian(-90), theta);
  ctx.strokeStyle = "black";
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawThumb(theta) {
  const x = Math.cos(theta) * circleSize;
  const y = Math.sin(theta) * circleSize;
  ctx.beginPath();
  ctx.arc(width / 2 + x, height / 2 + y, thumbCircleSize, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.fill();
}
function drawHangingPath(angle) {
  ctx.beginPath();
  ctx.arc(
    width / 2,
    height / 2,
    circleSize,
    degree2Radian(-90),
    degree2Radian(angle)
  );
  ctx.strokeStyle = "black";
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawHangingThumb(currentX, currentY) {
  ctx.clearRect(0, 0, width, height);
  drawDashedLine();
  drawStartPoint();
  ctx.beginPath();
  ctx.arc(
    width / 2 + currentX,
    height / 2 + currentY,
    thumbCircleSize,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
}

function hangingthumb() {
  const currentX = Math.cos(degree2Radian(angle)) * circleSize;
  const currentY = Math.sin(degree2Radian(angle)) * circleSize;

  drawHangingThumb(currentX, currentY);
  drawHangingPath(angle);

  angle += speed;

  if (angle > -50) {
    speed = -speed;
  }
  if (angle < -90) {
    speed = -speed;
  }
}

function dragedHandler() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDashedLine();
  drawStartPoint();
  const step = 360 / 10;

  // (원 기준으로 마우스가 있는 곳) 각도를 계산
  const theta = Math.atan2(mouseClickedY - centerY, mouseClickedX - centerX);

  for (let i = 0; i < 60; i += step) {
    drawPath(theta);
    drawThumb(theta);
  }

  window.requestAnimationFrame(dragedHandler);
}

document.addEventListener("mousedown", (e) => {
  mouseClickedX = e.clientX;
  mouseClickedY = e.clientY;
  mousePressed = true;
  clearInterval(timeId);
});

document.addEventListener("mousemove", (e) => {
  if (mousePressed === true) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseClickedX = mouseX;
    mouseClickedY = mouseY;
    dragedHandler();
  }
});
document.addEventListener("mouseup", (e) => {
  if (mousePressed) {
    mousePressed = false;
  }
});
