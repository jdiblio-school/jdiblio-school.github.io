//DISCLAIMER: I used online resources and AI to help me build this. I used Claude Sonnet 5.5 for help on how to get the collisions to work, generate a random maze, and corners of the player. (almost all of it on random maze that was hard) I used online resources and example games for insparation, different p5.js functions, etc. I added every comments all over this to help me stay organazed and help me truly understand what is happening. This whole project is inspired by the CodaKid python game known as "Catch The Coin" https://codakid.com/course-catalog/self-study/game-programming-with-python-catch-the-coin/

//VARIBLES

//where the player will start
let x = 45;
let y = 45;

//how may pixel the player moves each frame
let speed = 4;

//map of the maze
let grid;

//how many pixel wide and tall each grid piece is
let tileSize = 40;

//sets the players score at the start
let score = 0;

//sets the time variables for the timer (got the example from https://editor.p5js.org/xinxin/sketches/7NIDFVVw)
let time = 0;
let savedTime;
let totalTime = 1000;
let countEllipse = 0;

//makes the canvas exactly big enough to fit the maze
function setup() {
  //when changing up the size make sure both numbers are odd
  grid = makeMaze(19, 13);
  //pluh
  savedTime = millis();
  //sets the amount of coins
  coins = makeCoins(43);
  createCanvas(grid[0].length * tileSize, grid.length * tileSize);
}

