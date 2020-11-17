const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const degree2Radian = (degrees) => degrees * (Math.PI / 180);

let width, height, mouseX, mouseY, centerX, centerY;

// NOTE: Set gradient color for stroke
let gradient = ctx.createLinearGradient(250, 0, 0, 500);
gradient.addColorStop(1, "#DCF3BB");
gradient.addColorStop(0, "#758E50");

// NOTE: Size for circle slider
const circleSize = 300;
// NOTE: slider width
const thickness = 5;
// NOTE: Circle size on Slider
const draggingCircleSize = 50;

window.addEventListener("load", (_) => {
  canvas.width = 1000;
  canvas.height = 1000;

  width = canvas.width;
  height = canvas.height;
  centerX = width / 2 / 2;
  centerY = height / 2 / 2;

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

  // NOTE: Calculate the angle made by mouse position and center position.
  const theta = Math.atan2(mouseY - centerY, mouseX - centerX);

  for (let i = 0; i < 360; i += step) {
    const x = Math.cos(degree2Radian(i)) * circleSize;
    const y = Math.sin(degree2Radian(i)) * circleSize;

    // NOTE: Draw debug circles
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.setLineDash([5, 15]);
    ctx.arc(width / 2, height / 2, circleSize, 0, 360);
    //    ctx.arc(width / 2 + x, height / 2 + y, 10, 0, 2 * Math.PI);
    ctx.stroke();

    // NOTE: Draw a circle slider
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.arc(width / 2, height / 2, circleSize, degree2Radian(-90), theta);
    ctx.strokeStyle = "black";
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.stroke();

    // NOTE: Draw a circle on the slider
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

  window.requestAnimationFrame(render);
}
