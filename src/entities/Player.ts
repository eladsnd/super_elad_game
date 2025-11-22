import { Entity } from './Entity';
import { Input } from '../core/Input';

export class Player extends Entity {
    private input: Input;
    private speed: number = 300;
    private jumpForce: number = -700;

    constructor(x: number, y: number, input: Input) {
        super(x, y, 32, 32); // 32x32 pixel player
        this.input = input;
        this.color = '#ff0000'; // Red like Mario
    }

    public update(dt: number): void {
        this.vx = 0;

        if (this.input.isDown('ArrowLeft') || this.input.isDown('KeyA')) {
            this.vx = -this.speed;
        }
        if (this.input.isDown('ArrowRight') || this.input.isDown('KeyD')) {
            this.vx = this.speed;
        }

        if ((this.input.isDown('ArrowUp') || this.input.isDown('KeyW') || this.input.isDown('Space')) && this.isGrounded) {
            this.vy = this.jumpForce;
            this.isGrounded = false;
        }
    }
}
