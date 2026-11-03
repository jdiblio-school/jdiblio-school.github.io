let racerXs = [30, 20, 30, 30];
let startY = 50;
let yStep = 60;
let finishX = 560;

function setup() {
  createCanvas(600, startY + yStep * racerXs.length);
}

function draw() {
  background(240);
  line(finishX, 0, finishX, height);

  for (let i = 0; i < racerXs.length; i++) {
    let y = startY + yStep * i;
    if (racerXs[i] < finishX) {
      racerXs[i] += random(1, 3);
    }

    if (key === 'r' || key === 'R') {
      racerXs[i] = 30;
    }

    circle(racerXs[i], y, 24);
    
  }



  let leader = 0
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("leader: " + leader, width / 2, 20);
}