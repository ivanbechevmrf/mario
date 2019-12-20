import { loadImage } from '../utils/files';

export default async function createMario() {
    const image = await loadImage('/mario.png');
    const gravity = 600;
    const that = {};

    that.state = {
        x: 0,
        y: 0,
        vy: 0,
        w: 32,
        h: 32,
        size: 32,
    };

    const getters = {
        x: () => that.state.x,
        y: () => that.state.y,
        vy: () => that.state.vy,
        w: () => that.state.w,
        h: () => that.state.h,
        size: () => that.state.size,
    };

    const moveLeft = () => {
        that.state = {
            ...that.state,
            x: that.state.x - 3,
        };
    };

    const moveRight = () => {
        that.state = {
            ...that.state,
            x: that.state.x + 3,
        };
    };

    const jump = () => {
        that.state = {
            ...that.state,
            vy: that.state.vy - 200,
        };
    };

    const stopFalling = tileSize => {
        that.state = {
            ...that.state,
            y: that.state.y - (that.state.y % tileSize),
            vy: 0,
        };
    };

    const addFallVelocity = timeDelta => {
        that.state = {
            ...that.state,
            y: that.state.y + that.state.vy * timeDelta,
        };
    };

    const addGravity = timeDelta => {
        that.state = {
            ...that.state,
            vy: that.state.vy + gravity * timeDelta,
        };
    };

    return {
        ...getters,
        image,
        moveLeft,
        moveRight,
        jump,
        stopFalling,
        addFallVelocity,
        addGravity,
    };
}
