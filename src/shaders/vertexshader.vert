attribute vec3 position;
attribute vec3 nextPosition;
attribute vec3 color;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float nextPositionLevel;
varying vec3 v_color;

void main() {
    v_color = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + nextPosition * nextPositionLevel, 1.0 );
    gl_PointSize = 5.0;
}