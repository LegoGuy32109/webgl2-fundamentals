#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  // convert position from pixels to 0 to 1
  vec2 zeroToOne = position / u_resolution;
  // 0->1 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;
  // 0->2 -1->+1
  vec2 clipSpace = zeroToTwo - 1.0;
  // make origin top left
  clipSpace *= vec2(1, -1);

  gl_PointSize = 4.0;
  gl_Position = vec4(clipSpace, 0, 1);
}
