$(document).ready(function(){
  // global vars
  gameAreaW = $('#game-area').width();
  gameAreaH = $('#game-area').height();
  grid = new Grid(40, 40);
  snake = new Snake();
  foods = [];
  //initializers
  grid.initialize();


  //detect arrow keypresses
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        snake.direction = "l";
        break;
        case 38: // up
        snake.direction = "u";
        break;
        case 39: // right
        snake.direction = "r";
        break;
        case 40: // down
        snake.direction = "d";
        break;
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
    this.positionArr = [[10,10],[11,10],[12,10]];

    this.addPiece = function(){
      var tailPosition = this.positionArr[this.positionArr.length - 1];
      this.updatePosition();
      this.positionArr.push(tailPosition);
    }

    this.updatePosition = function(){
      switch(this.direction){
        case 'l':
          //do this
          this.positionArr.unshift([this.positionArr[0][0] - 1,
                                 this.positionArr[0][1]]);
          this.positionArr.pop();
          break;
        case 'r':
          //do this
          this.positionArr.unshift([this.positionArr[0][0] + 1,
                                 this.positionArr[0][1]]);
          this.positionArr.pop();
          break;
        case 'u':
          //do this
          this.positionArr.unshift([this.positionArr[0][0],
                                 this.positionArr[0][1] - 1]);
          this.positionArr.pop();
            break;
        case 'd':
          //do this
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

  }


  //MAINTHREAD
  render();

  function Gameloop(){
   setTimeout(function(){

     snake.updatePosition();

     if(foods.length < 3){
       generateFood();
     }

     for(var i = 0; i<foods.length; i++){
       if(snake.positionArr[0][0] == foods[i].x && snake.positionArr[0][1] == foods[i].y){
         foods.splice(i,1);
         snake.addPiece();
       }
     }

     if (snake.positionArr[0][0] < 0 || snake.positionArr[0][0] > grid.width -1 ||
         snake.positionArr[0][1] < 0 || snake.positionArr[0][1] > grid.height -1){
           alert("GAME OVER");
           return;
         }
         
      for(var i = 1; i < snake.positionArr.length; i++){
        if(snake.positionArr[0][0] == snake.positionArr[i][0]&&  //headx ==
           snake.positionArr[0][1] == snake.positionArr[i][1]){
             alert("GAME OVER");
             return;
           }
      }




     render();
     Gameloop();
 }, 100);
 }
  Gameloop();



});
