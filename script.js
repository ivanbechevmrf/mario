let prevTimestamp = performance.now();
let ctx = document.querySelector("#mycanvas").getContext("2d");
let CANVAS_WIDTH = 384,
  CANVAS_HEIGHT = 384;

let GRAVITY = 400;
let player = { x: 0, y: 0, vy: 0, size: 32, w: 32, h: 32 };
let KeyState = {};
let image_player, image_background, image_brick, image_coin;

let Keys = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

let entities = [];

// 12 x 12 level
let TILE_SIZE = 32;
let LEVEL_WIDTH = 12;
let LEVEL_HEIGHT = 12;
let level = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 2, 0, 1, 0, 0, 2, 0, 0, 0,
  0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0,
  0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

function checkCollisionBelow() {
  // Check the left size of the player
  let plx = Math.floor(player.x / TILE_SIZE);
  // The right side of the player
  let prx = Math.floor((player.x + player.size) / TILE_SIZE);
  // Check the base of the player
  let py = Math.floor((player.y + player.size) / TILE_SIZE);

  return level[py * LEVEL_HEIGHT + plx] === 1 || level[py * LEVEL_HEIGHT + prx] === 1;
}

function update(timeDelta) {
  // Turn into a ratio of seconds
  timeDelta /= 1000;

  // If we are not on the ground, add gravity
  // if (player.y < CANVAS_HEIGHT - player.size) {
  //   player.vy += GRAVITY * timeDelta;
  // }

  // Add our velocity to our position
  player.y += player.vy * timeDelta;

  // Don't want to fall through the ground
  if (KeyState[Keys.LEFT]) {
    player.x -= 3;
  }

  if (KeyState[Keys.RIGHT]) {
    player.x += 3;
  }

  if (KeyState[Keys.UP] && checkCollisionBelow() && player.vy === 0) {
    player.vy = -200;
  }

  // if (KeyState[Keys.DOWN]) {
  //   player.y += 5;
  // }

  if (!checkCollisionBelow()) {
    player.vy += GRAVITY * timeDelta;
  }

  if (checkCollisionBelow() && player.vy > 0) {
    player.y -= player.y % TILE_SIZE;
    player.vy = 0;
  }

  for (let i = 0; i < entities.length; i++) {
    entities[i].update(timeDelta);

    // update, make sure player has "w" and "h" defined.
    if (intersecting(player, entities[i])) {
      entities[i].onCollision();
    }

    if (entities[i].isDestroyed) {
      entities.splice(i, 1);
      i--;
    }
  }


}

function loadImage(path) {
  return new Promise(resolve => {
    let img = new Image();
    img.src = path;
    img.onload = () => resolve(img);
  });
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

  ctx.drawImage(image_player, player.x, player.y);

  for (let i = 0; i < entities.length; i++) {
    entities[i].draw(ctx);
  }
}

async function main() {
  image_background = await loadImage("assets/background.jpg");
  image_player = await loadImage("assets/player.png");
  image_brick = await loadImage('assets/brick.png');
  image_coin = await loadImage('assets/coin.png');

  requestAnimationFrame(loop);

  for (let i = 0; i < LEVEL_HEIGHT; i++) {
    for (let j = 0; j < LEVEL_WIDTH; j++) {
      let value = level[i * LEVEL_WIDTH + j];
      if (value === 2) {
        entities.push(
          new Coin(
            j * TILE_SIZE, // x
            i * TILE_SIZE, // y
          )
        );
      }
    }
  }
}

function loop(timestamp) {
  let timeDelta = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  update(timeDelta);
  draw();

  requestAnimationFrame(loop);
  // setTimeout(() => loop(performance.now()), 1000 / 10); // 10 fps
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

document.addEventListener("keydown", e => {
  KeyState[e.keyCode] = true;
});

document.addEventListener("keyup", e => {
  KeyState[e.keyCode] = false;
});

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;
    this.image = image_coin;
  }

  onCollision() {
    this.isDestroyed = true;
  }

  update(timeDelta) {
    // do nothing 
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y);
  }
}

main();


