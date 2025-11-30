import { GameObject } from './GameObject.js';
export type PlatformType = 'ground' | 'grass' | 'stone' | 'wood';
export declare class Platform extends GameObject {
    private type;
    private colors;
    constructor(x: number, y: number, width: number, height: number, type?: PlatformType);
    update(_deltaTime: number): void;
    draw(ctx: CanvasRenderingContext2D, cameraX: number): void;
}
