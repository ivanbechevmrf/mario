import { loadImage } from '../utils/files';

export default class Mario {
    constructor(image) {
        this.image = image;
    }

    gravity = 600;
    state = {
        x: 0,
        y: 0,
        vy: 0,
        w: 32,
        h: 32,
        size: 32,
    };

    static async init() {
        const marioImage = await loadImage('/mario.png');
        return new Mario(marioImage);
    }

    set(properties) {
        this.state = {
            ...this.state,
            ...properties,
        };
    }

    get(property) {
        return this.state[property];
    }

    getImage() {
        return this.image;
    }

    moveLeft() {
        this.set({ x: this.state.x - 3 });
    }

    moveRight() {
        this.set({ x: this.state.x + 3 });
    }

    jump() {
        this.set({ vy: this.state.vy - 200 });
    }

    stopFalling(tileSize) {
        this.set({
            y: this.state.y - (this.state.y % tileSize),
            vy: 0,
        });
    }

    addFallVelocity(timeDelta) {
        this.set({
            y: this.state.y + this.state.vy * timeDelta,
        });
    }

    addGravity(timeDelta) {
        this.set({
            vy: this.state.vy + this.gravity * timeDelta,
        });
    }
}
