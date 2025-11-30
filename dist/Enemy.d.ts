import { GameObject } from './GameObject.js';
export type EnemyType = 'slime' | 'spike' | 'bird';
export declare class Enemy extends GameObject {
    private type;
    private isAlive;
    private moveDirection;
    private moveSpeed;
    private patrolRange;
    private startX;
    private animationTimer;
    private squishAmount;
    private static images;
    constructor(x: number, y: number, type?: EnemyType);
    static setImage(type: EnemyType, rightImagePath: string, leftImagePath?: string): Promise<void>;
    static clearImage(type: EnemyType): void;
    static clearAllImages(): void;
    update(deltaTime: number): void;
    stomp(): number;
    canBeStopped(): boolean;
    getIsAlive(): boolean;
    shouldRemove(): boolean;
    draw(ctx: CanvasRenderingContext2D, cameraX: number): void;
    private drawSlime;
    private drawSpike;
    private drawBird;
    private drawWithImage;
}
