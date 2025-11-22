import { Entity } from './Entity';

export class Token extends Entity {
    public text: string;
    public isCollected: boolean = false;

    constructor(x: number, y: number, text: string) {
        super(x, y, 30, 30);
        this.text = text;
        this.color = '#ffd700'; // Gold
        this.isStatic = true;
        this.isTrigger = true;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.isCollected) return;

        super.draw(ctx);

        // Draw text above
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x + this.width / 2, this.y - 5);
    }
}
