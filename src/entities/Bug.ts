import { Entity } from './Entity';

export class Bug extends Entity {
    private startX: number;
    private range: number = 100;
    private speed: number = 100;
    private direction: number = 1;

    constructor(x: number, y: number) {
        super(x, y, 32, 32);
        this.startX = x;
        this.color = '#000'; // Black bug
    }

    public update(dt: number): void {
        this.x += this.speed * this.direction * dt;

        if (this.x > this.startX + this.range) {
            this.direction = -1;
        } else if (this.x < this.startX - this.range) {
            this.direction = 1;
        }
    }
}
