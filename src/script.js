import Mario from './entities/Mario';
import animationLoop from './utils/core/animationLoop';
import { loadImage } from './utils/files';
import coinFactory from './entities/coinFactory';

export default function() {
    let ctx = document.querySelector('#mycanvas').getContext('2d');
    let CANVAS_WIDTH = 384,
        CANVAS_HEIGHT = 384;

    let mario;
    let coin;
    let KeyState = {};
    let image_background, image_brick, image_coin;

    let Keys = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
    };

    let entities = [];

    // 12 x 12 level
    let TILE_SIZE = 32;
    let LEVEL_WIDTH = 12;
    let LEVEL_HEIGHT = 12;
    // prettier-ignore
    let level = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0,
    0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];

    function checkCollisionBelow(marioX, marioY, marioSize) {
        // Check the left size of the mario
        let plx = Math.floor(marioX / TILE_SIZE);
        // The right side of the mario
        let prx = Math.floor((marioX + marioSize) / TILE_SIZE);
        // Check the base of the mario
        let py = Math.floor((marioY + marioSize) / TILE_SIZE);

        return (
            level[py * LEVEL_HEIGHT + plx] === 1 ||
            level[py * LEVEL_HEIGHT + prx] === 1
        );
    }

    function checkCollisionRight(marioX, marioY, marioSize) {
        // The right side of the mario
        let prx = Math.floor((marioX + marioSize) / TILE_SIZE);
        // Check the base of the mario
        let py = Math.floor(marioY / TILE_SIZE);

        return level[py * LEVEL_HEIGHT + prx] === 1 || prx > LEVEL_WIDTH;
    }

    function checkCollisionLeft(marioX, marioY, marioSize) {
        // The right side of the mario
        let plx = Math.floor(marioX / TILE_SIZE);
        // Check the base of the mario
        let py = Math.floor(marioY / TILE_SIZE);

        return level[py * LEVEL_HEIGHT + plx] === 1 || plx < 0;
    }

    function update(timeDelta) {
        // Turn into a ratio of seconds
        timeDelta /= 1000;

        const marioX = mario.x();
        const marioY = mario.y();
        const marioVY = mario.vy();
        const marioSize = mario.size();

        const collisionBelow = checkCollisionBelow(marioX, marioY, marioSize);
        const collisionRight = checkCollisionRight(marioX, marioY, marioSize);
        const collisionLeft = checkCollisionLeft(marioX, marioY, marioSize);

        // Add our velocity to our position
        mario.addFallVelocity(timeDelta);

        // Don't want to fall through the ground
        if (KeyState[Keys.LEFT] && !collisionLeft) {
            mario.moveLeft();
        }

        if (KeyState[Keys.RIGHT] && !collisionRight) {
            mario.moveRight();
        }

        if (KeyState[Keys.UP] && collisionBelow && marioVY === 0) {
            mario.jump();
        }

        if (!collisionBelow) {
            mario.addGravity(timeDelta);
        }

        if (collisionBelow && marioVY > 0) {
            mario.stopFalling(TILE_SIZE);
        }

        for (let i = 0; i < entities.length; i++) {
            entities[i].update(timeDelta);

            if (intersecting(mario, entities[i].state())) {
                entities[i].onCollision();
            }

            if (entities[i].isDestroyed) {
                entities.splice(i, 1);
                i--;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(image_background, 0, 0);

        for (let i = 0; i < LEVEL_WIDTH; i++) {
            for (let j = 0; j < LEVEL_HEIGHT; j++) {
                let tile_value = level[j * LEVEL_HEIGHT + i];
                if (tile_value === 1) {
                    ctx.drawImage(image_brick, i * TILE_SIZE, j * TILE_SIZE);
                }
            }
        }

        ctx.drawImage(mario.image, mario.x(), mario.y());

        for (let i = 0; i < entities.length; i++) {
            entities[i].draw(ctx);
        }
    }

    function run() {
        animationLoop(timeDelta => {
            update(timeDelta);
            draw();
        });

        for (let i = 0; i < LEVEL_HEIGHT; i++) {
            for (let j = 0; j < LEVEL_WIDTH; j++) {
                let value = level[i * LEVEL_WIDTH + j];
                if (value === 2) {
                    entities.push(
                        coin.create(
                            j * TILE_SIZE, // x
                            i * TILE_SIZE // y
                        )
                    );
                }
            }
        }
    }

    async function initialize() {
        image_background = await loadImage('/background.jpg');
        image_brick = await loadImage('/brick.png');
        image_coin = await loadImage('/coin.png');

        mario = await Mario();
        coin = await coinFactory();

        return new Promise(resolve => resolve(run));
    }

    function intersecting(a, b) {
        // Quicker to check if they're not
        // overlapping rather than checking for overlap.
        if (
            a.x > b.x + b.w ||
            b.x > a.x + a.w ||
            a.y > b.y + b.h ||
            b.y > a.y + a.h
        ) {
            return false;
        }

        return true;
    }

    document.addEventListener('keydown', e => {
        KeyState[e.keyCode] = true;
    });

    document.addEventListener('keyup', e => {
        KeyState[e.keyCode] = false;
    });

    return { initialize };
}
