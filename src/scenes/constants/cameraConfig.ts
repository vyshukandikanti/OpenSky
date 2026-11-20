import { SCENE_CONFIG } from '../../config/sceneConstants.js';

export const CAMERA_CONFIG = {
  fov: SCENE_CONFIG.CAMERA_FOV_DEG,
  near: SCENE_CONFIG.CAMERA_NEAR_CLIP,
  far: SCENE_CONFIG.CAMERA_FAR_CLIP,
  initialPosition: SCENE_CONFIG.DEFAULT_CAMERA_POS,
} as const;
