import { GameObject } from './GameObject.js';
import { InputState, GameConfig } from './types.js';

export class Player extends GameObject {
    private config: GameConfig;
    private isGrounded: boolean = false;
    private jumpForce: number = -12;
    private moveSpeed: number = 3;
    private maxSpeed: number = 5;
    private color: string = '#FF6B6B';
    private eyeOffset: number = 0;
    private isInvincible: boolean = false;
    private invincibleTimer: number = 0;
    private blinkTimer: number = 0;
    private facingRight: boolean = true;

    // 画像関連
    private imageRight: HTMLImageElement | null = null;
    private imageLeft: HTMLImageElement | null = null;
    private imageLoaded: boolean = false;

    constructor(x: number, y: number, config: GameConfig) {
        super(x, y, 60, 75);
        this.config = config;
    }

    // 画像を設定するメソッド
    setImages(rightImagePath: string, leftImagePath?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let loadedCount = 0;
            const totalImages = leftImagePath ? 2 : 1;

            const onLoad = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    this.imageLoaded = true;
                    resolve();
                }
            };

            const onError = () => {
                console.warn('プレイヤー画像の読み込みに失敗しました。デフォルト表示を使用します。');
                reject(new Error('Image load failed'));
            };

            // 右向き画像
            this.imageRight = new Image();
            this.imageRight.onload = onLoad;
            this.imageRight.onerror = onError;
            this.imageRight.src = rightImagePath;

            // 左向き画像（指定がなければ右向きを反転して使用）
            if (leftImagePath) {
                this.imageLeft = new Image();
                this.imageLeft.onload = onLoad;
                this.imageLeft.onerror = onError;
                this.imageLeft.src = leftImagePath;
            } else {
                this.imageLeft = this.imageRight;
                // 左向き画像がない場合は1枚だけでOK
            }
        });
    }

    // 画像をクリアしてデフォルト表示に戻す
    clearImages(): void {
        this.imageRight = null;
        this.imageLeft = null;
        this.imageLoaded = false;
    }

    update(deltaTime: number): void {
        // 重力を適用
        this.velocity.y += this.config.gravity;

        // 速度を位置に適用
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 摩擦を適用
        this.velocity.x *= this.config.friction;

        // 無敵時間の処理
        if (this.isInvincible) {
            this.invincibleTimer -= deltaTime;
            this.blinkTimer += deltaTime;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
                this.invincibleTimer = 0;
            }
        }

        // 画面下に落ちた場合
        if (this.y > this.config.canvasHeight + 100) {
            this.y = this.config.canvasHeight + 100;
        }
    }

    handleInput(input: InputState): void {
        if (input.left) {
            this.velocity.x -= this.moveSpeed;
            this.eyeOffset = -5;
            this.facingRight = false;
        }
        if (input.right) {
            this.velocity.x += this.moveSpeed;
            this.eyeOffset = 5;
            this.facingRight = true;
        }

        // 速度制限
        this.velocity.x = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velocity.x));

        // ジャンプ
        if (input.jump && this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
        }
    }

    setGrounded(grounded: boolean): void {
        this.isGrounded = grounded;
    }

    getIsGrounded(): boolean {
        return this.isGrounded;
    }

    // 敵に当たった時
    hit(): boolean {
        if (this.isInvincible) {
            return false;
        }
        this.isInvincible = true;
        this.invincibleTimer = 2000; // 2秒間無敵
        return true;
    }

    getIsInvincible(): boolean {
        return this.isInvincible;
    }

    // 敵を踏んだ時のバウンス
    bounce(): void {
        this.velocity.y = this.jumpForce * 0.7;
    }

    reset(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.isGrounded = false;
        this.isInvincible = false;
        this.invincibleTimer = 0;
    }

    draw(ctx: CanvasRenderingContext2D, cameraX: number): void {
        const screenX = this.x - cameraX;

        // 無敵時間中は点滅
        if (this.isInvincible && Math.floor(this.blinkTimer / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // 画像が読み込まれている場合は画像を描画
        if (this.imageLoaded && this.imageRight) {
            this.drawWithImage(ctx, screenX);
        } else {
            // 画像がない場合はデフォルトのシェイプ描画
            this.drawDefault(ctx, screenX);
        }

        ctx.globalAlpha = 1;
    }

    // 画像を使った描画
    private drawWithImage(ctx: CanvasRenderingContext2D, screenX: number): void {
        const image = this.facingRight ? this.imageRight : this.imageLeft;

        if (image) {
            // 左向き画像がなく、右向き画像を反転する場合
            if (!this.facingRight && this.imageLeft === this.imageRight) {
                ctx.save();
                ctx.translate(screenX + this.width, this.y);
                ctx.scale(-1, 1);
                ctx.drawImage(image, 0, 0, this.width, this.height);
                ctx.restore();
            } else {
                ctx.drawImage(image, screenX, this.y, this.width, this.height);
            }
        }
    }

    // デフォルトのシェイプ描画
    private drawDefault(ctx: CanvasRenderingContext2D, screenX: number): void {
        // 体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(screenX, this.y, this.width, this.height, 8);
        ctx.fill();

        // 顔
        ctx.fillStyle = '#FFF';
        // 左目
        ctx.beginPath();
        ctx.arc(screenX + 12 + this.eyeOffset, this.y + 15, 6, 0, Math.PI * 2);
        ctx.fill();
        // 右目
        ctx.beginPath();
        ctx.arc(screenX + 28 + this.eyeOffset, this.y + 15, 6, 0, Math.PI * 2);
        ctx.fill();

        // 瞳
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(screenX + 14 + this.eyeOffset, this.y + 16, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + 30 + this.eyeOffset, this.y + 16, 3, 0, Math.PI * 2);
        ctx.fill();

        // 口
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2, this.y + 32, 8, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
    }
}
