let combos = [];
let rowHeight = 32;
let blockWidth = 8;
let startY = 60;
let scrollOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");

  loadJSON("combo_genome.json", data => {
    combos = Array.isArray(data)
      ? data
      : Object.values(data);

    console.log("Loaded:", combos.length);
  });
}

function draw() {
  background(15);

  if (combos.length === 0) return;

  let y = startY - scrollOffset;

  for (let i = 0; i < combos.length; i++) {
    if (y > -rowHeight && y < height + rowHeight) {
      drawGenome(combos[i], y);
    }
    y += rowHeight;
  }

  drawLegend();
}

function drawGenome(combo, baseY) {
  if (!combo.genome) return;

  let genomeStartX = 40;
  let infoStartX = width - 280;
  let blockHeight = 14;

  // ---- GENOME BLOCKS ----
  let x = genomeStartX;

  for (let g of combo.genome) {
    fill(colorForType(g.type));
    stroke(0);
    strokeWeight(1);
    rect(x, baseY - blockHeight, blockWidth, blockHeight);
    x += blockWidth;
  }

  // ---- INFO BOX ----
  let boxWidth = 240;
  let boxHeight = 24;

  fill(25);
  stroke(60);
  rect(infoStartX, baseY - boxHeight + 6, boxWidth, boxHeight, 20);

  noStroke();
  fill(220);
  textSize(12);
  textAlign(LEFT, CENTER);

  let name = combo.character_1 || "Unknown";
  let damage = combo.damage || 0;
  let meter = combo.meter_cost || 0;

  text(
    `${name}  |  ${damage} dmg  |  ${meter} bar`,
    infoStartX + 10,
    baseY - 6
  );
}

function mouseWheel(event) {

  scrollOffset += event.delta * 0.5;   // adjust speed

  let totalHeight = combos.length * rowHeight;
  let visibleHeight = height - startY;

  let maxScroll = max(0, totalHeight - visibleHeight);

  scrollOffset = constrain(scrollOffset, 0, maxScroll);

  return false;  // 🔥 prevents page from scrolling
}

function colorForType(type) {
  switch (type) {
    case "light":      return "#a6cee3";
    case "medium":     return "#1f78b4";
    case "heavy":      return "#b2df8a";
    case "super":      return "#33a02c";
    case "assist":     return "#fb9a99";
    case "dash":       return "#e31a1c";
    case "jump":       return "#fdbf6f";
    case "direction":  return "#ff7f00";
    case "other":      return "#cab2d6";
    default:           return "#222";
  }
}

function drawLegend() {
  fill(25);
  noStroke();
  rect(width - 200, 50, 180, 320, 8);

  let legendX = width - 180;
  let legendY = 80;
  let boxSize = 16;
  let spacing = 28;

  let types = [
    "light",
    "medium",
    "heavy",
    "super",
    "assist",
    "dash",
    "jump",
    "direction",
    "other"
  ];

  fill(200);
  textSize(14);
  text("Legend", legendX, legendY - 25);

  for (let i = 0; i < types.length; i++) {
    let t = types[i];

    fill(colorForType(t));
    noStroke();
    rect(legendX, legendY + i * spacing, boxSize, boxSize, 3);

    fill(200);
    textSize(12);
    text(
      t,
      legendX + boxSize + 12,
      legendY + i * spacing + boxSize - 4
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
