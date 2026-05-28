import { createEntity, createWorld, addComponent } from "../ecs/world.js";
import {
  Collider,
  ComponentType,
  MovementStats,
  PlayerControlled,
  Position,
  Renderable,
  Velocity,
} from "../domain/components.js";
import { createKeyboardInput } from "../input/keyboardInput.js";
import { tilemap } from "../world/tilemap.js";
import { playerControlSystem } from "../simulation/playerControlSystem.js";
import { movementSystem } from "../simulation/movementSystem.js";
import { createCanvasRenderer } from "../render/canvasRenderer.js";

const canvas = document.querySelector("#game-canvas");
const context = canvas?.getContext("2d");

if (!canvas || !context) {
  throw new Error("No se pudo inicializar el canvas del juego.");
}

const world = createWorld();
const keyboardInput = createKeyboardInput();
const renderer = createCanvasRenderer(canvas, context);

createPlayer(world);

let lastFrameTime = performance.now();

function frame(currentTime) {
  const deltaSeconds = Math.min((currentTime - lastFrameTime) / 1000, 0.05);
  lastFrameTime = currentTime;

  const movementIntent = keyboardInput.getMovementIntent();

  playerControlSystem(world, movementIntent);
  movementSystem(world, tilemap, deltaSeconds);
  renderer.render(world, tilemap);

  requestAnimationFrame(frame);
}

function createPlayer(world) {
  const player = createEntity(world);

  addComponent(world, player, ComponentType.Position, Position(96, 96));
  addComponent(world, player, ComponentType.Velocity, Velocity());
  addComponent(
    world,
    player,
    ComponentType.Renderable,
    Renderable({
      shape: "rect",
      width: 28,
      height: 28,
      color: "#f2c166",
    }),
  );
  addComponent(
    world,
    player,
    ComponentType.Collider,
    Collider({
      width: 28,
      height: 28,
    }),
  );
  addComponent(
    world,
    player,
    ComponentType.MovementStats,
    MovementStats({ speed: 180 }),
  );
  addComponent(world, player, ComponentType.PlayerControlled, PlayerControlled());
}

requestAnimationFrame(frame);
