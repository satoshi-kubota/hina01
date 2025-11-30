import { GameObject } from './GameObject.js';

export type EnemyType = 'slime' | 'spike' | 'bird';

// 敵タイプごとの画像設定
interface EnemyImageSet {
    right?: HTMLImageElement;
    left?: HTMLImageElement;
    loaded: boolean;
}

export class Enemy extends GameObject {
    private type: EnemyType;
    private isAlive: boolean = true;
    private moveDirection: number = 1;
    private moveSpeed: number;
    private patrolRange: number;
    private startX: number;
    private animationTimer: number = 0;
    private squishAmount: number = 0;

    // 静的な画像ストレージ（全敵で共有）
    private static images: Record<EnemyType, EnemyImageSet> = {
        slime: { loaded: false },
        spike: { loaded: false },
        bird: { loaded: false }
    };

    constructor(x: number, y: number, type: EnemyType = 'slime') {
        const sizes: Record<EnemyType, { w: number; h: number }> = {
            slime: { w: 60, h: 45 },
            spike: { w: 45, h: 60 },
            bird: { w: 75, h: 45 }
        };
        const size = sizes[type];
        super(x, y, size.w, size.h);
        this.type = type;
        this.startX = x;
        this.moveSpeed = type === 'bird' ? 3 : 1.5;
        this.patrolRange = type === 'bird' ? 200 : 100;
    }

