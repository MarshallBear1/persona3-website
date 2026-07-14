import { makeNPC } from "../entities/npc.js";
import { makePlayer } from "../entities/player.js";
import { makeTiledMap } from "../entities/map.js";
import { makeDialogBox } from "../entities/dialogBox.js";
import { makeCamera } from "../entities/camera.js";

export function makeWorld(p, setScene) {
  return {
    camera: makeCamera(p, 100, 0),
    player: makePlayer(p, 0, 0),
    npc: makeNPC(p, 0, 0),
    map: makeTiledMap(p, 100, -150),
    dialogBox: makeDialogBox(p, 0, 280),
    makeScreenFlash: false,
    alpha: 0,
    blinkBack: false,
    easing: 3,
    load() {
      this.dialogBox.load();
      this.map.load("./assets/Trainer Tower interior.png", "./maps/world.json");
      this.player.load();
      this.npc.load();
    },
    setup() {
      this.map.prepareTiles();
      const spawnPoints = this.map.getSpawnPoints();
      for (const spawnPoint of spawnPoints) {
        switch (spawnPoint.name) {
          case "player":
            this.player.x = this.map.x + spawnPoint.x;
            this.player.y = this.map.y + spawnPoint.y + 32;
            break;
          case "npc":
            this.npc.x = this.map.x + spawnPoint.x;
            this.npc.y = this.map.y + spawnPoint.y + 32;
            break;
          default:
        }
      }
      this.player.setup();
      this.camera.attachTo(this.player);

      this.npc.setup();
    },

    update() {
      this.camera.update();
      this.player.update(); // this being before the map draw call is important
      this.npc.update();
      this.dialogBox.update();
      if (this.alpha <= 0) this.blinkBack = true;
      if (this.alpha >= 255) this.blinkBack = false;

      if (this.blinkBack) {
        this.alpha += 0.7 * this.easing * p.deltaTime;
      } else {
        this.alpha -= 0.7 * this.easing * p.deltaTime;
      }
    },
    drawClinicDecor() {
      const x = Math.round(this.npc.x + this.camera.x);
      const y = Math.round(this.npc.y + this.camera.y);

      p.push();
      p.noStroke();

      // Friendly clinic sign mounted above the original support terminal.
      p.fill(244, 252, 255, 246);
      p.rect(x - 46, y - 66, 124, 34, 4);
      p.fill(15, 42, 94);
      p.rect(x - 42, y - 62, 116, 26, 3);
      p.fill(255, 74, 91);
      p.rect(x - 34, y - 58, 5, 18);
      p.rect(x - 40, y - 52, 17, 5);
      p.fill(223, 250, 255);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(9);
      p.text("MEDICAL HELP", x - 17, y - 49);

      // A soft medical-cross floor marker guides the player to reception.
      p.fill(142, 245, 255, 52);
      p.ellipse(x + 16, y + 58, 62, 34);
      p.fill(255, 88, 104, 150);
      p.rect(x + 12, y + 43, 8, 30, 2);
      p.rect(x + 1, y + 54, 30, 8, 2);
      p.pop();
    },
    drawMedicalGuideBadge() {
      const x = Math.round(this.npc.x + this.camera.x);
      const y = Math.round(this.npc.y + this.camera.y);

      p.push();
      p.noStroke();
      p.fill(244, 252, 255, 238);
      p.rect(x + 7, y + 9, 19, 19, 3);
      p.fill(255, 55, 75);
      p.rect(x + 14, y + 11, 5, 15);
      p.rect(x + 9, y + 16, 15, 5);
      p.pop();
    },
    draw() {
      p.clear();
      p.background(0);
      this.npc.handleCollisionsWith(this.player, () => {
        this.dialogBox.displayText(
          "MEDICAL HELP DESK ONLINE.\nOPENING A NEW TICKET...",
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 450));
            this.dialogBox.setVisibility(false);
            window.parent.postMessage({ type: "open-support-ticket" }, "*");
          }
        );
        this.dialogBox.setVisibility(true);
      });
      this.map.draw(this.camera, this.player);
      this.drawClinicDecor();
      this.npc.draw(this.camera);
      this.drawMedicalGuideBadge();
      this.player.draw(this.camera);
      this.dialogBox.draw();

      if (this.makeScreenFlash) {
        p.fill(0, 0, 0, this.alpha);
        p.rect(0, 0, 512, 384);
      }
    },

    keyReleased() {
      for (const key of [
        p.RIGHT_ARROW,
        p.LEFT_ARROW,
        p.UP_ARROW,
        p.DOWN_ARROW,
        68,
        65,
        87,
        83,
      ]) {
        if (p.keyIsDown(key)) {
          return;
        }
      }

      switch (this.player.direction) {
        case "up":
          this.player.setAnim("idle-up");
          break;
        case "down":
          this.player.setAnim("idle-down");
          break;
        case "left":
        case "right":
          this.player.setAnim("idle-side");
          break;
        default:
      }
    },

    resume() {
      this.dialogBox.setVisibility(false);
      this.dialogBox.clearText();
      this.player.y += 40;
      this.player.freeze = false;
    },
  };
}
