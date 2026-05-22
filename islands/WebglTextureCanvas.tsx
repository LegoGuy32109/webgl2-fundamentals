function drawCanvas(time?: number) {
  const document = globalThis.document;
  if (!document) return;

  const canvas = globalThis.document.querySelector("canvas");
  if (!canvas) return;

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const gl = canvas.getContext("webgl2", {
    antialias: false,
    preserveDrawingBuffer: false,
  });
  if (!gl) return;

  updateGl(gl, time ?? 100);
}

function updateGl(
  gl: WebGL2RenderingContext,
  time: number,
) {
  gl.clearColor(1.0, .5, 0.0, 1.0);
  requestAnimationFrame(drawCanvas);
}

export default function WebglTextureCanvas() {
  setTimeout(drawCanvas, 1);

  // 500px square canvas
  return <canvas class="size-200 border mx-auto" />;
}
