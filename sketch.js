let combos = [];
let rowHeight = 32;
let blockWidth = 8;
let startY = 60;
let scrollOffset = 0;

let legendWidth = 200;
let infoWidth = 240;
let rightPadding = 20;

let sortMode = "damage";
let selectedMeter = "ALL";
let selectedCharacter = "ALL";
let characters = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");

  loadJSON("combo_genome.json", data => {
    combos = Array.isArray(data)
      ? data
      : Object.values(data);

    characters = [...new Set(
      combos.map(c => c.character_1).filter(Boolean)
    )];
  });
}

function draw() {
  background(15);

  if (combos.length === 0) return;

  let visible = getVisibleCombos();

  // ---- DRAW GENOMES (SCROLLING) ----
  let y = startY - scrollOffset;

  for (let i = 0; i < visible.length; i++) {
    if (y > -rowHeight && y < height + rowHeight) {
      drawGenome(visible[i], y);
    }
    y += rowHeight;
  }

  // ---- FIXED PANELS ----
  drawLegend();
  drawStaticInfoPanel(visible);
}

function getVisibleCombos() {
  let filtered = combos;

  if (selectedCharacter !== "ALL") {
    filtered = filtered.filter(c => c.character_1 === selectedCharacter);
  }

  if (selectedMeter !== "ALL") {
    filtered = filtered.filter(c => c.meter_cost == selectedMeter);
  }

  if (sortMode === "damage") {
    filtered = filtered.slice().sort((a,b) => (b.damage||0) - (a.damage||0));
  }

  if (sortMode === "meter") {
    filtered = filtered.slice().sort((a,b) => (b.meter_cost||0) - (a.meter_cost||0));
  }

  return filtered;
}

function drawGenome(combo, baseY) {
  if (!combo.genome) return;

  let genomeStartX = 40;
  let blockHeight = 14;
  let x = genomeStartX;

  for (let g of combo.genome) {
    fill(colorForType(g.type));
    stroke(0);
    strokeWeight(1);
    rect(x, baseY - blockHeight, blockWidth, blockHeight);
    x += blockWidth;
  }
}

function drawStaticInfoPanel(visible) {

  let rowIndex = Math.floor((mouseY + scrollOffset - startY) / rowHeight);

  let panelX = width - legendWidth - infoWidth - rightPadding;
  let panelY = 80;   // FIXED POSITION
  let panelW = infoWidth;
  let panelH = 140;

  fill(25);
  stroke(70);
  rect(panelX, panelY, panelW, panelH, 10);

  noStroke();
  fill(220);
  textSize(13);
  textAlign(LEFT, TOP);

  if (rowIndex < 0 || rowIndex >= visible.length) {
    text("Hover over a combo", panelX + 12, panelY + 12);
    return;
  }

  let combo = visible[rowIndex];

  text(
`Character: ${combo.character_1 || "Unknown"}

Damage: ${combo.damage || 0}
Meter Cost: ${combo.meter_cost || 0}
Length: ${combo.genome.length}

Sort: ${sortMode}
Character Filter: ${selectedCharacter}
Meter Filter: ${selectedMeter}`,
    panelX + 12,
    panelY + 12
  );
}

function mouseWheel(event) {

  let visible = getVisibleCombos();

  scrollOffset += event.delta * 0.5;

  let totalHeight = visible.length * rowHeight;
  let visibleHeight = height - startY;

  let maxScroll = max(0, totalHeight - visibleHeight);

  scrollOffset = constrain(scrollOffset, 0, maxScroll);

  return false;
}

function keyPressed() {

  if (key === 'd') sortMode = "damage";
  if (key === 'm') sortMode = "meter";

  if (key === '0') selectedMeter = "ALL";
  if (key === '1') selectedMeter = 1;
  if (key === '2') selectedMeter = 2;
  if (key === '3') selectedMeter = 3;

  if (key === 'c') {
    let currentIndex = characters.indexOf(selectedCharacter);
    currentIndex++;
    if (currentIndex >= characters.length) {
      selectedCharacter = "ALL";
    } else {
      selectedCharacter = characters[currentIndex];
    }
  }

  scrollOffset = 0;
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
  rect(width - legendWidth, 50, legendWidth - 20, 320, 8);

  let legendX = width - legendWidth + 20;
  let legendY = 80;
  let boxSize = 16;
  let spacing = 26;

  fill(200);
  textSize(14);
  text("Legend", legendX, legendY - 25);

  let types = [
    "light","medium","heavy","super",
    "assist","dash","jump","direction","other"
  ];

  for (let i = 0; i < types.length; i++) {
    let t = types[i];

    fill(colorForType(t));
    rect(legendX, legendY + i * spacing, boxSize, boxSize, 3);

    fill(200);
    textSize(12);
    text(
      t,
      legendX + boxSize + 12,
      legendY + i * spacing + boxSize - 4
    );
  }

  fill(180);
  textSize(11);
  text("D = sort damage", legendX, legendY + 9 * spacing + 20);
  text("M = sort meter", legendX, legendY + 9 * spacing + 35);
  text("1/2/3 = meter filter", legendX, legendY + 9 * spacing + 50);
  text("0 = clear meter", legendX, legendY + 9 * spacing + 65);
  text("C = cycle character", legendX, legendY + 9 * spacing + 80);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
