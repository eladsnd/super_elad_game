export class ResourceManager {
    private images: { [key: string]: HTMLImageElement } = {};
    private loaded: number = 0;
    private toLoad: number = 0;
    private onLoaded: () => void;

    constructor(onLoaded: () => void) {
        this.onLoaded = onLoaded;
    }

    public load(assets: { [key: string]: string }): void {
        this.toLoad = Object.keys(assets).length;

        for (const key in assets) {
            const img = new Image();
            img.src = assets[key];
            img.onload = () => {
                this.processImage(img).then((processedImg) => {
                    this.images[key] = processedImg;
                    this.loaded++;
                    if (this.loaded === this.toLoad) {
                        this.onLoaded();
                    }
                });
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${assets[key]}`);
                this.loaded++;
                if (this.loaded === this.toLoad) {
                    this.onLoaded();
                }
            };
        }
    }

    private processImage(img: HTMLImageElement): Promise<HTMLImageElement> {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Simple chroma key: remove white/near-white pixels
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                if (r > 240 && g > 240 && b > 240) {
                    data[i + 3] = 0; // Set alpha to 0
                }
            }

            ctx.putImageData(imageData, 0, 0);

            const newImg = new Image();
            newImg.onload = () => resolve(newImg);
            newImg.src = canvas.toDataURL();
        });
    }

    public get(key: string): HTMLImageElement {
        return this.images[key];
    }
}
