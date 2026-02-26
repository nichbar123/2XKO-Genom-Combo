let combos = [];
let nodes = [];

function preload() {
  combos = loadJSON("combo_genome.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log("Loaded combos:", combos);  // verify it's an array
  buildNodes();
}

function buildNodes() {
  nodes = combos.map(c => {
    let genome = c.genome || [];

    let length = genome.length;
    let damage = c.damage || 0;

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

    let superDensity = counts.super / max(1, length);

    return {
      character: c.character_1 || "Unknown",
      damage,
      meter: c.meter_cost || 0,
      length,
      dominant,
      superDensity,
      genome,
      x: 0,
      y: 0,
      size: 0
    };
  });

  let maxLen = max(nodes.map(n => n.length));
  let maxDmg = max(nodes.map(n => n.damage));

  nodes.forEach(n => {
    n.x = map(n.length, 0, maxLen, 100, width - 100);
    n.y = map(n.damage, 0, maxDmg, height - 100, 100);
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
  line(80, height - 80, width - 50, height - 80); // X
  line(80, height - 80, 80, 50); // Y

  noStroke();
  fill(150);
  text("Combo Length →", width / 2, height - 40);
  push();
  translate(30, height / 2);
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
      return color(100, 200, 255);
    case "medium":
      return color(100, 255, 150);
    case "heavy":
      return color(255, 120, 120);
    case "super":
      return color(200, 100, 255);
    case "assist":
      return color(255, 200, 100);
    case "dash":
      return color(180);
    default:
      return color(120);
  }
}

function drawTooltip() {
  let hovered = nodes.find(n =>
    dist(mouseX, mouseY, n.x, n.y) < n.size / 2
  );

  if (hovered) {
    fill(0, 220);
    rect(mouseX + 10, mouseY + 10, 260, 110);

    fill(255);
    textSize(12);
    text(
      `Character: ${hovered.character}
Damage: ${hovered.damage}
Length: ${hovered.length}
Meter: ${hovered.meter}
Dominant: ${hovered.dominant}`,
      mouseX + 20,
      mouseY + 30
    );
  }
}

function mousePressed() {
  let clicked = nodes.find(n =>
    dist(mouseX, mouseY, n.x, n.y) < n.size / 2
  );

  if (clicked) {
    console.log("=== COMBO GENOME ===");
    console.table(clicked.genome);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  buildNodes();
}
