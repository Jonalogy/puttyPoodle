//-----Global Variables-----
var ctx = document.getElementById('canvas').getContext('2d');
var clr = document.getElementById('clear').addEventListener('click',clear)
var run; //For globale setInterval();

//-----Stage-----
var stageWd = document.getElementById('canvas').width;
var stageHt = document.getElementById('canvas').height;

//-----Bridge-----
var m;//gradient
var c;//y coordinate
var bridges = [];//To store all path coordinates
var pathXY = [];//To store start & end coordinates for each path
var path = 0;//To keep count on the number of paths

//-----Ball-----
var ballX = 150;
var ballY = 50;
var ballR = 10;

//----Gravity-----
var vY = 1;
var gY = 0.1;
var vX = 0; // Velocity in X-axis
var aX = 0; //Velocity in Y-axis

//----Event Listeners-----
//document.body.addEventListener("mousedown",function(){console.log("Click");})
$('#canvas').mousedown(down);
$('#canvas').mouseup(lift);

//---
run = setInterval(draw,10);

function down (){
  ctx.clearRect(0,0,300,300);
  // xStart = event.clientX;//Obtaining cursor's X and Y coordinates
  pathXY.push(event.clientX);//Collect start x-cord
  pathXY.push(event.clientY);//collect start y-cord
}

function lift(){
  pathXY.push(event.clientX);//collect end X-cord
  pathXY.push(event.clientY);//collect end Y-cord
  console.log("Coordinates of mousedown and mouseup: " + pathXY);

  bridges.push(pathXY);// pushing path cords into bridge array for storing
  pathXY=[];//clear array for the next path input
  path++;//increment path count

  console.log(bridges);
}

function draw(){
  refresh();
  bridge();
  // ball();
}

function bridge(){ //Drawn line
    for(i=0; i<path; i++){
      ctx.beginPath();
      ctx.moveTo(bridges[i][0],bridges[i][1]);
      ctx.lineTo(bridges[i][2],bridges[i][3]);
      ctx.lineWidth = 10;
      ctx.stroke();
      if(bridges[i].length=4){
        m = Number(((bridges[i][3] - bridges[i][1])/(bridges[i][2] - bridges[i][0])).toFixed(6)); //Calculates gradient
        c = Number((bridges[i][1] - (m*bridges[i][0])).toFixed(6)); // Calculates y-intercept
        bridges[i].push(m); //Calculates gradient
        bridges[i].push(c); // Calculates y-intercept
        m=0;c=0;
      }
      console.log(bridges);

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

// function ball(){
//   ctx.beginPath();
//   ctx.arc(ballX,ballY,ballR,0,2*Math.PI,true);
//   ctx.fillStyle = "rgba(19,191,163,0.75)";
//   ctx.fill();
//   ctx.lineWidth = 1;
//   ctx.stroke();
//
//   ctx.save();
//   ctx.strokeStyle = "red";
//   ctx.strokeRect(ballX, ballY, 1, 1);
//   ctx.restore();
//
//   //-----Changes in Y-axis movement
//   vY = Number((vY + gY).toFixed(6));
//   ballY = Number((ballY + vY).toFixed(6));
//
//   //-----Changes in X-axis movement
//   if(aX>0){
//     aX = Number((aX-0.005).toFixed(6));
//   }
//   else{
//     aX = Number((aX+0.005).toFixed(6));
//   }
//   vX = Number((vX + aX).toFixed(6));
//   ballX = Number((ballX + vX).toFixed(6));
//
//   console.log("ballY :"+ballY,"ballX :"+ballX, "vY :"+vY, "vX :"+vX, "gY :"+gY, "aX :"+aX, "m :"+m);
//   // console.log("ballY :"+ballY,"ballX :"+ballX, "vY :"+vY, "vX :"+vX, "gY :"+gY, "aX :"+aX, "m :"+m);
//
//   //------Ball control at bottom edge
//   if((ballY+ballR) >= stageHt){
//     ballY = stageHt-ballR;
//     vY = Number((vY*(-0.8)).toFixed(6));
//     // gY = Number((gY - 0.01).toFixed(6));
//
//     if(vX!=0){
//       vX = Number((vX*0.9).toFixed(6))//Friction Variable
//     }
//
//
//     if((gY>=-1 && gY<1) && (vY>=-0.5 && vY<0.5) && (vX>=-0.3 && vX<0.3) && (aX>=-0.1 && aX<0.1)){
//       clearInterval(run);
//     }
//   }
//
//   //-----Ball control after colliding right edge
//   if((ballX+ballR) >= stageWd){
//     ballX = stageWd-ballR;
//     aX = Number((m*(-0.01)).toFixed(6));
//     vX = Number((vX*(-0.5).toFixed(6)));
//     }
//
//   //-----Ball control after colliding left edge
//   if((ballX-ballR) <= 0){
//     ballX = ballR+0;
//     aX = Number((m*(-0.01)).toFixed(6));
//     vX = Number((vX*(-0.5).toFixed(6)));
//     }
//
//   //------Bounce for bridge-----
//   if(ballX>xStart && ballX<xEnd){
//     //Using ballX to calculate the height ball has to stop
//     var calY = Number(((m*ballX)+c).toFixed(3));
//     // console.log("Ball has to stop falling ard ballY = "+calY);
//
//     if((ballY+ballR) >= calY && (ballY+ballR)<=(calY+15)){
//       // console.log("ballY :"+ballY , "calY :"+calY);
//       ballY = calY - ballR;//updating ballY to calculated y-position
//       aX = Number((m*(0.1)).toFixed(6));
//       if(m>=0){vX = 1;}
//       else{vX = -1;}
//
//       vY = Number((vY*(-0.9)).toFixed(6));
//       gY = Number((gY - 0.0001).toFixed(6));
//       // console.log("ballY :"+ballY,"ballX :"+ballX, "m = "+m, "vY :"+vY, "gY :"+gY);
//       // clearInterval(run);
//     }
//   }
// }

function refresh(){
  ctx.clearRect(0,0,600,300);
}

function clear(){
  ctx.clearRect(0,0,600,300);
  ballY = 0; ballX = 150; calY = 0;
  vY = 1;
  vX = 0
  gY = 1;
  aX = 0;
  m = 0;
  c = 0;
  bridges=[];
  path = 0;
  clearInterval(run);//clear existing interval to prevent mutiple instances of setInterval()
  run = setInterval(draw,10);//Re-initiating the intervals.
}
