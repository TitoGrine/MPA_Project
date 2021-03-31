let img_interior = [];
let img_middle = [];
let img_exterior = [];
let fundo;

let sounds = [];

let angles = [30, 31, 32];
let nrFiles = 15;
let imgNr = [0, 0, 0];
let soundFile = [null, null, null];

const startNum = 7;
let pause = false;

let fft;
let compressors = new Array(nrFiles);
let volume = 0.4;
let url;
let rateDelta = 0.0075;

p5.disableFriendlyErrors = true;

function preload() {
  fundo = loadImage("fundo.png");

  compressors.fill([
    new p5.Compressor(),
    new p5.Compressor(),
    new p5.Compressor(),
  ]);

  for (let i = 0; i < nrFiles; i++) {
    img_interior[i] = loadImage(`images/scene_interior/img_${i}.png`);
    img_middle[i] = loadImage(`images/scene_middle/img_${i}.png`);
    img_exterior[i] = loadImage(`images/scene_exterior/img_${i}.png`);
    sounds[i] = [
      loadSound(`sounds/inner/inner_${i}.ogg`),
      loadSound(`sounds/middle/middle_${i}.ogg`),
      loadSound(`sounds/outer/outer_${i}.ogg`),
    ];

    sounds[i].forEach((file, index) => {
      file.setVolume(volume);
      file.disconnect();
      compressors[i][index].process(file);
    });

    sounds[i][1].pan(-0.6);
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

  fft = new p5.FFT(0.2, 256);
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

const normalSounds = () => {
  soundFile = soundFile.map((_, index) => sounds[imgNr[index]][index]);
};

const steelDrumsSounds = () => {
  soundFile = soundFile.map((_, index) => sounds[13][index]);
};

const pianoSounds = () => {
  soundFile = soundFile.map((_, index) => sounds[14][index]);
};

const marimbaSounds = () => {
  soundFile = soundFile.map((_, index) => sounds[6][index]);
};

function refreshSounds() {
  soundFile.forEach((file) => {
    file.stop();
  });

  if (pause) return;

  switch (url) {
    case "/":
      normalSounds();
      break;
    case "/steel_drums":
      steelDrumsSounds();
      break;
    case "/piano":
      pianoSounds();
      break;
    case "/marimba":
      marimbaSounds();
      break;
    default:
      minimalDraw();
      break;
  }

  soundFile.forEach((file, index) => {
    file.setVolume(volume);
    file.rate(1.0 + rateDelta * index);
    file.loop();
  });
}

function mouseMoved() {
  if (url !== "/") return;

  let x = int(map(mouseX, 0, width, 0, 5));
  let y = int(map(mouseY, 0, height, 0, 3));

  let num = 5 * y + x;

  if (num !== imgNr[0]) {
    imgNr = [num, num, num];

    refreshSounds();
  }
}

function mouseWheel(event) {
  volume = max(0, min(volume - event.deltaY / 60, 1));

  soundFile.forEach((file) => {
    file.setVolume(volume);
  });
}

function mousePressed() {
  if (url === "/") return;

  let d = int(dist(width / 2, height / 2, mouseX, mouseY));
  let i = int(((d / min(height / 2, width / 2)) * 3) / 0.75);
  let randomNum = int(random(nrFiles));

  if (i > 2) return;

  imgNr[i] = randomNum;

  rateDelta = random(0.001, 0.01);

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
      return "#FCC1B1";
    case 1:
      return "#FBA289";
    case 2:
      return "#FBB19D";
    default:
      return "#000";
  }
};

const normalDraw = () => {
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
};

const minimalDraw = () => {
  background("#FBB19D");
  scale(0.75);
  push();
  scale(min(height / 1080, width / 1080));
};

function draw() {
  switch (url) {
    case "/":
      normalDraw();
      break;
    default:
      minimalDraw();
      break;
  }

  image(fundo, 0, 0);

  angles = angles.map(
    (angle, index) => (angle + 30 + (url === "/" ? index : 0)) % 360
  );

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

  if (url === "/") ellipse(0, 0, 1082, 1082);
  pop();
}

// The actual router, get the current URL and generate the corresponding template
let router = (evt) => {
  url = "/" + window.location.hash.slice(1);

  refreshSounds();
};

// For first load or when routes are changed in browser url box.
window.addEventListener("load", router);
window.addEventListener("hashchange", router);
