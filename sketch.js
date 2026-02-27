let combos = [];
let rowHeight = 32;
let blockWidth = 8;
let startY = 60;
let scrollOffset = 0;

let legendWidth = 220;
let infoWidth = 280;
let rightPadding = 20;

let selectedMeter = "ALL";
let selectedCharacter = "ALL";
let characters = [];

let buttons = [];

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

  // ---- DRAW SCROLLING GENOMES ----
  let y = startY - scrollOffset;

  for (let i = 0; i < visible.length; i++) {
    if (y > -rowHeight && y < height + rowHeight) {
      drawGenomeRow(visible[i], y);
    }
    y += rowHeight;
  }

  drawLegend();
  drawFilterButtons();
}

function getVisibleCombos() {
  let filtered = combos;

  if (selectedCharacter !== "ALL") {
    filtered = filtered.filter(c => c.character_1 === selectedCharacter);
  }

  if (selectedMeter !== "ALL") {
    filtered = filtered.filter(c => c.meter_cost == selectedMeter);
  }

  // ALWAYS sort by damage
  filtered = filtered.slice().sort((a,b) => (b.damage||0) - (a.damage||0));

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

function drawLegend() {

  fill(25);
  noStroke();
  rect(width - legendWidth, 50, legendWidth - 20, 380, 10);

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

function drawFilterButtons() {

  buttons = [];

  let x = width - legendWidth + 20;
  let y = 330;
  let w = legendWidth - 60;
  let h = 30;

  drawButton(
    x, y, w, h,
    `Character: ${selectedCharacter}`,
    () => cycleCharacter()
  );

  drawButton(
    x, y + 50, w, h,
    `Meter: ${selectedMeter}`,
    () => cycleMeter()
  );
}

function drawButton(x, y, w, h, label, action) {

  fill(40);
  stroke(80);
  rect(x, y, w, h, 6);

  noStroke();
  fill(220);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);

  buttons.push({x, y, w, h, action});
}

function mousePressed() {
  for (let b of buttons) {
    if (
      mouseX > b.x &&
      mouseX < b.x + b.w &&
      mouseY > b.y &&
      mouseY < b.y + b.h
    ) {
      b.action();
      scrollOffset = 0;
    }
  }
}

function cycleCharacter() {
  if (selectedCharacter === "ALL") {
    selectedCharacter = characters[0] || "ALL";
  } else {
    let index = characters.indexOf(selectedCharacter);
    index++;
    if (index >= characters.length) {
      selectedCharacter = "ALL";
    } else {
      selectedCharacter = characters[index];
    }
  }
}

function cycleMeter() {
  if (selectedMeter === "ALL") {
    selectedMeter = 0;
  } else if (selectedMeter === 0) {
    selectedMeter = 1;
  } else if (selectedMeter === 1) {
    selectedMeter = 2;
  } else if (selectedMeter === 2) {
    selectedMeter = 3;
  } else {
    selectedMeter = "ALL";
  }
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

function touchMoved() {
  if (touches.length > 0) {
    scrollOffset += movedY * -1;

    let visible = getVisibleCombos();
    let totalHeight = visible.length * rowHeight;
    let visibleHeight = height - startY;
    let maxScroll = max(0, totalHeight - visibleHeight);

    scrollOffset = constrain(scrollOffset, 0, maxScroll);
  }
  return false; // prevents browser scroll
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
