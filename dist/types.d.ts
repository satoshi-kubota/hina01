export interface Vector2D {
    x: number;
    y: number;
}
export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface GameConfig {
    canvasWidth: number;
    canvasHeight: number;
    gravity: number;
    friction: number;
}
export interface InputState {
    left: boolean;
    right: boolean;
    jump: boolean;
}
export interface GameState {
    score: number;
    lives: number;
    isRunning: boolean;
    isGameOver: boolean;
}
export declare const DEFAULT_CONFIG: GameConfig;
