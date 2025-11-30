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
    constructor(x: number, y: number, type?: EnemyType);
    update(deltaTime: number): void;
    stomp(): number;
    canBeStopped(): boolean;
    getIsAlive(): boolean;
    shouldRemove(): boolean;
    draw(ctx: CanvasRenderingContext2D, cameraX: number): void;
    private drawSlime;
    private drawSpike;
    private drawBird;
}
