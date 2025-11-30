import { Platform } from './Platform.js';
import { Enemy } from './Enemy.js';
export class Stage {
    constructor(config) {
        this.platforms = [];
        this.enemies = [];
        this.config = config;
        this.stageWidth = 4000;
        this.goalX = this.stageWidth - 100;
        this.createStage();
    }
    createStage() {
        // プラットフォームデータ
        const platformData = [
            // 地面
            { x: 0, y: 550, width: 500, height: 50, type: 'ground' },
            { x: 600, y: 550, width: 400, height: 50, type: 'ground' },
            { x: 1100, y: 550, width: 300, height: 50, type: 'ground' },
            { x: 1500, y: 550, width: 600, height: 50, type: 'ground' },
            { x: 2200, y: 550, width: 400, height: 50, type: 'ground' },
            { x: 2700, y: 550, width: 500, height: 50, type: 'ground' },
            { x: 3300, y: 550, width: 700, height: 50, type: 'ground' },
            // 浮遊プラットフォーム - 序盤
            { x: 200, y: 420, width: 150, height: 30, type: 'grass' },
            { x: 450, y: 350, width: 100, height: 30, type: 'wood' },
            { x: 700, y: 400, width: 120, height: 30, type: 'grass' },
            // 浮遊プラットフォーム - 中盤
            { x: 1000, y: 380, width: 100, height: 30, type: 'stone' },
            { x: 1150, y: 300, width: 80, height: 30, type: 'wood' },
            { x: 1300, y: 380, width: 100, height: 30, type: 'stone' },
            { x: 1600, y: 420, width: 150, height: 30, type: 'grass' },
            { x: 1850, y: 350, width: 120, height: 30, type: 'wood' },
            // 浮遊プラットフォーム - 終盤
            { x: 2100, y: 400, width: 100, height: 30, type: 'stone' },
            { x: 2300, y: 320, width: 80, height: 30, type: 'wood' },
            { x: 2500, y: 400, width: 120, height: 30, type: 'grass' },
            { x: 2800, y: 350, width: 150, height: 30, type: 'stone' },
            { x: 3050, y: 280, width: 100, height: 30, type: 'wood' },
            { x: 3250, y: 350, width: 120, height: 30, type: 'grass' },
            { x: 3500, y: 400, width: 200, height: 30, type: 'stone' },
        ];
        // 敵データ
        const enemyData = [
            // 序盤の敵
            { x: 300, y: 520, type: 'slime' },
            { x: 800, y: 520, type: 'slime' },
            { x: 550, y: 300, type: 'bird' },
            // 中盤の敵
            { x: 1200, y: 520, type: 'slime' },
            { x: 1400, y: 510, type: 'spike' },
            { x: 1700, y: 520, type: 'slime' },
            { x: 1600, y: 280, type: 'bird' },
            { x: 1900, y: 520, type: 'slime' },
            // 終盤の敵（難易度アップ）
            { x: 2300, y: 520, type: 'slime' },
            { x: 2400, y: 510, type: 'spike' },
            { x: 2500, y: 510, type: 'spike' },
            { x: 2600, y: 260, type: 'bird' },
            { x: 2900, y: 520, type: 'slime' },
            { x: 3100, y: 520, type: 'slime' },
            { x: 3200, y: 510, type: 'spike' },
            { x: 3400, y: 520, type: 'slime' },
            { x: 3500, y: 280, type: 'bird' },
            { x: 3600, y: 520, type: 'slime' },
        ];
        // プラットフォーム生成
        for (const data of platformData) {
            this.platforms.push(new Platform(data.x, data.y, data.width, data.height, data.type || 'ground'));
        }
        // 敵生成
        for (const data of enemyData) {
            this.enemies.push(new Enemy(data.x, data.y, data.type || 'slime'));
        }
    }
    update(deltaTime) {
        // 敵を更新
        for (const enemy of this.enemies) {
            enemy.update(deltaTime);
        }
        // 消滅した敵を削除
        this.enemies = this.enemies.filter(enemy => !enemy.shouldRemove());
    }
    draw(ctx, cameraX) {
        // 背景の装飾（山、雲）
        this.drawBackground(ctx, cameraX);
        // プラットフォーム描画
        for (const platform of this.platforms) {
            platform.draw(ctx, cameraX);
        }
        // 敵描画
        for (const enemy of this.enemies) {
            enemy.draw(ctx, cameraX);
        }
        // ゴールフラグ
        this.drawGoal(ctx, cameraX);
    }
    drawBackground(ctx, cameraX) {
        // 雲（パララックス効果）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const cloudPositions = [100, 400, 800, 1200, 1600, 2000, 2500, 3000, 3500];
        for (const cloudX of cloudPositions) {
            const screenX = cloudX - cameraX * 0.3;
            // 画面外は描画しない
            if (screenX > -100 && screenX < 900) {
                ctx.beginPath();
                ctx.arc(screenX, 80, 30, 0, Math.PI * 2);
                ctx.arc(screenX + 25, 70, 25, 0, Math.PI * 2);
                ctx.arc(screenX + 50, 80, 30, 0, Math.PI * 2);
                ctx.arc(screenX + 25, 90, 20, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // 背景の山（パララックス効果）
        ctx.fillStyle = '#6B8E6B';
        const mountainPositions = [200, 600, 1000, 1500, 2000, 2500, 3000, 3500];
        for (const mtnX of mountainPositions) {
            const screenX = mtnX - cameraX * 0.5;
            if (screenX > -200 && screenX < 1000) {
                ctx.beginPath();
                ctx.moveTo(screenX, 550);
                ctx.lineTo(screenX + 100, 350);
                ctx.lineTo(screenX + 200, 550);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
    drawGoal(ctx, cameraX) {
        const screenX = this.goalX - cameraX;
        if (screenX > -50 && screenX < 850) {
            // 旗竿
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(screenX, 400, 10, 150);
            // 旗
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.moveTo(screenX + 10, 400);
            ctx.lineTo(screenX + 80, 430);
            ctx.lineTo(screenX + 10, 460);
            ctx.closePath();
            ctx.fill();
            // 旗のテキスト
            ctx.fillStyle = '#8B0000';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GOAL', screenX + 45, 435);
        }
    }
    getStageWidth() {
        return this.stageWidth;
    }
    getGoalX() {
        return this.goalX;
    }
    reset() {
        this.platforms = [];
        this.enemies = [];
        this.createStage();
    }
}
//# sourceMappingURL=Stage.js.map