import { Input } from './Input';
import { Physics } from './Physics';
import { Renderer } from './Renderer';
import { Entity } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Level } from './Level';
import { InfoBlock } from '../entities/InfoBlock';
import { Token } from '../entities/Token';
import { ResourceManager } from './ResourceManager';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private lastTime: number = 0;
    private accumulator: number = 0;
    private readonly step: number = 1 / 60;

    private input: Input;
    private physics: Physics;
    private renderer: Renderer;
    private entities: Entity[] = [];
    private player!: Player;
    private level!: Level;
    private cameraX: number = 0;
    private uiLayer: HTMLElement;

    private score: number = 0;
    private isPaused: boolean = false;
    private resourceManager: ResourceManager;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.uiLayer = document.getElementById('ui-layer')!;

        this.input = new Input();
        this.physics = new Physics();
        this.resourceManager = new ResourceManager(() => {
            // This callback runs AFTER all assets are loaded
            this.initializeGame();
        });

        this.resize();
        this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height);

        window.addEventListener('resize', () => {
            this.resize();
            this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height);
        });

        // Load assets (async)
        this.resourceManager.load({
            player: '/assets/player.png',
            ground: '/assets/ground.png',
            token: '/assets/token.png',
            info: '/assets/info.png',
            bug: '/assets/bug.png',
            background: '/assets/background.png'
        });
    }

    private initializeGame(): void {
        // Init Level
        this.level = new Level(this.resourceManager);
        this.entities = this.level.entities;

        // Add some platforms
        const ground = new Entity(0, 550, 800, 50);
        ground.isStatic = true;
        ground.color = '#6b8cff';
        ground.sprite = this.resourceManager.get('ground');
        this.entities.push(ground);

        // Init Player (Add last to render on top)
        this.player = new Player(100, 100, this.input);
        this.player.sprite = this.resourceManager.get('player');
        this.entities.push(this.player);

        // Start the game NOW that assets are loaded
        this.start();
    }

    private resize(): void {
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    public start(): void {
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    private loop(time: number): void {
        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        if (!this.isPaused) {
            this.accumulator += deltaTime;

            while (this.accumulator >= this.step) {
                this.update(this.step);
                this.accumulator -= this.step;
            }
        } else {
            // Check for unpause
            if (this.input.isDown('Escape') || this.input.isDown('Enter')) {
                this.isPaused = false;
                this.updateUI(null);
            }
        }

        this.render();
        requestAnimationFrame((time) => this.loop(time));
    }

    private update(dt: number): void {
        this.player.update(dt);
        this.physics.update(this.entities, dt);

        // Camera follow player
        this.cameraX = this.player.x - this.canvas.width / 2;
        if (this.cameraX < 0) this.cameraX = 0;
        if (this.cameraX > this.level.width - this.canvas.width) this.cameraX = this.level.width - this.canvas.width;

        // Check interactions
        this.checkInteractions();
    }

    private lastTriggerTime: number = 0;
    private readonly triggerCooldown: number = 2000; // 2 seconds

    private checkInteractions(): void {
        const now = performance.now();

        for (const entity of this.entities) {
            if (entity === this.player) continue;

            if (this.physics.checkCollision(this.player, entity)) {
                if (entity instanceof Token) {
                    if (!entity.isCollected) {
                        entity.isCollected = true;
                        this.score += 100;
                        // Play sound?
                    }
                } else if (entity instanceof InfoBlock) {
                    if (!entity.triggered && (now - this.lastTriggerTime > this.triggerCooldown)) {
                        this.isPaused = true;
                        this.updateUI(entity);
                        this.lastTriggerTime = now;
                        // Prevent re-triggering immediately if we want
                        // entity.triggered = true; 
                    }
                }
            }
        }

        // Update UI for Score if not paused by info block
        if (!this.isPaused) {
            this.updateUI(null);
        }
    }

    private updateUI(infoBlock: InfoBlock | null): void {
        let html = `<div style="position: absolute; top: 10px; left: 10px; color: white; font-family: sans-serif; font-size: 20px;">Score: ${this.score}</div>`;

        if (infoBlock) {
            html += `
        <div style="
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.9);
          color: white;
          padding: 20px;
          border-radius: 10px;
          border: 2px solid #00ff00;
          max-width: 600px;
          font-family: 'Courier New', monospace;
        ">
          <h2 style="margin-top: 0; color: #00ff00;">${infoBlock.title}</h2>
          <p>${infoBlock.content}</p>
          <div style="margin-top: 20px; font-size: 12px; color: #aaa;">Press ENTER to continue...</div>
        </div>
      `;
        }

        this.uiLayer.innerHTML = html;
    }

    private render(): void {
        this.renderer.clear();
        this.renderer.render(this.entities, this.cameraX);
    }
}
