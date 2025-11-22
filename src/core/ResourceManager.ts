export class ResourceManager {
    private images: { [key: string]: HTMLImageElement } = {};
    private loaded: number = 0;
    private total: number = 0;
    private onLoaded: () => void;

    constructor(onLoaded: () => void) {
        this.onLoaded = onLoaded;
    }

    public load(assets: { [key: string]: string }): void {
        this.total = Object.keys(assets).length;

        for (const [key, src] of Object.entries(assets)) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.loaded++;
                if (this.loaded === this.total) {
                    this.onLoaded();
                }
            };
            this.images[key] = img;
        }
    }

    public get(key: string): HTMLImageElement {
        return this.images[key];
    }
}
