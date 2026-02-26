let combos = [];
let rowHeight = 40;
let blockWidth = 8;
let startY = 60;

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

  let y = startY;

  for (let i = 0; i < combos.length; i++) {
    let combo = combos[i];
    drawGenome(combo, y);
    y += rowHeight;

    if (y > height - 40) break;
  }
  drawTooltip();
  drawLegend();
}

let hoverIndex = Math.floor((mouseY - startY) / rowHeight);

if (hoverIndex >= 0 && hoverIndex < combos.length) {
  fill(255, 255, 255, 20);
  noStroke();
  rect(0, startY + hoverIndex * rowHeight - rowHeight + 4,
       width, rowHeight);
}

function drawGenome(combo, baseY) {
  if (!combo.genome) return;

  let x = 40;              // start closer to left
  let blockHeight = 14;    // uniform height

  for (let g of combo.genome) {

    fill(colorForType(g.type));
    stroke(0);              // black border
    strokeWeight(1);

    rect(x, baseY - blockHeight, blockWidth, blockHeight);

    x += blockWidth;        // uniform spacing
  }
}

function drawTooltip() {

  let rowIndex = Math.floor((mouseY - startY) / rowHeight);

  if (rowIndex < 0 || rowIndex >= combos.length) return;

  let combo = combos[rowIndex];
  if (!combo || !combo.genome) return;

  let label = `${combo.character_1 || "Unknown"} 
Damage: ${combo.damage || 0} 
Meter: ${combo.meter_cost || 0}`;

  let padding = 10;
  textSize(13);
  let w = textWidth("Damage: 0000") + padding * 2;
  let h = 60;

  let tooltipX = mouseX + 15;
  let tooltipY = mouseY + 15;

  // Keep inside screen
  if (tooltipX + w > width) tooltipX = width - w - 10;
  if (tooltipY + h > height) tooltipY = height - h - 10;

  fill(0, 230);
  stroke(255);
  rect(tooltipX, tooltipY, w, h, 6);

  noStroke();
  fill(255);
  text(label, tooltipX + padding, tooltipY + 20);
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
  let legendX = width - 180;   // right side
  let legendY = 80;            // start near top
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
