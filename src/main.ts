import kaboom from "kaboom";

import CatSprite from "./CatSprite.png";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

const k = kaboom({
  background: [197, 212, 233],
});

loadSprite("cat", CatSprite, {
  sliceX: 16,
  anims: {
    run: {
      from: 0,
      to: 7,
      speed: 12,
      loop: true,
    },
    jump: {
      from: 9,
      to: 15,
      speed: 5,
    },
  },
});

scene("game", () => {
  gravity(2400);

  const player = add([
    sprite("cat"),
    pos(80, 48),
    scale(4),
    k.origin("center"),
    area({ width: 12, height: 20 }), // gives it a collider area, so we can check for collisions with other characters later on
    body(), // gives it a physical body, making it fall due to gravity and ability to jump
  ]);

  player.play("run");

  add([
    rect(width(), FLOOR_HEIGHT),
    pos(0, height() - FLOOR_HEIGHT),
    outline(2),
    area(),
    solid(), // makes other objects impossible to pass through
    color(197, 214, 165),
  ]);

  function spawnTree() {
    add([
      rect(FLOOR_HEIGHT, rand(32, 82)),
      area(),
      outline(2),
      pos(width(), height() - FLOOR_HEIGHT),
      k.origin("botleft"),
      color(200, 159, 132),
      move(LEFT, SPEED),
      "tree",
    ]);
    wait(rand(0.5, 1.5), () => {
      spawnTree();
    });
  }

  spawnTree();

  onKeyPress("space", () => {
    player.play("jump");
    player.doubleJump(JUMP_FORCE);
  });

  player.onCollide("tree", () => {
    k.addKaboom(player.pos);
    shake(20);
    if (lives > 0) {
      lives--;
      livesLabel.text = `Lives: ${lives}`;
    }
    if (lives === 0) {
      go("lose");
    }
  });

  player.onGround(() => {
    if (!isKeyDown("space")) {
      player.play("run");
    }
  });

  let score = 0;
  const scoreLabel = add([text(score.toString()), pos(24, 24)]);

  let lives = 3;
  const livesLabel = add([text(`Lives: ${lives}`), pos(24, 100)]);

  onUpdate(() => {
    score++;
    scoreLabel.text = score.toString();
  });
});

scene("lose", () => {
  add([text("Game Over"), pos(center()), k.origin("center")]);
  add([
    text("Restart"),
    pos(182, 48),
    k.origin("center"),
    onMouseDown(() => {
      go("game");
    }),
  ]);
});

go("game");
