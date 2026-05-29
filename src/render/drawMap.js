const FONT_FAMILY = "Georgia, 'Times New Roman', serif";

export function drawMap(context, tilemap, pixelRatio) {
  const tileSize = tilemap.tileSize * pixelRatio;

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `${Math.floor(tileSize * 0.72)}px ${FONT_FAMILY}`;

  for (let y = 0; y < tilemap.height; y += 1) {
    for (let x = 0; x < tilemap.width; x += 1) {
      drawTile(context, tilemap, x, y, tileSize, pixelRatio);
    }
  }
}

function drawTile(context, tilemap, x, y, tileSize, pixelRatio) {
  const tile = tilemap.tiles[y][x];
  const screenX = x * tileSize;
  const screenY = y * tileSize;
  const centerX = screenX + tileSize / 2;
  const centerY = screenY + tileSize / 2;

  context.fillStyle = tile === "#" ? "#101010" : "#070707";
  context.fillRect(screenX, screenY, tileSize, tileSize);

  context.strokeStyle = "rgba(255, 255, 255, 0.08)";
  context.lineWidth = Math.max(1, pixelRatio);
  context.strokeRect(screenX, screenY, tileSize, tileSize);

  if (tile === "#") {
    context.fillStyle = "#d7d0bd";
    context.fillText("#", centerX, centerY);
    return;
  }

  context.fillStyle = "rgba(215, 208, 189, 0.18)";
  context.fillText("·", centerX, centerY);
}
