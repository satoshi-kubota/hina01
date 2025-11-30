import { Rectangle, Vector2D } from './types.js';

// すべてのゲームオブジェクトの基底クラス
export abstract class GameObject implements Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    velocity: Vector2D;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = { x: 0, y: 0 };
    }

    // 矩形の衝突判定
    intersects(other: Rectangle): boolean {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    // 中心座標を取得
    get centerX(): number {
        return this.x + this.width / 2;
    }

    get centerY(): number {
        return this.y + this.height / 2;
    }

    // 描画（サブクラスで実装）
    abstract draw(ctx: CanvasRenderingContext2D, cameraX: number): void;

    // 更新（サブクラスで実装）
    abstract update(deltaTime: number): void;
}
