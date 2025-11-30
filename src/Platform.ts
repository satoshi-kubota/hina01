import { GameObject } from './GameObject.js';

export type PlatformType = 'ground' | 'grass' | 'stone' | 'wood';

export class Platform extends GameObject {
    private type: PlatformType;
    private colors: Record<PlatformType, { top: string; body: string; detail: string }> = {
        ground: { top: '#7CBA5F', body: '#8B4513', detail: '#654321' },
        grass: { top: '#90EE90', body: '#228B22', detail: '#006400' },
        stone: { top: '#A0A0A0', body: '#808080', detail: '#606060' },
        wood: { top: '#DEB887', body: '#CD853F', detail: '#8B4513' }
    };

    constructor(x: number, y: number, width: number, height: number, type: PlatformType = 'ground') {
        super(x, y, width, height);
        this.type = type;
    }

    update(_deltaTime: number): void {
        // 静的なプラットフォームは更新不要
    }

    draw(ctx: CanvasRenderingContext2D, cameraX: number): void {
        const screenX = this.x - cameraX;
        const color = this.colors[this.type];

        // 画面外の場合は描画しない
        if (screenX + this.width < 0 || screenX > 800) {
            return;
        }

        // メインボディ
        ctx.fillStyle = color.body;
        ctx.fillRect(screenX, this.y, this.width, this.height);

        // 上面（草や表面）
        ctx.fillStyle = color.top;
        ctx.fillRect(screenX, this.y, this.width, 10);

        // ディテール（模様）
        ctx.fillStyle = color.detail;
        const detailSize = 8;
        for (let dx = 10; dx < this.width - 10; dx += 30) {
            for (let dy = 15; dy < this.height - 10; dy += 20) {
                ctx.fillRect(screenX + dx, this.y + dy, detailSize, detailSize);
            }
        }

        // 枠線
        ctx.strokeStyle = color.detail;
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
    }
}
