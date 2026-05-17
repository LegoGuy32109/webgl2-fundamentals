#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;

void main() {
  vec2 rotatedPosition = vec2(
      a_position.x * u_rotation.y + a_position.y * u_rotation.x,
      a_position.y * u_rotation.y - a_position.x * u_rotation.x
    );
  vec2 position = rotatedPosition + u_translation;

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
