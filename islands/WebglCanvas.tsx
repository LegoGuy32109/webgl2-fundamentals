import largePointsFrag from "../shaders/largePoints.frag?raw";
import largPointsVert from "../shaders/largePoints.vert?raw";

function drawRectangle(
  gl: WebGL2RenderingContext,
  x: GLint,
  y: GLint,
  width: GLsizei,
  height: GLsizei,
  color: [GLclampf, GLclampf, GLclampf, GLclampf],
) {
  gl.scissor(x, y, width, height);
  gl.clearColor(...color);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function rand(arg1: number, arg2?: number): number {
  const between0and1 = Math.random();
  if (arg2) {
    return ((arg2 - arg1) * between0and1) + arg1;
  }
  return between0and1 * arg1;
}

function drawCanvas() {
  const document = globalThis.document;
  if (!document) return;

  const canvas = globalThis.document.querySelector("canvas");
  if (!canvas) return;

  const gl = canvas.getContext("webgl2");
  if (!gl) return;

  updateGl(gl);
}

function _makeManyRectangles(gl: WebGL2RenderingContext) {
  gl.enable(gl.SCISSOR_TEST);

  for (let i = 0; i < 10000; ++i) {
    const x = rand(0, 300);
    const y = rand(0, 150);

    const width = rand(0, 300 - x);
    const height = rand(0, 150 - y);
    drawRectangle(gl, x, y, width, height, [rand(1), rand(1), rand(1), 1]);
  }
}

// function createProgram

function updateGl(gl: WebGL2RenderingContext) {
  // const program = web
  _makeManyRectangles(gl);
}

globalThis.__helpers = {
  drawCanvas,
};

export default function WebglCanvas() {
  setTimeout(drawCanvas, 1);

  return <canvas class="size-125 border mx-auto" />;
}
