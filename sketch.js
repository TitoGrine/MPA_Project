let img_interior = [];
let img_middle = [];
let img_exterior = [];
let fundo;

let sounds = [];

let angles = [31, 29, 31];
let nrFiles = 15;
let imgNr = [0, 0, 0];
let soundFile = [null, null, null];

const startNum = 7;
let pause = false;

let fft;

p5.disableFriendlyErrors = true;

function preload() {
  fundo = loadImage("fundo.png");

  for (let i = 0; i < nrFiles; i++) {
    img_interior[i] = loadImage(`images/scene_interior/img_${i}.png`);
    img_middle[i] = loadImage(`images/scene_middle/img_${i}.png`);
    img_exterior[i] = loadImage(`images/scene_exterior/img_${i}.png`);
    sounds[i] = [
      loadSound(`sounds/inner/inner_${i}.ogg`),
      loadSound(`sounds/middle/middle_${i}.ogg`),
      loadSound(`sounds/outer/outer_${i}.ogg`),
    ];

    sounds[i].forEach((file) => file.setVolume(0.5));

    sounds[i][1].rate(1.0075);
    sounds[i][1].pan(-0.6);
    sounds[i][2].rate(1.015);
    sounds[i][2].pan(0.6);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(12);
  imageMode(CENTER);
  angleMode(DEGREES);

  for (let i = 0; i < 3; i++) {
    imgNr[i] = startNum;
    soundFile[i] = sounds[startNum][i];
  }

  fft = new p5.FFT(0.3, 256);
}

if (window.DeviceOrientationEvent) {
  window.addEventListener(
    "orientationchange",
    function () {
      location.reload();
    },
    false
  );
}

function refreshSounds() {
  soundFile.forEach((file) => {
    if (file !== null) file.stop();
  });

  if (pause) return;

  for (let i = 0; i < 3; i++) {
    soundFile[i] = sounds[imgNr[i]][i];
  }

  soundFile.forEach((file) => {
    if (file !== null) file.loop();
  });
}

function mouseMoved() {
  let x = int(map(mouseX, 0, width, 0, 5));
  let y = int(map(mouseY, 0, height, 0, 3));

  let num = 5 * y + x;

  if (num !== imgNr[0]) {
    imgNr = [num, num, num];

    refreshSounds();
  }
}

function mousePressed() {
  let d = int(dist(width / 2, height / 2, mouseX, mouseY));
  let i = int(((d / min(height / 2, width / 2)) * 3) / 0.75);
  let randomNum = int(random(nrFiles));

  if (i > 2) return;

  imgNr[i] = randomNum;

  refreshSounds();
}

function keyPressed() {
  switch (key) {
    case "0":
      imgNr = [0, 0, 0];
      break;
    case "1":
      imgNr = [1, 1, 1];
      break;
    case "2":
      imgNr = [2, 2, 2];
      break;
    case "3":
      imgNr = [3, 3, 3];
      break;
    case "4":
      imgNr = [4, 4, 4];
      break;
    case "5":
      imgNr = [5, 5, 5];
      break;
    case "6":
      imgNr = [6, 6, 6];
      break;
    case "7":
      imgNr = [7, 7, 7];
      break;
    case "8":
      imgNr = [8, 8, 8];
      break;
    case "9":
      imgNr = [9, 9, 9];
      break;
    case "=":
      imgNr = [10, 10, 10];
      break;
    case "!":
      imgNr = [11, 11, 11];
      break;
    case '"':
      imgNr = [12, 12, 12];
      break;
    case "#":
      imgNr = [13, 13, 13];
      break;
    case "$":
      imgNr = [14, 14, 14];
      break;
    case "p":
      pause = !pause;
      break;
    default:
      return false;
  }

  refreshSounds();

  return false;
}

const getFill = (num) => {
  switch (num % 3) {
    case 0:
      return "#6019BD";
    case 1:
      return "#9792E3";
    case 2:
      return "#7107FA";
    default:
      return "#000";
  }
};

function draw() {
  background("#ADADDA");

  let rectWidth = width / 5;
  let rectHeight = height / 3;
  let halfWidth = width / 2;
  let halfHeight = height / 2;

  push();
  noStroke();
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 3; j++) {
      fill(getFill(5 * j + i));
      rect(
        i * rectWidth - halfWidth,
        j * rectHeight - halfHeight,
        rectWidth,
        rectHeight
      );
    }
  pop();

  scale(0.75);
  push();
  scale(min(height / 1080, width / 1080));
  push();
  beginShape();
  let spectrum = fft.analyze(1024);
  if (imgNr[0] < 2) fill("#3B0081");
  else fill("#1D1C83");
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let amp = spectrum[i];
    let angle = map(i, 0, spectrum.length, 0, 360);
    let r = map(amp, 0, 256, 545, 780);

    let x = r * cos(angle);
    let y = r * sin(angle);

    curveVertex(x, y);
  }
  endShape();
  pop();
  image(fundo, 0, 0);

  console.log(angles);
  angles = angles.map(
    (angle, index) => (angle + 30 + (index === 1 ? -1 : 1)) % 360
  );
  console.log(angles);

  push();
  rotate(angles[2]);
  image(img_exterior[imgNr[2]], 0, 0);
  pop();

  push();
  rotate(angles[1]);
  image(img_middle[imgNr[1]], 0, 0);
  pop();

  push();
  rotate(angles[0]);
  image(img_interior[imgNr[0]], 0, 0);
  pop();

  if (imgNr[0] < 2) stroke("#3B0081");
  else stroke("#1D1C83");
  strokeWeight(6);
  noFill();
  ellipse(0, 0, 362, 362);
  ellipse(0, 0, 722, 722);
  ellipse(0, 0, 1082, 1082);
  pop();
}
