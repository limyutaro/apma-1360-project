// Template obtained from::
// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// https://thecodingtrain.com/CodingChallenges/107-sandpiles.html

// Sandpiles video tutorial by Coding Train
// https://youtu.be/diGjw5tghYU


// Define colors as desired
let colors = [
  [8, 80, 239], //navy
  [125, 171, 243], //cyan
  [246, 193, 68], //yellow
  [113, 19, 11], //burgundy
  [0, 140, 92], //deep green
  [255, 255, 255], //purple
];

let defaultColor = colors[0];
let defaultNum = 0

let sandpiles;
let nextpiles;

function setup() {
  /////////////////////// CANVAS SETUP ///////////////////////
  // Change canvas dimension as desired. This is square by default
  canvasDim = 500
  createCanvas(canvasDim, canvasDim);
  pixelDensity(1);

  sandpiles = new Array(width).fill().map(i => new Array(height).fill(defaultNum));
  nextpiles = new Array(width).fill().map(i => new Array(height).fill(0));

  /////////////////////// INITIAL STACKS ///////////////////////
  // placing initial stack in center of canvas. You may change the position as necessary
  initialStackSize = 524288;
  sandpiles[width / 2][height / 2] = initialStackSize;
  
  // placing a second stack at position of choice. Comment out, if undesired
  // secondStackSize = 65536;
  // sandpiles[width / 2 + 87][height / 2 - 36] = secondStackSize;
  
  ////////////////// PERTURBATIONS AT FIXED LOCATION //////////////////
  //perturbation location, relative to center of canvas
  // wplus = 95
  // hplus = 0
  
  // 1%, 2%, 5%, 15%, 40%, 100% of 655536 is 655, 1310, 3276, 9830, 26214, 65536 grains respectively
  
  // first perturbation
  // sandpiles[wplus + width / 2][hplus + height / 2] = 70000;
  
  // second perturbation
  // sandpiles[255][-55 + height / 2] = 26214;
  
  ////////////// RANDOM PERTURBATIONS CENTERED AT ORIGIN //////////////
  perturbSize = 0 // total number of grains to be dropped
  dropRadius = 95 // usually, radius of the stack
  dropScale = 1.1 // scaling to account for growth in radius resulting from perturbations
  dropDiameter = 2 * (Math.floor(dropRadius * dropScale)) // dimension of drop zone of random grains
  indent = (canvasDim - dropDiameter) / 2 // distance between boundary of canvas and boundary of drop zone
  
  for (let i = 0; i < perturbSize; i++) {
    randomWidth = indent + Math.floor((Math.random() * dropDiameter));
    randomHeight = indent + Math.floor((Math.random() * dropDiameter));
    sandpiles[randomWidth][randomHeight]++;
  }
  
  /////// RANDOM PERTURBATIONS FROM MORE SPECIFIC PARTS OF CANVAS //////
  // topLeftX = 200 // x coord for top left corner of the drop zone
  // topLeftY = 100 // y coord for top left corner of the drop zone
  // perturbZone = 20 //width of square drop zone
  // for (let i = 0; i < perturbSize; i++) {
  //   randomWidth = topLeftX + Math.floor((Math.random() * perturbZone));
  //   randomHeight = topLeftY + Math.floor((Math.random() * perturbZone));
  //   sandpiles[randomWidth][randomHeight]++;
  // }

  background(defaultColor[0], defaultColor[1], defaultColor[2]);
}


//////////////////// FUNCTIONS THAT DO THE TOPPLING ////////////////////
function topple() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      nextpiles[x][y] = sandpiles[x][y];
    }
  }

  // adjust the critical height if needed
  criticalHeight = 4;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let num = sandpiles[x][y];
      if (num >= criticalHeight) {
        nextpiles[x][y] -= 4;
        if (x + 1 < width)
          nextpiles[x + 1][y]++;
        if (x - 1 >= 0)
          nextpiles[x - 1][y]++;
        if (y + 1 < height)
          nextpiles[x][y + 1]++;
        if (y - 1 >= 0)
          nextpiles[x][y - 1]++;
      }
    }
  }

  let tmp = sandpiles;
  sandpiles = nextpiles;
  nextpiles = tmp;
}

function render() {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let num = sandpiles[x][y];
      let col = defaultColor;
      // depending on critical height, adjust if-statements accordingly, so that each pixel has correct coloring
      if (num == 0) {
        col = colors[0];
      } else if (num == 1) {
        col = colors[1];
      } else if (num == 2) {
        col = colors[2];
      } else if (num == 3) {
        col = colors[3];
      } else if (num == 4) {
        col = colors[4];
      } else if (num == 5) {
        col = colors[5];
      }

      let pix = (x + y * width) * 4;
      pixels[pix] = col[0];
      pixels[pix + 1] = col[1];
      pixels[pix + 2] = col[2];
      // pixels[pix + 3] = 255;
    }
  }

  updatePixels();
}

function draw() {
  render();

  // Lower topplesPerRender gives smoother (but slower) graphics. Recommended is 100.
  topplesPerRender = 100;
  for (let i = 0; i < topplesPerRender; i++) {
    topple();
  }

  // Prints radius of the pattern formed, in the console. The printed integer represents the number of boxes (with height 0) from middle row of the left edge of canvas to the boundary of the "circle" created by pattern.
  // let col = 0
  // let row = height / 2
  // while (col < width / 2 && sandpiles[row][col] == defaultNum) {
  //   col++
  // }
  // print(col)
}