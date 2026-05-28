export function createWorld() {
  return {
    nextEntityId: 1,
    entities: new Set(),
    components: new Map(),
  };
}

export function createEntity(world) {
  const entityId = world.nextEntityId;
  world.nextEntityId += 1;
  world.entities.add(entityId);
  return entityId;
}

export function addComponent(world, entityId, componentType, componentData) {
  if (!world.entities.has(entityId)) {
    throw new Error(`No existe la entidad ${entityId}.`);
  }

  if (!world.components.has(componentType)) {
    world.components.set(componentType, new Map());
  }

  world.components.get(componentType).set(entityId, componentData);
}

export function addComponents(world, entityId, componentEntries) {
  for (const [componentType, componentData] of componentEntries) {
    addComponent(world, entityId, componentType, componentData);
  }
}

export function getComponent(world, entityId, componentType) {
  return world.components.get(componentType)?.get(entityId) ?? null;
}

export function queryEntities(world, componentTypes) {
  return [...world.entities].filter((entityId) =>
    componentTypes.every((componentType) =>
      world.components.get(componentType)?.has(entityId) ?? false,
    ),
  );
}
