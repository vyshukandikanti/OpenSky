import { CAMERA_CONFIG } from './constants/cameraConfig.js';

export interface CutawayContext {
  readonly canvasId: string;
  readonly purifierActive: boolean;
}

/**
 * 3D Cutaway house architectural airflow visualization.
 */
export class CutawayScene {
  private readonly canvasId: string;
  private isAirflowSimActive = false;

  public constructor(context: CutawayContext) {
    this.canvasId = context.canvasId;
  }

  public init(): void {
    const canvas = document.getElementById(this.canvasId);
    if (!canvas) {
      return;
    }
    this.isAirflowSimActive = true;
  }

  public getCameraPosition(): readonly [number, number, number] {
    return CAMERA_CONFIG.initialPosition;
  }

  public isActive(): boolean {
    return this.isAirflowSimActive;
  }

  public dispose(): void {
    this.isAirflowSimActive = false;
  }
}
