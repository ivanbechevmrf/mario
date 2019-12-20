import { loadImage } from '../utils/files';

export default async function CoinFactiry() {
    const image = await loadImage('/coin.png');

    const create = (x, y) => {
        const that = {};

        that.state = {
            x,
            y,
            w: 32,
            h: 32,
            isDestioyed: false,
        };

        const onCollision = () => {
            that.state = {
                ...that.state,
                isDestioyed: true,
            };
        };

        const draw = ctx => {
            ctx.drawImage(image, that.state.x, that.state.y);
        };

        const update = () => {};

        return {
            image,
            onCollision,
            draw,
            update,
            state: () => ({ ...that.state }),
        };
    };

    return { create };
}
