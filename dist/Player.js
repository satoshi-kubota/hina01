import { GameObject } from './GameObject.js';
export class Player extends GameObject {
    constructor(x, y, config) {
        super(x, y, 40, 50);
        this.isGrounded = false;
        this.jumpForce = -12;
        this.moveSpeed = 5;
        this.maxSpeed = 8;
        this.color = '#FF6B6B';
        this.eyeOffset = 0;
        this.isInvincible = false;
        this.invincibleTimer = 0;
        this.blinkTimer = 0;
        this.config = config;
    }
    update(deltaTime) {
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
    handleInput(input) {
        if (input.left) {
            this.velocity.x -= this.moveSpeed;
            this.eyeOffset = -5;
        }
        if (input.right) {
            this.velocity.x += this.moveSpeed;
            this.eyeOffset = 5;
        }
        // 速度制限
        this.velocity.x = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velocity.x));
        // ジャンプ
        if (input.jump && this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
        }
    }
    setGrounded(grounded) {
        this.isGrounded = grounded;
    }
    getIsGrounded() {
        return this.isGrounded;
    }
    // 敵に当たった時
    hit() {
        if (this.isInvincible) {
            return false;
        }
        this.isInvincible = true;
        this.invincibleTimer = 2000; // 2秒間無敵
        return true;
    }
    getIsInvincible() {
        return this.isInvincible;
    }
    // 敵を踏んだ時のバウンス
    bounce() {
        this.velocity.y = this.jumpForce * 0.7;
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = { x: 0, y: 0 };
        this.isGrounded = false;
        this.isInvincible = false;
        this.invincibleTimer = 0;
    }
    draw(ctx, cameraX) {
        const screenX = this.x - cameraX;
        // 無敵時間中は点滅
        if (this.isInvincible && Math.floor(this.blinkTimer / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
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
        ctx.globalAlpha = 1;
    }
}
//# sourceMappingURL=Player.js.map