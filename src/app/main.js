const canvas = document.querySelector("#game-canvas");
const context = canvas?.getContext("2d");

if (!canvas || !context) {
  throw new Error("No se pudo inicializar el canvas del juego.");
}

let lastFrameTime = performance.now();

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = Math.floor(window.innerWidth * pixelRatio);
  const height = Math.floor(window.innerHeight * pixelRatio);

  if (canvas.width === width && canvas.height === height) {
    return;
  }

  canvas.width = width;
  canvas.height = height;
}

function clearFrame() {
  context.fillStyle = "#10131a";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTestObject(elapsedSeconds) {
  const pixelRatio = window.devicePixelRatio || 1;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 28 * pixelRatio;
  const pulse = Math.sin(elapsedSeconds * 2) * 4 * pixelRatio;

  context.fillStyle = "#f2c166";
  context.beginPath();
  context.arc(centerX, centerY, radius + pulse, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#fff1c7";
  context.lineWidth = 3 * pixelRatio;
  context.stroke();
}

function frame(currentTime) {
  const deltaSeconds = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;

  resizeCanvas();
  clearFrame();
  drawTestObject(currentTime / 1000, deltaSeconds);

  requestAnimationFrame(frame);
}

resizeCanvas();
requestAnimationFrame(frame);
