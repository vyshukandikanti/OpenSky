/**
 * Three.js / WebGL 3D scene camera, lighting, and rendering configuration constants.
 * Source: OpenSky 3D Visual Rendering Standards.
 */
export const SCENE_CONFIG = {
  // Camera field of view angle (degrees)
  CAMERA_FOV_DEG: 45,
  // Camera near clipping plane distance (world units)
  CAMERA_NEAR_CLIP: 0.1,
  // Camera far clipping plane distance (world units)
  CAMERA_FAR_CLIP: 1000.0,
  // Default camera position vector coordinates [x, y, z] (world units)
  DEFAULT_CAMERA_POS: [0, 5, 12] as const,
  // Smog particle fog density multiplier (unitless scale 0-1)
  MAX_FOG_DENSITY: 0.08,
} as const;
