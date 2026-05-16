// import largePointsFrag from "../shaders/largePoints.frag?raw";
// import largPointsVert from "../shaders/largePoints.vert?raw";
import basicFrag from "../shaders/basic.frag?raw";
import basicVert from "../shaders/basic.vert?raw";

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

function createShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  shaderText: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw Error(`no shader with this type ${type}`);
  gl.shaderSource(shader, shaderText);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const error = Error(
      gl.getShaderInfoLog(shader) ?? `Error compiling shader: ${shaderText}`,
    );
    gl.deleteShader(shader);
    throw error;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const error = Error(
      gl.getProgramInfoLog(program) ?? "Error starting program",
    );
    gl.deleteProgram(program);
    throw error;
  }

  return program;
}

function updateGl(gl: WebGL2RenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, basicVert);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, basicFrag);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution",
  );

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const vertexArrayObject = gl.createVertexArray();
  gl.bindVertexArray(vertexArrayObject);

  gl.enableVertexAttribArray(positionAttributeLocation);

  const size = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindVertexArray(vertexArrayObject);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  const primitiveType = gl.TRIANGLES;
  const draw_offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, draw_offset, count);
}

export default function WebglCanvas() {
  setTimeout(drawCanvas, 1);

  // 500px square canvas
  return <canvas class="size-125 border mx-auto" />;
}
