//-----Global Variables-----
var ctx = document.getElementById('canvas').getContext('2d');
var clr = document.getElementById('clear').addEventListener('click',clear)
var run; //For globale setInterval();
var start = 0;

//-----Stage-----
var stageWd = document.getElementById('canvas').width;
var stageHt = document.getElementById('canvas').height;
var score = false;

//-----Bridge-----
var m;//gradient
var c;//y coordinate
var bridges = [];//To store all path coordinates
var pathXY = [];//To store start & end coordinates for each path
var path = 0;//To keep count on the number of paths

//-----Ball-----
  var ballR = 10;
  var ballX = Math.floor(Math.random()*(stageWd-(ballR*2)))+ballR;
  var ballY = Math.floor(Math.random()*(stageHt/2)+ballR);

//-----Goal-----
  var goalR = 15
  var goalX = Math.floor(Math.random()*(stageWd-(goalR*2)))+goalR;
  var goalY = Math.floor(Math.random()*(stageHt-(goalR*2)))+goalR;

//-----Distance Varialbles-----
  var deltaX, deltaY, pXY;
  distance();

//----Gravity-----
  var vY = 1;
  var gY = 0.1;
  var vX = 0; // Velocity in X-axis
  var aX = 0; //Velocity in Y-axis

//----Event Listeners-----
  $('#canvas').mousedown(down);
  $('#canvas').mouseup(lift);
  $('#start').click(function(){start = 1;});

//---Interval---
run = setInterval(draw,20);

function down(){
  var top = document.getElementById('canvas').offsetTop;
  var left = document.getElementById('canvas').offsetLeft;
  pathXY.push((event.clientX)-left);//Collect start x-cord
  pathXY.push((event.clientY)-top);//collect start y-cord
}

function lift(){
  var top = document.getElementById('canvas').offsetTop;
  var left = document.getElementById('canvas').offsetLeft;
  pathXY.push((event.clientX)-left);//collect end X-cord
  pathXY.push((event.clientY)-top);//collect end Y-cord
  bridges.push(pathXY);// pushing path cords into bridge array for storing
  pathXY=[];//clear array for the next path input
  path++;//increment path count
}

function draw(){
  refresh();
  bridge();
  goal();
  if(score===true){
      clearInterval(run);
    }
  ball();
  detectGoal();
  }

function goal(){
  ctx.save();
  ctx.beginPath();
  ctx.arc(goalX, goalY, goalR ,0 ,2*Math.PI, true);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.restore();
}

function bridge(){ //Drawn line
    for(i=0; i<path; i++){
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(bridges[i][0],bridges[i][1]);
      ctx.lineTo(bridges[i][2],bridges[i][3]);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.restore();
      if(bridges[i].length=4){
        m = Number(((bridges[i][3] - bridges[i][1])/(bridges[i][2] - bridges[i][0])).toFixed(6)); //Calculates gradient
        c = Number((bridges[i][1] - (m*bridges[i][0])).toFixed(6)); // Calculates y-intercept
        bridges[i].push(m); //Calculates gradient
        bridges[i].push(c); // Calculates y-intercept
        m=0;c=0;
      }
    }

    //-----The following lines of code is to draw another line within the
    //-----previous one to confirm where the lineWidth is extended from.
    // ctx.beginPath();
    // ctx.moveTo(xStart,yStart);
    // ctx.lineTo(xEnd,yEnd);
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = 'red';
    // ctx.stroke();

    // console.log("Gradient =" + m, "C :" + c  );
    //----The following are test codes to test out line equation in the game.
    //----Note that gradient values in canvas are negative of gradients drawn in reality
    //----Reason is in <canvas> the coordinates below the origin are considered positive values.
    // var tX, tY, tXX, tYY;
    // tY = yStart + 50;//displace line to test gradient
    // tX = xStart; tXX = xEnd;
    // tYY = (m*tXX) + (c+50);
    // ctx.beginPath();
    // ctx.moveTo(tX,tY);
    // ctx.lineTo(tXX,tYY);
    // ctx.stroke();
  }

