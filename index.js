const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const degree2Radian = (degrees) => degrees * (Math.PI / 180);

let width, height, mouseClickedX, mouseClickedY, centerX, centerY, timeId;
let mousePressed = false;

const circleSize = 300;
let bgCircleSize = circleSize + 80;
const thickness = 5;
const thumbCircleSize = 60;
ctx.lineCap = "round";
let offset = 0; //행군 개미 효과
let angle = -86;
let speed = 0.2;
let grow = speed;

const gray = "#FFFFFF",
  black = "#282828",
  red = "#CC2634";

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
  ctx.strokeStyle = `${black}`;
  ctx.setLineDash([7, 10]);
  ctx.lineDashOffset = -offset;
  ctx.lineWidth = 1;
  ctx.arc(width / 2, height / 2, circleSize, 0, Math.PI * 180);
  ctx.strokeStyle = `${gray}`;
  ctx.fillStyle = `${black}`;
  ctx.fill();
  ctx.stroke();
}
function marchDashedLine() {
  offset++;
  if (offset > 16) {
    offset = 0;
  }
  drawDashedLine();
}

function drawStartPoint() {
  ctx.beginPath();
  ctx.arc(width / 2, (width - circleSize) / 4, 10, 0, 360);
  ctx.lineWidth = 8;
  ctx.setLineDash([]);
  ctx.strokeStyle = `${gray}`;
  ctx.stroke();
  ctx.fillStyle = `${black}`;
  ctx.fill();
}
function drawPath(theta) {
  // 마우스 따라서 그려지는 선
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, circleSize, degree2Radian(-87), theta);
  ctx.lineWidth = 5;
  ctx.strokeStyle = `${gray}`;
  ctx.stroke();
}

function drawThumb(theta) {
  const currentX = Math.cos(theta) * circleSize;
  const currentY = Math.sin(theta) * circleSize;
  ctx.beginPath();
  ctx.arc(
    width / 2 + currentX,
    height / 2 + currentY,
    thumbCircleSize,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = `${gray}`;
  ctx.fill();
  let angle = (theta * 180) / Math.PI;
  drawArrows(angle, currentX, currentY);
}
function drawHangingPath(angle) {
  ctx.beginPath();
  ctx.arc(
    width / 2,
    height / 2,
    circleSize,
    degree2Radian(-87),
    degree2Radian(angle)
  );
  ctx.strokeStyle = `${gray}`;
  ctx.lineWidth = 5;
  ctx.stroke();
}
function drawArrows(angle, currentX, currentY) {
  //Draw Arrows rotate
  let circleCenterX = width / 2 + currentX,
    circleCenterY = height / 2 + currentY;

  ctx.save();
  ctx.translate(circleCenterX, circleCenterY);
  ctx.rotate((angle * Math.PI) / 180);

  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.lineTo(-6, 24);
  ctx.lineTo(6, 24);
  ctx.lineTo(0, 30);

  ctx.moveTo(0, -30);
  ctx.lineTo(-6, -24);
  ctx.lineTo(6, -24);
  ctx.lineTo(0, -30);
  ctx.fillStyle = `${black}`;
  ctx.fill();
  ctx.restore();
}
function drawHangingThumb(currentX, currentY) {
  ctx.clearRect(0, 0, width, height);
  drawHangingBgCircle(angle);
  marchDashedLine();
  drawStartPoint();
  drawHangingPath(angle);

  ctx.beginPath();
  ctx.arc(
    width / 2 + currentX,
    height / 2 + currentY,
    thumbCircleSize,
    0,
    2 * Math.PI
  );

  ctx.fillStyle = `${gray}`;
  ctx.fill();
}
function drawDraggedBgCircle(e, clickedX, clickedY) {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.fillStyle = `${black}`;
  ctx.arc(width / 2, height / 2, bgCircleSize, 0, 2 * Math.PI);
  ctx.fill();

  // if (e.clientX > width / 2 && e.clientY > height / 2) {
  //   //위 오른쪽
  //   if (clickedX > e.clientX || clickedY < e.clientY) {
  //     bgCircleSize += 0.2;
  //   }
  // }
}
function drawHangingBgCircle(angle) {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.fillStyle = `${black}`;
  ctx.arc(width / 2, height / 2, bgCircleSize, 0, 2 * Math.PI);
  ctx.fill();

  bgCircleSize += grow;
  if (angle > -50) {
    grow = -grow;
  } else if (angle < -86) {
    grow = -grow;
  }
}

function hangingthumb() {
  const currentX = Math.cos(degree2Radian(angle)) * circleSize;
  const currentY = Math.sin(degree2Radian(angle)) * circleSize;

  drawHangingThumb(currentX, currentY);
  drawArrows(angle, currentX, currentY);

  angle += speed;
  if (angle > -50) {
    speed = -speed;
  } else if (angle < -86) {
    speed = -speed;
  }
}

function dragedHandler(e) {
  // (원 기준으로 마우스가 있는 곳) 각도를 계산
  const theta = Math.atan2(mouseClickedY - centerY, mouseClickedX - centerX);
  const angle = theta * (180 / Math.PI);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDraggedBgCircle(e);
  marchDashedLine();
  drawStartPoint();
  drawPath(theta);
  drawThumb(theta);
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
