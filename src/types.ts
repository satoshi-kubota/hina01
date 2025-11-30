// ゲーム内で使用する型定義

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

export const DEFAULT_CONFIG: GameConfig = {
    canvasWidth: 800,
    canvasHeight: 600,
    gravity: 0.5,
    friction: 0.85
};
