import { Entity } from '../entities/Entity';
import { Token } from '../entities/Token';
import { InfoBlock } from '../entities/InfoBlock';
import { Bug } from '../entities/Bug';
import cvData from '../data/cv.json';

export class Level {
    public entities: Entity[] = [];
    public width: number = 0;

    constructor() {
        this.generate();
    }

    private generate(): void {
        let x = 0;
        const groundY = 550;

        // 1. Intro Section
        this.addPlatform(x, groundY, 800);
        this.addInfo(x + 200, groundY - 100, "About Me", cvData.summary);
        x += 800;

        // 2. Skills Section
        this.addPlatform(x, groundY, 1000);
        let skillX = x + 100;
        cvData.skills.languages.forEach(skill => {
            this.addToken(skillX, groundY - 150, skill);
            skillX += 150;
        });
        x += 1000;

        // 3. Experience Section
        this.addPlatform(x, groundY, 1500);
        let expX = x + 200;
        cvData.experience.forEach(job => {
            this.addInfo(expX, groundY - 100, job.company, job.description);
            // Add some platforms to jump on
            this.addPlatform(expX + 100, groundY - 150, 100);
            // Add a bug
            this.addBug(expX + 150, groundY - 182);
            expX += 400;
        });
        x += 1500;

        this.width = x;
    }

    private addPlatform(x: number, y: number, w: number): void {
        const platform = new Entity(x, y, w, 50);
        platform.isStatic = true;
        platform.color = '#6b8cff';
        this.entities.push(platform);
    }

    private addToken(x: number, y: number, text: string): void {
        this.entities.push(new Token(x, y, text));
    }

    private addInfo(x: number, y: number, title: string, content: string): void {
        this.entities.push(new InfoBlock(x, y, title, content));
    }

    private addBug(x: number, y: number): void {
        this.entities.push(new Bug(x, y));
    }
}
