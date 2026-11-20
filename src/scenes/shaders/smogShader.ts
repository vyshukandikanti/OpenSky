/**
 * GLSL Vertex shader for atmospheric smog particle simulation.
 */
export const SMOG_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * GLSL Fragment shader mapping particulate optical depth and light scattering.
 */
export const SMOG_FRAGMENT_SHADER = `
  uniform float uDensity;
  uniform vec3 uHazeColor;
  varying vec2 vUv;
  void main() {
    float alpha = clamp(uDensity * (1.0 - vUv.y), 0.0, 0.85);
    gl_FragColor = vec4(uHazeColor, alpha);
  }
`;
