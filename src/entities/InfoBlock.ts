import { Entity } from './Entity';

export class InfoBlock extends Entity {
    public title: string;
    public content: string;
    public triggered: boolean = false;

    constructor(x: number, y: number, title: string, content: string) {
        super(x, y, 40, 40);
        this.title = title;
        this.content = content;
        this.color = '#00ff00'; // Green
        this.isStatic = true;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', this.x + this.width / 2, this.y + 25);
    }
}
