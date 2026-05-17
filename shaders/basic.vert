#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
  vec2 scaledPosition = a_position * u_scale;
  vec2 rotatedPosition = vec2(
      scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
      scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
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
