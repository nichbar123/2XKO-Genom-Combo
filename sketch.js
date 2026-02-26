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

  drawLegend();
}

function drawGenome(combo, baseY) {
  if (!combo.genome) return;

  let x = 180;

  for (let g of combo.genome) {
    let yOffset = 0;
    let h = 16;

    if (g.type === "super") {
      h = 16 + (g.super_level || 1) * 6;
    }

    if (g.type === "jump") {
      yOffset = -8;  // temporary visual lift
    }

    fill(colorForType(g.type));
    noStroke();
    rect(x, baseY - 12, blockWidth, 12);

    if (g.type === "dash") {
      x += blockWidth * 0.6;
    } else if (g.type === "direction") {
      x += blockWidth * 0.4;
    } else {
      x += blockWidth;
    }
  }

  fill(200);
  textSize(11);
  text(
    `${combo.character_1 || "Unknown"} | ${combo.damage || 0} dmg | ${combo.meter_cost || 0} bar`,
    20,
    baseY + 4
  );
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
