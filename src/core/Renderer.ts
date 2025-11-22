import { Entity } from '../entities/Entity';

export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    public clear(): void {
        this.ctx.fillStyle = '#5c94fc'; // Sky blue
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    public render(entities: Entity[], cameraX: number): void {
        this.ctx.save();
        this.ctx.translate(-cameraX, 0);

        for (const entity of entities) {
            // Simple culling
            if (entity.x + entity.width < cameraX || entity.x > cameraX + this.width) {
                continue;
            }

            if (entity.sprite) {
                this.ctx.drawImage(entity.sprite, entity.x, entity.y, entity.width, entity.height);
            } else {
                entity.draw(this.ctx);
            }
        }

        this.ctx.restore();
    }
}
