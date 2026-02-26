let combos = [];
let nodes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");

  loadJSON("combo_genome.json", data => {
    console.log("JSON LOADED:", data);

    combos = Array.isArray(data)
      ? data
      : Object.values(data);

    console.log("Combos length:", combos.length);

    buildNodes();
  });
}

function buildNodes() {
  nodes = [];

  combos.forEach(c => {
    if (!c.genome || c.genome.length === 0) return;

    let damage = Number(c.damage);
    if (isNaN(damage)) damage = 0;

    let meter = Number(c.meter_cost);
    if (isNaN(meter)) meter = 0;

    let genome = c.genome;

    let counts = {
      light: 0,
      medium: 0,
      heavy: 0,
      super: 0,
      assist: 0,
      dash: 0,
      jump: 0
    };

    genome.forEach(g => {
      if (counts[g.type] !== undefined) {
        counts[g.type]++;
      }
    });

    let dominant = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    let superDensity = counts.super / genome.length;

    nodes.push({
      character: c.character_1 || "Unknown",
      damage: damage,
      meter: meter,
      length: genome.length,
      dominant: dominant,
      superDensity: superDensity,
      genome: genome,
      x: 0,
      y: 0,
      size: 0
    });
  });

  if (nodes.length === 0) return;

  let maxLen = Math.max(...nodes.map(n => n.length)) || 1;
  let maxDmg = Math.max(...nodes.map(n => n.damage)) || 1;

  nodes.forEach(n => {
    n.x = map(n.length, 0, maxLen, 120, width - 80);
    n.y = map(n.damage, 0, maxDmg, height - 100, 80);
    n.size = map(n.superDensity, 0, 1, 6, 40);
  });
}

function draw() {
  background(10);

  drawAxes();

  nodes.forEach(n => {
    drawNode(n);
  });

  drawTooltip();
}

function drawAxes() {
  stroke(80);
  line(100, height - 80, width - 60, height - 80);
  line(100, height - 80, 100, 60);

  noStroke();
  fill(150);
  textSize(14);
  text("Combo Length →", width / 2, height - 30);

  push();
  translate(40, height / 2);
  rotate(-HALF_PI);
  text("Damage →", 0, 0);
  pop();
}

function drawNode(n) {
  let c = colorForType(n.dominant);

  strokeWeight(n.meter > 0 ? 2 : 0);
  stroke(n.meter > 0 ? color(255, 200, 0) : 0);

  fill(c);
  ellipse(n.x, n.y, n.size);
}

function colorForType(type) {
  switch (type) {
    case "light":
      return color(120, 200, 255);
    case "medium":
      return color(120, 255, 170);
    case "heavy":
      return color(255, 120, 120);
    case "super":
      return color(200, 120, 255);
    case "assist":
      return color(255, 220, 120);
    case "dash":
      return color(180);
    default:
      return color(140);
  }
}

function drawTooltip() {
  let hovered = nodes.find(n =>
    dist(mouseX, mouseY, n.x, n.y) < n.size / 2
  );

  if (!hovered) return;

  fill(0, 220);
  rect(mouseX + 12, mouseY + 12, 280, 120);

  fill(255);
  textSize(12);
  text(
`Character: ${hovered.character}
Damage: ${hovered.damage}
Length: ${hovered.length}
Meter: ${hovered.meter}
Dominant: ${hovered.dominant}
Super Density: ${hovered.superDensity.toFixed(2)}`,
    mouseX + 20,
    mouseY + 32
  );
}

function mousePressed() {
  let clicked = nodes.find(n =>
    dist(mouseX, mouseY, n.x, n.y) < n.size / 2
  );

  if (clicked) {
    console.log("=== GENOME ===");
    console.table(clicked.genome);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildNodes();
}

console.log("SKETCH LOADED");


function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  buildNodes();
}
