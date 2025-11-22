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

            // Check against static entities
            for (const other of entities) {
                if (entity === other) continue;
                if (other.isStatic) {
                    this.resolveCollision(entity, other);
                }
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

    public resolveCollision(dynamicEntity: Entity, staticEntity: Entity): void {
        if (!this.checkCollision(dynamicEntity, staticEntity)) return;

        // Calculate overlap
        const dx = (dynamicEntity.x + dynamicEntity.width / 2) - (staticEntity.x + staticEntity.width / 2);
        const dy = (dynamicEntity.y + dynamicEntity.height / 2) - (staticEntity.y + staticEntity.height / 2);
        const width = (dynamicEntity.width + staticEntity.width) / 2;
        const height = (dynamicEntity.height + staticEntity.height) / 2;
        const crossWidth = width * dy;
        const crossHeight = height * dx;

        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
            if (crossWidth > crossHeight) {
                if (crossWidth > -crossHeight) {
                    // Bottom collision
                    dynamicEntity.y = staticEntity.y + staticEntity.height;
                    dynamicEntity.vy = 0;
                } else {
                    // Left collision
                    dynamicEntity.x = staticEntity.x - dynamicEntity.width;
                    dynamicEntity.vx = 0;
                }
            } else {
                if (crossWidth > -crossHeight) {
                    // Right collision
                    dynamicEntity.x = staticEntity.x + staticEntity.width;
                    dynamicEntity.vx = 0;
                } else {
                    // Top collision
                    dynamicEntity.y = staticEntity.y - dynamicEntity.height;
                    dynamicEntity.vy = 0;
                    dynamicEntity.isGrounded = true;
                }
            }
        }
    }
}
