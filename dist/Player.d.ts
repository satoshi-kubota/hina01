import { GameObject } from './GameObject.js';
import { InputState, GameConfig } from './types.js';
export declare class Player extends GameObject {
    private config;
    private isGrounded;
    private jumpForce;
    private moveSpeed;
    private maxSpeed;
    private color;
    private eyeOffset;
    private isInvincible;
    private invincibleTimer;
    private blinkTimer;
    constructor(x: number, y: number, config: GameConfig);
    update(deltaTime: number): void;
    handleInput(input: InputState): void;
    setGrounded(grounded: boolean): void;
    getIsGrounded(): boolean;
    hit(): boolean;
    getIsInvincible(): boolean;
    bounce(): void;
    reset(x: number, y: number): void;
    draw(ctx: CanvasRenderingContext2D, cameraX: number): void;
}
