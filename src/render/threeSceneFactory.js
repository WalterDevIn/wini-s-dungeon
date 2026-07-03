import { THREE, createThreeMaterials } from "./threeMaterials.js";

const BACKGROUND_COLOR = 0x080a0c;
const CAMERA_VIEW_TILE_HEIGHT = 18;
const TOP_DOWN_CAMERA_HEIGHT = 22;
const EYE_HEIGHT = 1.45;
const FIRST_PERSON_FORWARD_DISTANCE = 8;

export function createThreeScene({ canvas }) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setClearColor(BACKGROUND_COLOR, 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);

  const topDownCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
  const firstPersonCamera = new THREE.PerspectiveCamera(70, 1, 0.05, 1000);

  const tilemapGroup = new THREE.Group();
  const entityGroup = new THREE.Group();
  scene.add(tilemapGroup);
  scene.add(entityGroup);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.88);
  keyLight.position.set(12, 18, 8);
  scene.add(ambientLight);
  scene.add(keyLight);

  return {
    renderer,
    scene,
    cameras: {
      topDown: topDownCamera,
      firstPerson: firstPersonCamera,
    },
    tilemapGroup,
    entityGroup,
    materials: createThreeMaterials(),
    geometries: createThreeGeometries(),
  };
}

export function resizeThreeScene({ renderer, cameras, canvas, viewport }) {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = Math.floor(viewport.width * pixelRatio);
  const height = Math.floor(viewport.height * pixelRatio);

  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(viewport.width, viewport.height, false);
  }

  renderer.setPixelRatio(pixelRatio);
  updateTopDownProjection(cameras.topDown, viewport);
  updateFirstPersonProjection(cameras.firstPerson, viewport);
}

export function updateThreeCamera({ cameras, tilemap, cameraSnapshot }) {
  if (cameraSnapshot.mode === "firstPerson") {
    updateFirstPersonCamera(cameras.firstPerson, { tilemap, cameraSnapshot });
    return cameras.firstPerson;
  }

  updateTopDownCamera(cameras.topDown, { tilemap, cameraSnapshot });
  return cameras.topDown;
}

function updateTopDownCamera(camera, { tilemap, cameraSnapshot }) {
  const target = getCameraTarget(tilemap, cameraSnapshot);

  camera.position.set(target.x, TOP_DOWN_CAMERA_HEIGHT, target.z);
  camera.up.set(0, 0, -1);
  camera.lookAt(target.x, 0, target.z);
}

function updateFirstPersonCamera(camera, { tilemap, cameraSnapshot }) {
  const position = pixelPointToThreePosition(tilemap, cameraSnapshot.position);
  const forward = {
    x: Math.cos(cameraSnapshot.yaw) * FIRST_PERSON_FORWARD_DISTANCE,
    z: Math.sin(cameraSnapshot.yaw) * FIRST_PERSON_FORWARD_DISTANCE,
  };
  const pitchOffset = Math.tan(cameraSnapshot.pitch) * FIRST_PERSON_FORWARD_DISTANCE;

  camera.up.set(0, 1, 0);
  camera.position.set(position.x, EYE_HEIGHT, position.z);
  camera.lookAt(position.x + forward.x, EYE_HEIGHT + pitchOffset, position.z + forward.z);
}

function createThreeGeometries() {
  return {
    floor: new THREE.PlaneGeometry(1, 1),
    wall: new THREE.BoxGeometry(1, 1, 1),
    entity: new THREE.SphereGeometry(0.38, 16, 12),
    player: new THREE.CylinderGeometry(0.5, 0.5, 2, 16),
  };
}

function updateTopDownProjection(camera, viewport) {
  const aspect = viewport.width / Math.max(viewport.height, 1);
  const viewSize = CAMERA_VIEW_TILE_HEIGHT;

  camera.left = (-viewSize * aspect) / 2;
  camera.right = (viewSize * aspect) / 2;
  camera.top = viewSize / 2;
  camera.bottom = -viewSize / 2;
  camera.updateProjectionMatrix();
}

function updateFirstPersonProjection(camera, viewport) {
  camera.aspect = viewport.width / Math.max(viewport.height, 1);
  camera.updateProjectionMatrix();
}

function getCameraTarget(tilemap, cameraSnapshot) {
  const centerX = cameraSnapshot.x + cameraSnapshot.width / 2;
  const centerY = cameraSnapshot.y + cameraSnapshot.height / 2;
  return pixelPointToThreePosition(tilemap, { x: centerX, y: centerY });
}

function pixelPointToThreePosition(tilemap, point) {
  return {
    x: point.x / tilemap.tileSize - tilemap.width / 2,
    z: point.y / tilemap.tileSize - tilemap.height / 2,
  };
}
