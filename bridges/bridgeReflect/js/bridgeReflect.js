//-----Global Variables-----
var ctx = document.getElementById('canvas').getContext('2d');
var clr = document.getElementById('clear').addEventListener('click',clear)
var run; //For globale setInterval();

//-----Stage-----
var stageWd = document.getElementById('canvas').width;
var stageHt = document.getElementById('canvas').height;

//-----Bridge-----
var xStart, yStart;
var xEnd, yEnd;
var m;//gradient
var c;//y coordinate

//-----Ball-----
var ballX = 150;
var ballY = 50;
var ballR = 10;

//----Gravity-----
var vY = 0;
var gY = 0;

//----Event Listeners-----
//document.body.addEventListener("mousedown",function(){console.log("Click");})
$('#canvas').mousedown(down);
$('#canvas').mouseup(lift);


function down (){
  ctx.clearRect(0,0,300,300);
  xStart = event.clientX;//Obtaining cursor's X and Y coordinates
  yStart = event.clientY;
  console.log("MouseDown at: ("+xStart+","+yStart+")" );
}

function lift(){
  xEnd = event.clientX;//Obtaining cursor's X and Y coordinates
  yEnd = event.clientY;
  console.log("Mouseup at: ("+xEnd+","+yEnd+")" );
  run = setInterval(draw,100);
}

function draw(){
  refresh();
  bridge();
  ball();
}


function bridge(){

    ctx.beginPath();
    ctx.moveTo(xStart,yStart);
    ctx.lineTo(xEnd,yEnd);
    ctx.stroke();
    m = ((yEnd - yStart)/(xEnd - xStart));
    c = (yStart - (m*xStart));
    console.log("Gradient =" + m, "C :" + c  );


    //----The following are test codes to check test out line equation of the game.
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
  ctx.beginPath();
  ctx.arc(ballX,ballY,ballR,0,2*Math.PI,true);
  ctx.fillStyle = "rgba(19,191,163,0.75)";
  ctx.fill();
  ctx.stroke();

  gY+=0.1;
  vY += gY;
  ballY += vY;
  console.log("ballY :"+ballY, "vY :"+vY, "gY :"+gY);

  if(ballY >= stageHt){
    clearInterval(run);
  }

  if(ballX>xStart && ballX<xEnd){
    var calY = Math.round((m*ballX)+c); //Using ballX to calculate the height ball has to stop
    console.log("Ball has to stop falling ard ballY = "+calY);
    if((ballY+ballR)>= calY){
      console.log("ballY :"+ballY , "calY :"+calY);
      clearInterval(run);
    }
  }

}


function refresh(){
  ctx.clearRect(0,0,300,300);
}

function clear(){
  ctx.clearRect(0,0,300,300);
  ballY = 0;
  vY = 0;
  gY = 0;
  m = 0;
}
