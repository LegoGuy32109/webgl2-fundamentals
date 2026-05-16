#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

void main() {
  // convert position from pixels to 0 to 1
  vec2 zeroToOne = a_position / u_resolution;
  // 0->1 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;
  // 0->2 -1->+1
  vec2 clipSpace = zeroToTwo - 1.0;
  // make origin top left
  clipSpace *= vec2(1, -1);

  gl_Position = vec4(clipSpace, 0, 1);
}
