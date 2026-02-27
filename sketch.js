let combos = [];
let rowHeight = 32;
let blockWidth = 8;
let startY = 60;
let scrollOffset = 0;

let legendWidth = 200;
let infoWidth = 280;
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

  let y = startY - scrollOffset;

  for (let i = 0; i < visible.length; i++) {
    if (y > -rowHeight && y < height + rowHeight) {
      drawGenomeRow(visible[i], y);
    }
    y += rowHeight;
  }

  drawLegend();
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

function drawGenomeRow(combo, baseY) {
  if (!combo.genome) return;

  let genomeStartX = 40;
  let infoStartX = width - legendWidth - infoWidth - rightPadding;
  let blockHeight = 14;

  // ---- GENOME ----
  let x = genomeStartX;

  for (let g of combo.genome) {
    fill(colorForType(g.type));
    stroke(0);
    strokeWeight(1);
    rect(x, baseY - blockHeight, blockWidth, blockHeight);
    x += blockWidth;
  }

  // ---- INFO STRIP ----
  fill(25);
  stroke(60);
  rect(infoStartX, baseY - 18, infoWidth, 22, 6);

  noStroke();
  fill(220);
  textSize(12);
  textAlign(LEFT, CENTER);

  let name = combo.character_1 || "Unknown";
  let damage = combo.damage || 0;
  let meter = combo.meter_cost || 0;
  let length = combo.genome.length;

  text(
    `| ${name} | ${damage} | ${meter} | ${length} |`,
    infoStartX + 10,
    baseY - 6
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
    fill(colorForType(types[i]));
    rect(legendX, legendY + i * spacing, boxSize, boxSize, 3);

    fill(200);
    textSize(12);
    text(
      types[i],
      legendX + boxSize + 12,
      legendY + i * spacing + boxSize - 4
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
