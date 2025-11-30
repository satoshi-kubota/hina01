import { GameObject } from './GameObject.js';
export class Enemy extends GameObject {
    constructor(x, y, type = 'slime') {
        const sizes = {
            slime: { w: 40, h: 30 },
            spike: { w: 30, h: 40 },
            bird: { w: 50, h: 30 }
        };
        const size = sizes[type];
        super(x, y, size.w, size.h);
        this.isAlive = true;
        this.moveDirection = 1;
        this.animationTimer = 0;
        this.squishAmount = 0;
        this.type = type;
        this.startX = x;
        this.moveSpeed = type === 'bird' ? 3 : 1.5;
        this.patrolRange = type === 'bird' ? 200 : 100;
    }
    update(deltaTime) {
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
        }
        else if (this.x < this.startX - this.patrolRange) {
            this.moveDirection = 1;
        }
        // 鳥は上下にも動く
        if (this.type === 'bird') {
            this.y = this.y + Math.sin(this.animationTimer * 0.005) * 0.5;
        }
    }
    // 踏まれた時
    stomp() {
        if (!this.isAlive || this.type === 'spike') {
            return 0;
        }
        this.isAlive = false;
        return this.type === 'bird' ? 200 : 100;
    }
    // スパイクは踏んでもダメージ
    canBeStopped() {
        return this.type !== 'spike';
    }
    getIsAlive() {
        return this.isAlive;
    }
    shouldRemove() {
        return !this.isAlive && this.squishAmount > 1;
    }
    draw(ctx, cameraX) {
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
        if (!this.isAlive) {
            ctx.restore();
        }
    }
    drawSlime(ctx, screenX) {
        const bounce = Math.sin(this.animationTimer * 0.01) * 3;
        // 本体
        ctx.fillStyle = '#50C878';
        ctx.beginPath();
        ctx.ellipse(screenX + this.width / 2, this.y + this.height - 5 + bounce, this.width / 2, this.height / 2 + bounce / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // ハイライト
        ctx.fillStyle = '#90EE90';
        ctx.beginPath();
        ctx.ellipse(screenX + this.width / 2 - 5, this.y + this.height / 2 - 3 + bounce, 8, 5, 0, 0, Math.PI * 2);
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
    drawSpike(ctx, screenX) {
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
    drawBird(ctx, screenX) {
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
        ctx.ellipse(screenX + this.width / 2, this.y + this.height / 2, this.width / 3, this.height / 3, 0, 0, Math.PI * 2);
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
}
//# sourceMappingURL=Enemy.js.map