let img_interior = [];
let img_middle = [];
let img_exterior = [];
let fundo;

let sounds = [];

let angle = 0;
let nrFiles = 18;
let imgNr = [0, 0, 0];
let soundFile = [null, null, null];

const numLoops = 6;

p5.disableFriendlyErrors = true; 

let synth;

function preload() {
  fundo = loadImage("fundo.png");

  for (let i = 0; i < nrFiles; i++) {
    img_interior[i] = loadImage(`images/scene_interior/img_${i}.png`);
    img_middle[i] = loadImage(`images/scene_middle/img_${i}.png`);
    img_exterior[i] = loadImage(`images/scene_exterior/img_${i}.png`);
  }

  for (let i = 0; i < numLoops; i++) {
    sounds[i] = [
      loadSound(`sounds/inner/inner_${i}.ogg`),
      loadSound(`sounds/middle/middle_${i}.ogg`),
      loadSound(`sounds/outer/outer_${i}.ogg`),
    ];
  }

  synth = new p5.PolySynth();
}

function setup() {
  createCanvas(0.8 * windowWidth, 0.8 * windowHeight, WEBGL);
  frameRate(12);
  imageMode(CENTER);
  angleMode(DEGREES);

  for (let i = 0; i < 3; i++) {
    let randomNum = int(random(nrFiles));
    imgNr[i] = int(randomNum);

    if (randomNum < numLoops) soundFile[i] = sounds[randomNum][i];
  }
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

  for (let i = 0; i < 3; i++) {
    soundFile[i] = imgNr[i] < numLoops ? sounds[imgNr[i]][i] : null;
  }

  soundFile.forEach((file) => {
    if (file !== null) file.loop();
  });
}

function mousePressed() {
  let d = int(dist(width / 2, height / 2, mouseX, mouseY));
  let i = int((d / min(height / 2, width / 2)) * 3);
  let randomNum = int(random(nrFiles));

  if(i > 2) return;

  imgNr[i] = randomNum;

  refreshSounds();
}

function deviceShaken() {
  let i = int(random(3));
  imgNr[i] = int(random(nrFiles));
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
    case "%":
      imgNr = [15, 15, 15];
      break;
    case "&":
      imgNr = [16, 16, 16];
      break;
    case "/":
      imgNr = [17, 17, 17];
      break;
    default:
      break;
  }

  refreshSounds();

  return false;
}

function draw() {
  background(255);
  angle += 30;
  rotate(angle);
  scale(min(height / 1080, width / 1080));
  image(fundo, 0, 0);
  image(img_exterior[imgNr[2]], 0, 0);
  image(img_middle[imgNr[1]], 0, 0);
  image(img_interior[imgNr[0]], 0, 0);
  stroke(29, 28, 131);
  strokeWeight(6);
  noFill();
  ellipse(0, 0, 362, 362);
  ellipse(0, 0, 722, 722);

  // synth.play("C4", 0.1, 0, 1);
}
