import { Platform } from './Platform.js';
import { Enemy } from './Enemy.js';
import { GameConfig } from './types.js';
export declare class Stage {
    platforms: Platform[];
    enemies: Enemy[];
    private config;
    private stageWidth;
    private goalX;
    constructor(config: GameConfig);
    private createStage;
    update(deltaTime: number): void;
    draw(ctx: CanvasRenderingContext2D, cameraX: number): void;
    private drawBackground;
    private drawGoal;
    getStageWidth(): number;
    getGoalX(): number;
    reset(): void;
}
