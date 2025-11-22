import { Input } from './Input';
import { Physics } from './Physics';
import { Renderer } from './Renderer';
import { Entity } from '../entities/Entity';
import { Player } from '../entities/Player';
import { Level } from './Level';
import { InfoBlock } from '../entities/InfoBlock';
import { Token } from '../entities/Token';

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
    private player: Player;
    private level: Level;
    private cameraX: number = 0;
    private uiLayer: HTMLElement;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.uiLayer = document.getElementById('ui-layer')!;

        this.input = new Input();
        this.physics = new Physics();

        this.resize();
        this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height);

        window.addEventListener('resize', () => {
            this.resize();
            this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height);
        });

        // Init Level
        this.level = new Level();
        this.entities = this.level.entities;

        // Init Player
        this.player = new Player(100, 100, this.input);
        this.entities.push(this.player);
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

        this.accumulator += deltaTime;

        while (this.accumulator >= this.step) {
            this.update(this.step);
            this.accumulator -= this.step;
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

    private checkInteractions(): void {
        let activeInfo: InfoBlock | null = null;

        for (const entity of this.entities) {
            if (entity === this.player) continue;

            if (this.physics.checkCollision(this.player, entity)) {
                if (entity instanceof Token) {
                    entity.isCollected = true;
                    // Play sound?
                } else if (entity instanceof InfoBlock) {
                    activeInfo = entity;
                }
            }
        }

        this.updateUI(activeInfo);
    }

    private updateUI(infoBlock: InfoBlock | null): void {
        if (infoBlock) {
            this.uiLayer.innerHTML = `
        <div style="
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 20px;
          border-radius: 10px;
          border: 2px solid #fff;
          max-width: 600px;
          font-family: sans-serif;
        ">
          <h2 style="margin-top: 0; color: #00ff00;">${infoBlock.title}</h2>
          <p>${infoBlock.content}</p>
        </div>
      `;
        } else {
            this.uiLayer.innerHTML = '';
        }
    }

    private render(): void {
        this.renderer.clear();
        this.renderer.render(this.entities, this.cameraX);
    }
}