function ball(){
  ctx.save();
  ctx.beginPath();
  ctx.arc(ballX,ballY,ballR,0,2*Math.PI,true);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 1;
  // ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "red";
  ctx.strokeRect(ballX, ballY, 1, 1);
  ctx.restore();

    if(start===1){
      //-----Changes in Y-axis movement
      vY = Number((vY + gY).toFixed(6));
      ballY = Number((ballY + vY).toFixed(6));

      //-----Changes in X-axis movement
      if(aX>0){
        aX = Number((aX-0.005).toFixed(6));//Air Resistance
      }
      else{
        aX = Number((aX+0.005).toFixed(6));
      }
      vX = Number((vX + aX).toFixed(6));
      ballX = Number((ballX + vX).toFixed(6));

      //------Ball control at bottom edge
      if((ballY+ballR) >= stageHt){
        ballY = stageHt-ballR;
        vY = Number((vY*(-0.8)).toFixed(6));

        if(vX!=0){
          vX = Number((vX*0.9).toFixed(6))//Friction Variable
        }

        if((gY>=-1 && gY<1) && (vY>=-0.5 && vY<0.5) && (vX>=-0.3 && vX<0.3) && (aX>=-0.1 && aX<0.1)){
          clearInterval(run);
        }
    }
  }

  //-----Ball control after colliding right edge
  if((ballX+ballR) >= stageWd){
    ballX = stageWd-ballR;
    aX = Number((m*(-0.01)).toFixed(6));
    vX = Number((vX*(-0.5).toFixed(6)));
    }

  //-----Ball control after colliding left edge
  if((ballX-ballR) <= 0){
    ballX = ballR+0;
    aX = Number((m*(-0.01)).toFixed(6));
    vX = Number((vX*(-0.5).toFixed(6)));
    }

  //----Bounce with multiple bridges-----
  if(bridges[0]!=undefined){
    for(i=0; i<path; i++){
      //Using ballX to calculate the height ball has to stop
      if(ballX>bridges[i][0] && ballX<bridges[i][2]){
        console.log("Ball is above path "+ i);
        var calY = Number(((bridges[i][4]*ballX)+bridges[i][5]).toFixed(3));
        console.log("Between X1:"+ bridges[i][0] + " , X2:" + bridges[i][2] + ", CalY:" + calY );
        console.log("vX: "+ vX + " , vY:" + vY);


      //Influencing ball's velocity in X-direction

      if((ballY+ballR) >= (calY-5) && (ballY+ballR)<=(calY+ 17)){
        ballY = calY - ballR;//updating ballY to calculated y-position
          if(bridges[i][4]>=0){

            if(vX===0){
              aX = Number((bridges[i][4]*(0.3)).toFixed(6));
              vX = 1;
            }
            else{
              aX = Number((bridges[i][4]*(0.3)).toFixed(6));
              vX = Number((vX*1.1).toFixed(6));
            }

          }
          else{
            if(vX===0){
              aX = Number((bridges[i][4]*(0.3)).toFixed(6));
              vX = -1;
            }
            else{
              aX = Number((bridges[i][4]*(0.3)).toFixed(6));
              vX = Number((vX*1.1).toFixed(6));
            }
          }

        //Influencing ball's velocity in Y-direction
          vY = Number((vY*(-0.95)).toFixed(6));
          }
        }
      }
    }

}

function detectGoal(){
  distance();
  console.log("pXY :" + pXY, " ballY :"+ ballY, "goalY :"+ goalY,"ballX :"+ ballX, "goalX :"+ goalX)
  if(pXY<(ballR+goalR)-10){
    ballX = goalX;
    ballY = goalY;
    score = true;
    scoreMsg();
  }
}

function distance(){ // To calculated the distance between the ball and the goal
  deltaX = Math.pow(Number((ballX - goalX).toFixed(6)),2);
  deltaY = Math.pow(Number((ballY - goalY).toFixed(6)),2);
  pXY = (Math.sqrt((deltaX + deltaY)).toFixed(6));
}

function scoreMsg(){
  ctx.font = "42px Calibri" ;
  ctx.fillStyle = "white";
  ctx.fillText('Score!', (goalX+50), (goalY+50));
}

function refresh(){
  ctx.clearRect(0,0,stageWd,stageHt);
}

function clear(){
  ctx.clearRect(0,0,stageWd,stageHt);
  ballX = Math.floor(Math.random()*900)+50;
  ballY = Math.floor(Math.random()*50)+10;
  goalX = Math.floor(Math.random()*560)+20;
  goalY = Math.floor(Math.random()*260)+20;
  vY = 1;
  vX = 0;
  gY = 1;
  aX = 0;
  m = 0;
  c = 0;
  bridges=[];
  path = 0;
  clearInterval(run);//clear existing interval to prevent mutiple instances of setInterval()
  run = setInterval(draw,20);//Re-initiating the intervals.
  start = 0;
  score = false;
}
