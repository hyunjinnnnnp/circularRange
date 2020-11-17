const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const degree2Radian = (degrees) => degrees * (Math.PI / 180);

let width, height, mouseX, mouseY, centerX, centerY;

const circleSize = 300;
const thickness = 5;
const draggingCircleSize = 50;

window.addEventListener("load", (_) => {
  canvas.width = 900;
  canvas.height = 900;

  width = canvas.width;
  height = canvas.height;
  centerX = (width - circleSize) / 2;
  centerY = (height - circleSize) / 2;

  window.requestAnimationFrame(render);
});

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const step = 360 / 100;

  ctx.fillStyle = "black";

  // 마우스 위치-센터 (원 기준으로 마우스가 있는 곳) 각도를 계산
  // 썸의 위치 계산
  const theta = Math.atan2(mouseY - centerY, mouseX - centerX);

  for (let i = 0; i < 360; i += step) {
    const x = Math.cos(degree2Radian(i)) * circleSize;
    const y = Math.sin(degree2Radian(i)) * circleSize;

    // 점선
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.setLineDash([7, 10]);
    ctx.lineWidth = 1;
    ctx.arc(width / 2, height / 2, circleSize, 0, 360);
    ctx.stroke();

    //원 시작점에 애기 원 그리기
    ctx.beginPath();
    ctx.arc(width / 2, (width - circleSize) / 4, 10, 0, 360);
    ctx.lineWidth = 5;
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.fill();

    // 마우스 따라서 그려지는 선
    function drawLine() {
      ctx.beginPath();

      ctx.arc(width / 2, height / 2, circleSize, degree2Radian(-90), theta);
      ctx.strokeStyle = "black";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // thumb 손잡이
    function drawThumb() {
      const cx = Math.cos(theta) * circleSize;
      const cy = Math.sin(theta) * circleSize;
      ctx.beginPath();
      ctx.arc(
        width / 2 + cx,
        height / 2 + cy,
        draggingCircleSize,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "black";
      ctx.fill();
    }
    drawLine();
    drawThumb();
  }

  window.requestAnimationFrame(render);
}
