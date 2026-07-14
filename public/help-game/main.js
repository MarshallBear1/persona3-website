import { debugMode } from "./entities/debugMode.js";
import { makeWorld } from "./scenes/world.js";

new p5((p) => {
  let font;
  const world = makeWorld(p, () => {});

  p.preload = () => {
    font = p.loadFont("./assets/power-clear.ttf");
    world.load();
  };

  p.setup = () => {
    const canvasEl = p.createCanvas(512, 384, document.getElementById("game"));
    p.pixelDensity(2);
    canvasEl.canvas.style = "";
    canvasEl.canvas.setAttribute("aria-label", "Open-source top-down medical support center game");
    canvasEl.canvas.tabIndex = 0;
    p.textFont(font);
    p.noSmooth();
    world.setup();
  };

  p.draw = () => {
    world.update();
    world.draw();
    debugMode.drawFpsCounter(p);
  };

  p.keyReleased = () => world.keyReleased();

  p.keyPressed = (keyEvent) => {
    if (keyEvent.key === "Shift") debugMode.toggle();
  };

  window.addEventListener("message", (event) => {
    if (event.data?.type === "resume-support-game") world.resume();
  });
});
