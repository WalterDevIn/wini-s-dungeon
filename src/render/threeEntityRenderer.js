import { THREE, createEntityMaterial } from "./threeMaterials.js";

const ENTITY_RADIUS = 0.38;
const ENTITY_CENTER_Y = ENTITY_RADIUS * 0.5;
const PLAYER_CENTER_Y = 1;

export function createThreeEntityRenderer({ entityGroup, geometries, materials }) {
  const materialByColor = new Map();

  function renderEntities(entities, tilemap, cameraMode) {
    clearGroup(entityGroup);

    for (const entity of entities) {
      const mesh = createEntityMesh(
        entity,
        tilemap,
        geometries,
        materials,
        materialByColor,
        cameraMode,
      );
      entityGroup.add(mesh);
    }
  }

  return {
    renderEntities,
  };
}

function createEntityMesh(entity, tilemap, geometries, materials, materialByColor, cameraMode) {
  const material = getEntityMaterial(entity, materials, materialByColor, cameraMode);
  const geometry = getEntityGeometry(entity, geometries);
  const mesh = new THREE.Mesh(geometry, material);
  const position = entityToThreePosition(entity, tilemap);
  const centerY = getEntityCenterY(entity);

  mesh.position.set(position.x, centerY, position.z);

  return mesh;
}

function getEntityGeometry(entity, geometries) {
  if (entity.isPlayer) {
    return geometries.player;
  }

  return geometries.entity;
}

function getEntityCenterY(entity) {
  if (entity.isPlayer) {
    return PLAYER_CENTER_Y;
  }

  return ENTITY_CENTER_Y;
}

function getEntityMaterial(entity, materials, materialByColor, cameraMode) {
  if (entity.isPlayer && cameraMode === "firstPerson") {
    return materials.transparentPlayer;
  }

  const color = entity.renderable?.color;

  if (typeof color !== "string" || !color.trim()) {
    return materials.entityFallback;
  }

  if (!materialByColor.has(color)) {
    materialByColor.set(color, createEntityMaterial(color));
  }

  return materialByColor.get(color);
}

function entityToThreePosition(entity, tilemap) {
  const renderable = entity.renderable ?? {};
  const centerX = entity.position.x + (renderable.width ?? tilemap.tileSize) / 2;
  const centerY = entity.position.y + (renderable.height ?? tilemap.tileSize) / 2;

  return {
    x: centerX / tilemap.tileSize - tilemap.width / 2,
    z: centerY / tilemap.tileSize - tilemap.height / 2,
  };
}

function clearGroup(group) {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }
}
