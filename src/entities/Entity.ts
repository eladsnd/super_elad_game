export class Entity {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public vx: number = 0;
    public vy: number = 0;
    public isStatic: boolean = false;
    public isGrounded: boolean = false;
    public isTrigger: boolean = false;
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
        if (this.sprite) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
