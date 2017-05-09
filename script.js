$(document).ready(function(){
  // global vars
  gameAreaW = $('#game-area').width();
  gameAreaH = $('#game-area').height();
  grid = new Grid(40, 40);
  snake = new Snake();
  foods = [];
  gameRunning = false;
  score = 0;

  //initialise the grid
  grid.initialize();

  //detect arrow keypresses
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        if (gameRunning && snake.direction != "r"){snake.direction = "l";}
        break;
        case 38: // up
        if (gameRunning && snake.direction != "d"){snake.direction = "u";}
        break;
        case 39: // right
        if (gameRunning && snake.direction != "l"){snake.direction = "r";}
        break;
        case 40: // down
        if (gameRunning && snake.direction != "u"){snake.direction = "d";}
        break;
        case 32:
        if (!gameRunning){
          gameRunning = true;
        }
        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });

//The grid Gameobject
  function Grid(width, height){
    this.width = width;
    this.height = height;

    this.initialize = function(){
    // generate a grid
      for (var x=0; x<this.width; x++){
        for (var y=0; y<this.height; y++){
          $('#game-area').append("<div class='block' id='block" + y + "-" + x + "'> </div>");
        }
      }
    //calculate block size
      var blockSize = (gameAreaW/this.width) - 2; //2 is border-width*2
      $('.block').width(blockSize);
      $('.block').height(blockSize);
    }
  };

  //The snake Gameobject
  function Snake(){
    this.direction = "l";
    this.positionArr = [[20,20],[21,20],[22,20]];

    this.addPiece = function(){
      var tailPosition = this.positionArr[this.positionArr.length - 1];

      this.positionArr.push(tailPosition);
    }

    //Move snake in current direction
    this.updatePosition = function(){
      switch(this.direction){
        case 'l':  //Left
          this.positionArr.unshift([this.positionArr[0][0] - 1,
                                 this.positionArr[0][1]]);
          this.positionArr.pop();
          break;
        case 'r':   //Right
          this.positionArr.unshift([this.positionArr[0][0] + 1,
                                 this.positionArr[0][1]]);
          this.positionArr.pop();
          break;
        case 'u':   //Up
          this.positionArr.unshift([this.positionArr[0][0],
                                 this.positionArr[0][1] - 1]);
          this.positionArr.pop();
            break;
        case 'd':    //Down
          this.positionArr.unshift([this.positionArr[0][0],
                                 this.positionArr[0][1] + 1]);
          this.positionArr.pop();
            break;
      }
    }
  }

  //The Food Object
  function Food(posX,posY){
    this.x = posX;
    this.y = posY;
  }


  var generateFood = function(){
    var f = new Food(Math.floor(Math.random() * grid.width), Math.floor(Math.random() * grid.height))
    foods.push(f);
  }

  var render = function(){
      $('.block').css('background-color', 'white');

      for (var i=0; i < snake.positionArr.length; i++){
        $('#block' + snake.positionArr[i][0] + '-' + snake.positionArr[i][1]).css('background-color', 'green');
      }
      for (var i=0; i < foods.length; i++){
        $('#block' + foods[i].x + '-' + foods[i].y).css('background-color', 'red');
      }
      $('#block' + snake.positionArr[0][0] + '-' + snake.positionArr[0][1]).css('background-color', 'orange');
      $('#score').html(score);
  }

  var checkCollision = function(){
    //Snake ------- Food
    for(var i = 0; i<foods.length; i++){
      if(snake.positionArr[0][0] == foods[i].x && snake.positionArr[0][1] == foods[i].y){
        foods.splice(i,1);
        snake.addPiece();
        snake.addPiece();
        snake.addPiece();
        score += 1;
      }
    }

    //snake --------- Walls
    if (snake.positionArr[0][0] < 0 || snake.positionArr[0][0] > grid.width -1 ||
        snake.positionArr[0][1] < 0 || snake.positionArr[0][1] > grid.height -1){
          GameOver();
        }

    //snake ----------- own body
    for(var i = 1; i < snake.positionArr.length; i++){
      if(snake.positionArr[0][0] == snake.positionArr[i][0]&&
        snake.positionArr[0][1] == snake.positionArr[i][1]){
         GameOver();
        }
    }
  }

//Calls on Death
  var GameOver = function(){
    gameRunning = false;
    alert("GAME OVER")
    GameReset();
  }

//Reset the game state after dying
  var GameReset = function(){
    snake.positionArr = [[20,20],[21,20],[22,20]];
    snake.direction = "l";
    foods = [];
    score = 0;
  }

//The main game loop
  var Gameloop = function(){
    setTimeout(function(){

      if (gameRunning){
        snake.updatePosition();
        checkCollision();
      }

      if(foods.length < 3){
        generateFood();
      }

      render();
      Gameloop();
  }, 50);
  }

//Render game area and begin gameloop
render();
Gameloop();

});
