import { Entity } from '../entities/Entity';

export class Physics {
    private gravity: number = 1500;

    public update(entities: Entity[], dt: number): void {
        for (const entity of entities) {
            if (entity.isStatic) continue;

            // Apply gravity
            entity.vy += this.gravity * dt;

            // Apply velocity
            entity.x += entity.vx * dt;
            entity.y += entity.vy * dt;

            // Floor collision (temporary)
            if (entity.y + entity.height > 600) {
                entity.y = 600 - entity.height;
                entity.vy = 0;
                entity.isGrounded = true;
            } else {
                entity.isGrounded = false;
            }
        }
    }

    public checkCollision(a: Entity, b: Entity): boolean {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
}
