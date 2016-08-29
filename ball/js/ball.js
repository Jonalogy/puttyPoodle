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




function draw(){
  refresh();
  bridge();
  ball();
}

function ball(){
  ctx.beginPath();
  ctx.arc(ballX,ballY,ballR,0,2*Math.PI,true);
  ctx.fillStyle = "rgba(19,191,163,0.75)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.stroke();

  gY+=1;
  vY += gY;
  ballY += vY;
  console.log("ballY :"+ballY, "vY :"+vY, "gY :"+gY);

  if(ballY >= stageHt){
    clearInterval(run);
  }

  if(ballX>xStart && ballX<xEnd){
    var calY = Number(((m*ballX)+c).toFixed(1)); //Using ballX to calculate the height ball has to stop
    console.log("Ball has to stop falling ard ballY = "+calY);
    if((ballY+ballR) >= calY){
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
