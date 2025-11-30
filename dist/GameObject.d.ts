import { Rectangle, Vector2D } from './types.js';
export declare abstract class GameObject implements Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    velocity: Vector2D;
    constructor(x: number, y: number, width: number, height: number);
    intersects(other: Rectangle): boolean;
    get centerX(): number;
    get centerY(): number;
    abstract draw(ctx: CanvasRenderingContext2D, cameraX: number): void;
    abstract update(deltaTime: number): void;
}
