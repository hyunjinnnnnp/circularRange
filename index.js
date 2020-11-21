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
  ctx.font = "bold 50px sans-serif";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(`Ouvrons les`, canvas.width / 2, canvas.height / 2 - 120);
  ctx.fillText(`portes de l'emploi`, canvas.width / 2, canvas.height / 2 - 70);
  ctx.fillText(`aux personnes`, canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText(`immigrantes.`, canvas.width / 2, canvas.height / 2 + 30);
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(`Tournez la poignée`, canvas.width / 2, canvas.height / 2 + 140);
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
  growCircle(angle);
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
////-------------------------------드래그했을 때 원의 크기
function growCircleDrag(clickedX, clickedY, draggedX, draggedY) {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.fillStyle = `${black}`;
  ctx.arc(width / 2, height / 2, bgCircleSize, 0, 2 * Math.PI);
  ctx.fill();

  const widthCenter = canvas.offsetWidth / 2;
  const heightCenter = canvas.offsetHeight / 2;
  let dist;
  //시작점 위치에 닿으면 서클크기 고정시키기
  //마우스 위치의 각도를 받아서 각도가 커진만큼 원을 ++ 시킨다 로 바꾸기!!

  if (draggedY < heightCenter && draggedX > widthCenter) {
    if (draggedX > clickedX) {
      dist = draggedX - clickedX;
      bgCircleSize += dist / 500;
    } else if (draggedX <= clickedX) {
      dist = clickedX - draggedX;
      bgCircleSize -= dist / 500;
    }
  } else if (draggedY > heightCenter && draggedX > widthCenter) {
    if (draggedX < clickedX) {
      dist = clickedX - draggedX;
      bgCircleSize += dist / 500;
    } else if (draggedX > clickedX) {
      dist = draggedX - clickedX;
      bgCircleSize -= dist / 500;
    }
  } else if (draggedY > heightCenter && draggedX < widthCenter) {
    if (draggedX < clickedX) {
      dist = clickedX - draggedX;
      bgCircleSize += dist / 500;
    } else if (draggedX > clickedX) {
      dist = draggedX - clickedX;
      bgCircleSize -= dist / 500;
    }
  } else if (draggedY < heightCenter && draggedX < widthCenter) {
    if (draggedX > clickedX) {
      dist = draggedX - clickedX;
      bgCircleSize += dist / 500;
    } else if (draggedX < clickedX) {
      dist = clickedX - draggedX;
      bgCircleSize -= dist / 500;
    }
  }
}

function growCircle(angle) {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.fillStyle = `${black}`;
  ctx.arc(width / 2, height / 2, bgCircleSize, 0, 2 * Math.PI);
  ctx.fill();

  let first = true;
  bgCircleSize += grow;

  if (angle > -50) {
    grow = -grow;
  } else if (angle < -86) {
    grow = -grow;
    first = false;
  }
  // if (angle < -65 && first === false) {
  //   console.log(first);
  //   grow = -grow;
  // }
}
function hangingthumb() {
  let currentX = Math.cos(degree2Radian(angle)) * circleSize;
  const currentY = Math.sin(degree2Radian(angle)) * circleSize;

  let first = true;
  angle += speed;

  if (angle > -50) {
    speed = -speed;
  } else if (angle < -86) {
    speed = -speed;
  }
  if (angle < -75) {
    first === false;
  }
  if (angle < -77 && first === false) {
    speed = -speed;
  }
  // console.log(first);

  // if (angle < -65 && first === false) {
  //   speed = -speed;
  //   console.log(first); //두번째부터는 각도 작게 하기
  // }

  drawHangingThumb(currentX, currentY);
  drawArrows(angle, currentX, currentY);
}
function draggedHandler(e) {
  // (원 기준으로 마우스가 있는 곳) 각도를 계산
  const theta = Math.atan2(draggedY - centerY, draggedX - centerX);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  growCircleDrag();
  marchDashedLine();
  drawStartPoint();
  drawPath(theta);
  drawThumb(theta);
}

document.addEventListener("mousedown", (e) => {
  mousePressed = true;
  clearInterval(timeId);
  clickedX = e.clientX;
  clickedY = e.clientY; //클릭 좌표를 받는다

  document.addEventListener("mousemove", (e) => {
    if (mousePressed === true) {
      //드래그된 마우스 위치를 받는다
      draggedX = e.clientX; //let, const 붙이면    draggedY is not defined
      draggedY = e.clientY;
      growCircleDrag(clickedX, clickedY, draggedX, draggedY);

      draggedHandler(draggedX, draggedY);
    }
  });
  document.addEventListener("mouseup", (e) => {
    if (mousePressed === true) {
      mousePressed = false;
    }
  });
});