function draw() {
  background(198, 198, 149);

  //draws the walls
  //picks which row to start with
  for (let row = 0; row < grid.length; row++) {
    //picks a column to start with
    for (let col = 0; col < grid[0].length; col++) {
      //askes if there's a wall or not based off GRID
      if (grid[row][col] === 1) {
        strokeWeight(1);
        fill(40, 80, 24);
        rect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }
  }

  //creates the coins
  fill("gold");
  //picks the coin to start with
  for (let i = 0; i < coins.length; i++) {
    //draws the coin
    ellipse(
      coins[i].col * tileSize + tileSize / 2,
      coins[i].row * tileSize + tileSize / 2,
      20
    );
  }

  //moves the player off player input if there isint a wall
  //is the key down?
  if (keyIsDown("a")) {
    //where the player would be after one step
    let newX = x - speed;
    if (touchingWall(newX, y) === false) {
      //takes the step
      x = newX;
    }
  }
  if (keyIsDown("d")) {
    let newX = x + speed;
    if (touchingWall(newX, y) === false) {
      x = newX;
    }
  }
  if (keyIsDown("w")) {
    let newY = y - speed;
    if (touchingWall(x, newY) === false) {
      y = newY;
    }
  }
  if (keyIsDown("s")) {
    let newY = y + speed;
    if (touchingWall(x, newY) === false) {
      y = newY;
    }
  }

  //collect coins (loop backwards because we remove items)
  for (let i = coins.length - 1; i >= 0; i--) {
    if (
      //measures distance
      dist(
        //players center
        x + 15,
        y + 15,
        //coins center
        coins[i].col * tileSize + tileSize / 2,
        coins[i].row * tileSize + tileSize / 2
      ) < 25
    ) {
      //cuts the coin from the list
      coins.splice(i, 1);
      //adds to the score
      score += 1;
    }
  }

  //creates the timer
  fill("gold");
  textSize(18);
  text("Time: " + time, 280, 25);

  let passedTime = millis() - savedTime;

  // Has time passed?
  if (passedTime > totalTime) {
    time += 1;

    savedTime = millis(); // Save the current time to restart the timer!
  }

  text("Use WASD to control the gnome", 380, 25);

  //draws the player
  drawGnome(x + 15, y + 15);

  //draws the score board
  fill("gold");
  textSize(18);
  text("Gold: " + score, 10, 25);
  text("Press r or R to reset", 90, 25);

  //win screen
  if (coins.length === 0) {
    fill("gold");
    textSize(40);
    stroke(0);
    strokeWeight(3);
    textAlign(CENTER, CENTER);
    text("You win! time was " + time + " secs", width / 2, height / 2);
    textAlign(LEFT, BASELINE);
  }
}
//end of draw

//checks if the player will touch a wall (1)
function touchingWall(px, py) {
  //all four corners of the players square
  let tlCol = floor(px / tileSize);
  let tlRow = floor(py / tileSize);

  let trCol = floor((px + 29) / tileSize);
  let trRow = floor(py / tileSize);

  let blCol = floor(px / tileSize);
  let blRow = floor((py + 29) / tileSize);

  let brCol = floor((px + 29) / tileSize);
  let brRow = floor((py + 29) / tileSize);

  if (
    grid[tlRow][tlCol] === 1 ||
    grid[trRow][trCol] === 1 ||
    grid[blRow][blCol] === 1 ||
    grid[brRow][brCol] === 1
  ) {
    return true;
  }
  return false;
}

//RESETING THE GAME
//resets the game if r or R is pressed
function keyPressed() {
  if (key === "r" || key === "R") {
    resetGame();
  }
}

//resets all values in the game
function resetGame() {
  x = 45;
  y = 45;
  score = 0;
  grid = makeMaze(19, 13);
  coins = makeCoins(43);
  time = 0;
}

//creates the gnomes body parts
function drawGnome(cx, cy) {
  push();
  noStroke();

  //body
  fill(58, 100, 170);
  ellipse(cx, cy + 6, 16, 16);

  //face
  fill(245, 205, 170);
  ellipse(cx, cy - 1, 12, 11);

  //beard
  fill(245);
  triangle(cx - 7, cy + 1, cx + 7, cy + 1, cx, cy + 13);

  //eyes
  fill(30);
  ellipse(cx - 3, cy - 2, 2, 2);
  ellipse(cx + 3, cy - 1, 2, 2);

  //hat
  fill(210, 40, 45);
  triangle(cx - 8, cy - 5, cx + 8, cy - 5, cx + 2, cy - 22);

  //hat brim
  fill(245, 50, 50);
  rect(cx - 8, cy - 6, 16, 3);

  pop();
}

//creating the random maze generator
function makeGrid(cols, rows) {
  //empty list that holds the rows
  let g = [];
  //runs for every row
  for (let r = 0; r < rows; r++) {
    let rowList = [];
    for (let c = 0; c < cols; c++) {
      //completes that row
      rowList.push(1);
    }
    g.push(rowList);
  }
  return g;
}

//makeGrid basically creates the grid for all the tiles but only 1s

//digs out the 0s into the grid
function makeMaze(cols, rows) {
  let g = makeGrid(cols, rows);
  g[1][1] = 0;
  let stack = [{ col: 1, row: 1 }];

  //the four directions. two steps each
  let directions = [
    { dc: 0, dr: -2 }, //up
    { dc: 2, dr: 0 }, //right
    { dc: 0, dr: 2 }, //down
    { dc: -2, dr: 0 }, //left
  ];

  while (stack.length > 0) {
    let current = stack[stack.length - 1];

    //look in all four directions for undug stone
    let options = [];
    for (let i = 0; i < directions.length; i++) {
      let newCol = current.col + directions[i].dc;
      let newRow = current.row + directions[i].dr;
      if (
        //this is the criteria to dig a 0 into the 1s
        newCol > 0 &&
        newCol < cols - 1 &&
        newRow > 0 &&
        newRow < rows - 1 &&
        g[newRow][newCol] === 1
      ) {
        options.push({ col: newCol, row: newRow });
      }
    }
    if (options.length > 0) {
      let chosen = random(options);
      g[chosen.row][chosen.col] = 0;
      g[(current.row + chosen.row) / 2][(current.col + chosen.col) / 2] = 0;
      stack.push(chosen);
    } else {
      stack.pop();
    }
  }
  //expected open tiles for the maze
  console.log(
    "[makeMaze] done | open tiles = " + g.flat().filter((v) => v === 0).length
  );
  return g;
}

//makeMaze essentially acts as a digger, digging through the grid creating a random layout everytime. First, it makes a list of directions it can go. Each step is 2 so that there is no entrance or exit. Then when it starts at the first point (45, 45), it uses an if statement to look in all directions for undug stone.

//finding open tiles for coins
function findOpenTiles() {
  let open = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === 0) {
        open.push({ col: col, row: row });
      }
    }
  }
  return open;
}

//makes the coins
function makeCoins(count) {
  let open = findOpenTiles();

  //take the start tile out of the hat
  open.splice(0, 1);

  let list = [];
  for (let i = 0; i < count; i++) {
    //random locker number
    let pick = floor(random(open.length));

    //put that spot on the coin list
    list.push(open[pick]);

    //remove it so it can't be picked again
    open.splice(pick, 1);
  }
  console.log("[makeCoins] done. made " + list.length + " coins");
  return list;
}
