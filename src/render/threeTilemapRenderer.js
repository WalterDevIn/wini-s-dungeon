import { THREE } from "./threeMaterials.js";

const FLOOR_Y = 0;
const WALL_HEIGHT = 6;
const WALL_CENTER_Y = WALL_HEIGHT / 2;

export function createThreeTilemapRenderer({ tilemapGroup, geometries, materials }) {
  let renderedTilemap = null;

  function renderTilemap(tilemap) {
    if (renderedTilemap === tilemap) {
      return;
    }

    clearGroup(tilemapGroup);
    renderFloors(tilemapGroup, tilemap, geometries, materials);
    renderWalls(tilemapGroup, tilemap, geometries, materials);
    renderedTilemap = tilemap;
  }

  return {
    renderTilemap,
  };
}

function renderFloors(group, tilemap, geometries, materials) {
  for (let tileY = 0; tileY < tilemap.height; tileY += 1) {
    for (let tileX = 0; tileX < tilemap.width; tileX += 1) {
      if (tilemap.tiles[tileY][tileX] === "#") {
        continue;
      }

      const mesh = new THREE.Mesh(geometries.floor, materials.floor);
      const position = tileToThreePosition(tilemap, tileX, tileY);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(position.x, FLOOR_Y, position.z);
      group.add(mesh);
    }
  }
}

function renderWalls(group, tilemap, geometries, materials) {
  for (let tileY = 0; tileY < tilemap.height; tileY += 1) {
    for (let tileX = 0; tileX < tilemap.width; tileX += 1) {
      if (tilemap.tiles[tileY][tileX] !== "#") {
        continue;
      }

      const mesh = new THREE.Mesh(geometries.wall, materials.wall);
      const position = tileToThreePosition(tilemap, tileX, tileY);
      mesh.scale.set(1, WALL_HEIGHT, 1);
      mesh.position.set(position.x, WALL_CENTER_Y, position.z);
      group.add(mesh);
    }
  }
}

function tileToThreePosition(tilemap, tileX, tileY) {
  return {
    x: tileX + 0.5 - tilemap.width / 2,
    z: tileY + 0.5 - tilemap.height / 2,
  };
}

function clearGroup(group) {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }
}
