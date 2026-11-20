import { CAMERA_CONFIG } from './constants/cameraConfig.js';
import { SMOG_VERTEX_SHADER, SMOG_FRAGMENT_SHADER } from './shaders/smogShader.js';

export interface SceneContext {
  readonly canvasId: string;
  readonly aqi: number;
}

/**
 * 3D Skyline scene controller with adaptive smog rendering.
 */
export class SkylineScene {
  private readonly canvasId: string;
  private isRendering = false;

  public constructor(context: SceneContext) {
    this.canvasId = context.canvasId;
  }

  public init(): void {
    const canvas = document.getElementById(this.canvasId);
    if (!canvas) {
      return;
    }
    this.isRendering = true;
  }

  public getShaderConfig(): { readonly vs: string; readonly fs: string; readonly fov: number } {
    return {
      vs: SMOG_VERTEX_SHADER,
      fs: SMOG_FRAGMENT_SHADER,
      fov: CAMERA_CONFIG.fov,
    };
  }

  public isActive(): boolean {
    return this.isRendering;
  }

  public dispose(): void {
    this.isRendering = false;
  }
}
