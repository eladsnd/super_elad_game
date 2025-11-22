import { Entity } from '../entities/Entity';
import { Token } from '../entities/Token';
import { InfoBlock } from '../entities/InfoBlock';
import { Bug } from '../entities/Bug';
import cvData from '../data/cv.json';

import { ResourceManager } from './ResourceManager';

export class Level {
    public entities: Entity[] = [];
    public width: number = 0;
    private resourceManager: ResourceManager;

    constructor(resourceManager: ResourceManager) {
        this.resourceManager = resourceManager;
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
        platform.sprite = this.resourceManager.get('ground');
        this.entities.push(platform);
    }

    private addToken(x: number, y: number, text: string): void {
        const token = new Token(x, y, text);
        token.sprite = this.resourceManager.get('token');
        this.entities.push(token);
    }

    private addInfo(x: number, y: number, title: string, content: string): void {
        const info = new InfoBlock(x, y, title, content);
        info.sprite = this.resourceManager.get('info');
        this.entities.push(info);
    }

    private addBug(x: number, y: number): void {
        const bug = new Bug(x, y);
        bug.sprite = this.resourceManager.get('bug');
        this.entities.push(bug);
    }
}