    // 敵タイプごとに画像を設定（静的メソッド）
    static setImage(type: EnemyType, rightImagePath: string, leftImagePath?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let loadedCount = 0;
            const totalImages = leftImagePath ? 2 : 1;

            const onLoad = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    Enemy.images[type].loaded = true;
                    resolve();
                }
            };

            const onError = () => {
                console.warn(`${type}の画像読み込みに失敗しました。デフォルト表示を使用します。`);
                reject(new Error('Image load failed'));
            };

            // 右向き画像
            const rightImg = new Image();
            rightImg.onload = onLoad;
            rightImg.onerror = onError;
            rightImg.src = rightImagePath;
            Enemy.images[type].right = rightImg;

            // 左向き画像
            if (leftImagePath) {
                const leftImg = new Image();
                leftImg.onload = onLoad;
                leftImg.onerror = onError;
                leftImg.src = leftImagePath;
                Enemy.images[type].left = leftImg;
            } else {
                Enemy.images[type].left = rightImg;
            }
        });
    }

    // 画像をクリア
    static clearImage(type: EnemyType): void {
        Enemy.images[type] = { loaded: false };
    }

    // 全画像をクリア
    static clearAllImages(): void {
        Enemy.images = {
            slime: { loaded: false },
            spike: { loaded: false },
            bird: { loaded: false }
        };
    }

    update(deltaTime: number): void {
        if (!this.isAlive) {
            this.squishAmount += deltaTime * 0.01;
            return;
        }

        this.animationTimer += deltaTime;

        // パトロール移動
        this.x += this.moveSpeed * this.moveDirection;

        // 範囲外に出たら方向転換
        if (this.x > this.startX + this.patrolRange) {
            this.moveDirection = -1;
        } else if (this.x < this.startX - this.patrolRange) {
            this.moveDirection = 1;
        }

        // 鳥は上下にも動く
        if (this.type === 'bird') {
            this.y = this.y + Math.sin(this.animationTimer * 0.005) * 0.5;
        }
    }

    // 踏まれた時
    stomp(): number {
        if (!this.isAlive || this.type === 'spike') {
            return 0;
        }
        this.isAlive = false;
        return this.type === 'bird' ? 200 : 100;
    }

    // スパイクは踏んでもダメージ
    canBeStopped(): boolean {
        return this.type !== 'spike';
    }

    getIsAlive(): boolean {
        return this.isAlive;
    }

    shouldRemove(): boolean {
        return !this.isAlive && this.squishAmount > 1;
    }

    draw(ctx: CanvasRenderingContext2D, cameraX: number): void {
        const screenX = this.x - cameraX;

        // 画面外の場合は描画しない
        if (screenX + this.width < -50 || screenX > 850) {
            return;
        }

        if (!this.isAlive) {
            // 潰れるアニメーション
            ctx.save();
            ctx.translate(screenX + this.width / 2, this.y + this.height);
            ctx.scale(1 + this.squishAmount, 1 - this.squishAmount * 0.8);
            ctx.translate(-(screenX + this.width / 2), -(this.y + this.height));
        }

        // 画像があれば画像を描画、なければデフォルト描画
        const imageSet = Enemy.images[this.type];
        if (imageSet.loaded && imageSet.right) {
            this.drawWithImage(ctx, screenX, imageSet);
        } else {
            switch (this.type) {
                case 'slime':
                    this.drawSlime(ctx, screenX);
                    break;
                case 'spike':
                    this.drawSpike(ctx, screenX);
                    break;
                case 'bird':
                    this.drawBird(ctx, screenX);
                    break;
            }
        }

        if (!this.isAlive) {
            ctx.restore();
        }
    }

    private drawSlime(ctx: CanvasRenderingContext2D, screenX: number): void {
        const bounce = Math.sin(this.animationTimer * 0.01) * 3;

        // 本体
        ctx.fillStyle = '#50C878';
        ctx.beginPath();
        ctx.ellipse(
            screenX + this.width / 2,
            this.y + this.height - 5 + bounce,
            this.width / 2,
            this.height / 2 + bounce / 2,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // ハイライト
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.ellipse(
            screenX + this.width / 2 - 5,
            this.y + this.height / 2 - 3 + bounce,
            8, 5, 0, 0, Math.PI * 2
        );
        ctx.fill();

        // 目
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(screenX + 12, this.y + this.height / 2 + bounce, 5, 0, Math.PI * 2);
        ctx.arc(screenX + 28, this.y + this.height / 2 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();

        // 瞳
        ctx.fillStyle = '#333';
        const pupilOffset = this.moveDirection * 2;
        ctx.beginPath();
        ctx.arc(screenX + 12 + pupilOffset, this.y + this.height / 2 + 1 + bounce, 2, 0, Math.PI * 2);
        ctx.arc(screenX + 28 + pupilOffset, this.y + this.height / 2 + 1 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    private drawSpike(ctx: CanvasRenderingContext2D, screenX: number): void {
        // トゲ
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.moveTo(screenX, this.y + this.height);
        ctx.lineTo(screenX + this.width / 2, this.y);
        ctx.lineTo(screenX + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // ハイライト
        ctx.fillStyle = '#CD5C5C';
        ctx.beginPath();
        ctx.moveTo(screenX + 5, this.y + this.height - 5);
        ctx.lineTo(screenX + this.width / 2, this.y + 10);
        ctx.lineTo(screenX + this.width / 2, this.y + this.height - 5);
        ctx.closePath();
        ctx.fill();

        // 警告マーク
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('!', screenX + this.width / 2, this.y + this.height - 10);
    }

    private drawBird(ctx: CanvasRenderingContext2D, screenX: number): void {
        const wingFlap = Math.sin(this.animationTimer * 0.02) * 10;

        // 羽
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.moveTo(screenX + this.width / 2, this.y + this.height / 2);
        ctx.lineTo(screenX + 5, this.y - wingFlap);
        ctx.lineTo(screenX + 15, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(screenX + this.width / 2, this.y + this.height / 2);
        ctx.lineTo(screenX + this.width - 5, this.y - wingFlap);
        ctx.lineTo(screenX + this.width - 15, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();

        // 本体
        ctx.fillStyle = '#6495ED';
        ctx.beginPath();
        ctx.ellipse(
            screenX + this.width / 2,
            this.y + this.height / 2,
            this.width / 3,
            this.height / 3,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // くちばし
        ctx.fillStyle = '#FFA500';
        const beakDir = this.moveDirection;
        ctx.beginPath();
        ctx.moveTo(screenX + this.width / 2 + beakDir * 10, this.y + this.height / 2);
        ctx.lineTo(screenX + this.width / 2 + beakDir * 25, this.y + this.height / 2 + 3);
        ctx.lineTo(screenX + this.width / 2 + beakDir * 10, this.y + this.height / 2 + 6);
        ctx.closePath();
        ctx.fill();

        // 目
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2 + beakDir * 5, this.y + this.height / 2 - 3, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2 + beakDir * 6, this.y + this.height / 2 - 3, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // 画像を使った描画
    private drawWithImage(ctx: CanvasRenderingContext2D, screenX: number, imageSet: EnemyImageSet): void {
        const facingRight = this.moveDirection > 0;
        const image = facingRight ? imageSet.right : imageSet.left;

        if (image) {
            // 左向き画像がなく、右向き画像を反転する場合
            if (!facingRight && imageSet.left === imageSet.right) {
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
}
