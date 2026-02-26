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
    case "light":      return "#4FC3F7";
    case "medium":     return "#29B6F6";
    case "heavy":      return "#EF5350";
    case "super":      return "#B71C1C";
    case "assist":     return "#FBC02D";
    case "jump":       return "#00ACC1";
    case "dash":       return "#9E9E9E";
    case "direction":  return "#424242";
    case "other":      return "#FF00FF"; // debug
    default:           return "#111";
  }
}

function drawLegend() {
  let y = height - 80;
  let x = 20;

  let types = [
    "light",
    "medium",
    "heavy",
    "super",
    "assist",
    "dash",
    "jump"
  ];

  for (let t of types) {
    fill(colorForType(t));
    rect(x, y, 15, 15);
    fill(200);
    text(t, x + 20, y + 12);
    x += 90;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
