let img_interior = [];
let img_meio = [];
let img_exterior = [];
let fundo;

let angle = 0;
let nrFiles = 18;
let imgNr = [0, 0, 0];

p5.disableFriendlyErrors = true;

function preload() {
  fundo = loadImage("fundo.png");

  for (let i = 0; i < nrFiles; i++) {
    img_interior[i] = loadImage("cena_interior/img_" + String(i) + ".png");
  }

  for (let i = 0; i < nrFiles; i++) {
    img_meio[i] = loadImage("cena_meio/img_" + String(i) + ".png");
  }

  for (let i = 0; i < nrFiles; i++) {
    img_exterior[i] = loadImage("cena_exterior/img_" + String(i) + ".png");
  }
}

function setup() {
  createCanvas(0.8 * windowWidth, 0.8 * windowHeight, WEBGL);
  frameRate(12);
  imageMode(CENTER);
  angleMode(DEGREES);

  for (let i = 0; i < nrFiles; i++) {
    imgNr[i] = int(random(nrFiles));
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

function mousePressed() {
  let d = int(dist(width / 2, height / 2, mouseX, mouseY));
  let i = int((d / min(height / 2, width / 2)) * 3);
  // let i = int(random(3));
  imgNr[i] = int(random(nrFiles));
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

  return false;
}

function draw() {
  background(255);
  angle += 30;
  rotate(angle);
  scale(min(height / 1080, width / 1080));
  image(fundo, 0, 0);
  image(img_exterior[imgNr[2]], 0, 0);
  image(img_meio[imgNr[1]], 0, 0);
  image(img_interior[imgNr[0]], 0, 0);
  stroke(29, 28, 131);
  strokeWeight(6);
  noFill();
  ellipse(0, 0, 362, 362);
  ellipse(0, 0, 722, 722);
}
