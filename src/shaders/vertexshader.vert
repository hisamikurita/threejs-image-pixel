attribute vec3 position;
attribute vec3 color_1;
attribute vec3 color_2;
attribute vec3 color_3;
attribute vec3 color_4;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 noise;
uniform float distortionLevel;
uniform float distortionRange;
varying vec3 v_color_1;
varying vec3 v_color_2;
varying vec3 v_color_3;
varying vec3 v_color_4;

void main() {
    v_color_1 = color_1;
    v_color_2 = color_2;
    v_color_3 = color_3;
    v_color_4 = color_4;
    float noiseX = position.x * noise.x;
    float noiseY = position.y * noise.y;
    float noiseZ = position.z * noise.z;
    vec3 distortionPosition = vec3(noiseX, noiseY, noiseZ) * distortionLevel * distortionRange;
    vec3 resultPosition = position + distortionPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(resultPosition, 1.0 );
    gl_PointSize = 2.0;
}