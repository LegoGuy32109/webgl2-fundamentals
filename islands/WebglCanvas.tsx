import { getRandomLch, oklchToRgb } from "@/color.ts";
import basicFrag from "../shaders/basic.frag?raw";
import basicVert from "../shaders/basic.vert?raw";
import { m3 } from "@/matrix.ts";
import { easeInOutElastic } from "../animations.ts";

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

function _randInt(arg1: number, arg2?: number): number {
  return Math.ceil(rand(arg1, arg2) - (arg2 ? 0.5 : 0));
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

function _setRectangle(
  gl: WebGL2RenderingContext,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x1,
      y1,
      x2,
      y1,
      x1,
      y2,
      x1,
      y2,
      x2,
      y1,
      x2,
      y2,
    ]),
    gl.STATIC_DRAW,
  );
}

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

  if (!canvas.onmousemove) {
    canvas.onmousemove = ({ clientX, clientY, target }) => {
      const { offsetLeft, offsetTop } = target as HTMLCanvasElement ?? {};
      globalThis.__animation = {
        x: clientX - offsetLeft,
        y: clientY - offsetTop,
      };
    };
  }
  if (!canvas.onmouseleave) {
    canvas.onmouseleave = () => {
      globalThis.__animation = {};
    };
  }
  updateGl(gl, time ?? 100);
}

function updateGl(
  gl: WebGL2RenderingContext,
  time: number,
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, basicVert);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, basicFrag);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution",
  );

  const matrixLocation = gl.getUniformLocation(program, "u_matrix");

  const colorLocation = gl.getUniformLocation(program, "u_color");

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // left column
    0,
    0,
    30,
    0,
    0,
    150,
    0,
    150,
    30,
    0,
    30,
    150,
    // top rung
    30,
    0,
    100,
    0,
    30,
    30,
    30,
    30,
    100,
    0,
    100,
    30,
    //middle rung
    30,
    60,
    67,
    60,
    30,
    90,
    30,
    90,
    67,
    60,
    67,
    90,
  ];
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

  gl.useProgram(program);
  gl.bindVertexArray(vertexArrayObject);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  const info = globalThis.__animation;
  const { width, height } = gl.canvas;
  const x = info?.x ?? width / 2;
  const y = info?.y ?? height / 2;

  const something = Math.sin(time / 1000);
  const ease = easeInOutElastic(something);
  // console.log("Value:", something, "Ease:", ease);
  const rot = -2 * Math.PI * (time * .0005);

  let rotationMatrix = [];
  if (info?.x) {
    // not correct calculations to map desired angle of F bottom
    const xCoord = x - (width / 2);
    const yCoord = y - (height / 2);
    const angleToMouse = Math.atan2(xCoord, yCoord);
    rotationMatrix = m3.rotation(angleToMouse);
  } else {
    rotationMatrix = m3.rotation(rot);
  }

  const translationMatrix = m3.translation(width / 2, height / 2);
  const scaleMatrix = m3.scaling(1.8, 1.8);
  let matrix = m3.multiply(translationMatrix, rotationMatrix);
  matrix = m3.multiply(matrix, scaleMatrix);
  gl.uniformMatrix3fv(matrixLocation, false, matrix);

  const randomDeg = new Date().getTime() * Math.PI / 720;
  const stuff = getRandomLch(randomDeg);
  const [R, G, B] = oklchToRgb(stuff.hue, 1.0, .6);

  gl.uniform4f(colorLocation, R, G, B, .9);

  const primitiveType = gl.TRIANGLES;
  const draw_offset = 0;
  const count = 18;
  gl.drawArrays(primitiveType, draw_offset, count);

  requestAnimationFrame(drawCanvas);
}

export default function WebglCanvas() {
  setTimeout(drawCanvas, 1);

  // 500px square canvas
  return <canvas class="size-200 border mx-auto" />;
}
