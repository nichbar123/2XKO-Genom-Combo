let combos = [];

function preload() {
  loadJSON("combo_genome.json", data => {
    if (Array.isArray(data)) {
      combos = data;
    } else {
      combos = Object.values(data);
    }
    console.log("Loaded combos:", combos.length);
  });
}

function setup() {
  createCanvas(windowWidth, 2000);  // temporary fixed height
  noLoop();
}

function draw() {
  background(15);

  let rowHeight = 18;
  let boxWidth = 15;

  combos.forEach((combo, i) => {
    if (!combo.categories) return;

    combo.categories.forEach((cat, j) => {
      fill(colorFor(cat));
      rect(
        50 + j * boxWidth,
        i * rowHeight,
        boxWidth - 2,
        rowHeight - 2
      );
    });
  });
}

function colorFor(cat) {
  switch(cat) {
    case "normal": return "#4ade80";
    case "special": return "#60a5fa";
    case "assist": return "#facc15";
    case "super": return "#f87171";
    default: return "#a1a1aa";
  }
}
