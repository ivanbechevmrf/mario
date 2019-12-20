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

  function loop(timestamp) {
    let timeDelta = timestamp - prevTimestamp;
    prevTimestamp = timestamp;
  
    update(timeDelta);
    draw();
  
    requestAnimationFrame(loop);
    // setTimeout(() => loop(performance.now()), 1000 / 10); // 10 fps
  }