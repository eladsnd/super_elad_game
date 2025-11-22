export class Entity {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public vx: number = 0;
    public vy: number = 0;
    public isStatic: boolean = false;
    public isGrounded: boolean = false;
    public color: string = '#fff';
    public sprite: HTMLImageElement | null = null;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public update(dt: number): void { }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
