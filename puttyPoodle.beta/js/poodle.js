//-----Global Variables-----
var ctx = document.getElementById('canvas').getContext('2d');
var clr = document.getElementById('clear').addEventListener('click',clear)
var run; //For globale setInterval();
var start = 0;

//-----Stage-----
var stageWd = document.getElementById('canvas').width;
var stageHt = document.getElementById('canvas').height;
var score = false;
var pife = 3; // Number of tries you have,
var pts = 0;

//-----Bridge-----
var m;//gradient
var c;//y coordinate
var bridges = [];//To store all path coordinates
var pathXY = [];//To store start & end coordinates for each path
var path = 0;//To keep count on the number of paths
var xRange, xRangeBegin, xRangeEnd;

//-----Ball-----
  var ballR = 10;
  var ballX
  var ballY
  var calY;

//-----Goal-----
  var goalR = 50;
  var goalX
  var goalY

//-----Randomly Assiging Ball and Goal's position-----
  do{
        ballX = Math.floor(Math.random()*(stageWd-100))+50;
        ballY = Math.floor(Math.random()*(stageHt/3))+(30); //Keeping Y to the top of third of the page
      do{
        var avoid = stageHt-ballY;//getting the remainging buffer with
        goalX = Math.floor(Math.random()*(stageWd-(goalR*2)))+goalR;
        goalY = Math.floor(Math.random()*(stageHt-(stageHt/3))+(stageHt/3));
      }while(goalX === ballX && goalY<(ballY+150));//Regenerates goal coords if goalY is not 150pts below ballY
      distance();
    }while(pXY<250);

//-----Distance Varialbles-----
  var deltaX, deltaY, pXY;

//----Gravity-----
  var vY = 1;
  var gY = 1;
  var vX = 0; // Velocity in X-axis
  var aX = 0; //Velocity in Y-axis

//----Event Listeners-----

  $('#canvas').mousedown(function(event){down(event)});
  $('#canvas').mouseup(function(event){lift(event)});
  $('#start').click(function(){
    start = 1;
    $('#clear').addClass('hide')
  });
  $('#start').click(backgroundMusic);
  $("#retry").on("click", retry)
  $('#clear').click(function(){ $('#clear').addClass('hide') })

//---Interval---
  run = setInterval(draw,20);

function down(event){//Action done after mousedown
  if(start!=1){
    var top = document.getElementById('canvas').offsetTop;
    var left = document.getElementById('canvas').offsetLeft;
    pathXY.push((event.clientX)-left);//Collect start x-cord
    pathXY.push((event.clientY)-top);//collect start y-cord
  }
}

function lift(event){//Action done after mouseup
  if(start!=1){
    var top = document.getElementById('canvas').offsetTop;
    var left = document.getElementById('canvas').offsetLeft;
    pathXY.push((event.clientX)-left);//collect end X-cord
    pathXY.push((event.clientY)-top);//collect end Y-cord

    bridges.push(pathXY);// pushing path cords into bridge array for storing
    pathXY=[];//clear array for the next path input
    path++;//increment path count
  }
}

function draw(){
  refresh();
  bridge();
  goal();
  if(score===true){
      clearInterval(run);
      scoreMsg();
      pts++;
      document.getElementById('pts').innerHTML="<span id='pts'>"+pts+"<span>";
      $('#clear').removeClass('hide')
    }
  if(start===2 && pife!=0){
    miss()
    var child = document.getElementById('life' + pife)
    var parent = document.getElementById('rightHead')
    parent.removeChild(child);
    pife--;
    start = 0;
    if(pife === 0){
      refresh()
      document.getElementById('pife').innerHTML = "<div id=\"pife\">Retry!</div>";
      ctx.font = "100px 'Gloria Hallelujah'" ;
      ctx.fillStyle = "white";
      ctx.fillText("AWW...", 380,280);
      document.getElementById('wonderfulWorld').pause();
      document.getElementById('aww').play();
      clearInterval(run);
      $('#retry').removeClass('hide')
      $('#clear').addClass('hide')
      $('#start').addClass('hide')
    }
    clearInterval(run);
  }
  ball();
  detectGoal();
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
  }

function ball(){
  ctx.save();
  ctx.beginPath();
  ctx.arc(ballX,ballY,ballR,0,2*Math.PI,true);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.restore();

  //---Use this to mark the center of the ball---
    // ctx.save();
    // ctx.strokeStyle = "red";
    // ctx.strokeRect(ballX, ballY, 1, 1);
    // ctx.restore();

    if(start===1){
      //-----Changes in Y-axis movement
      vY = Number((vY + gY).toFixed(6));
      ballY = Number((ballY + vY).toFixed(6));

      //-----Changes in X-axis in air
      if(aX>0){
        aX = Number((aX-0.01).toFixed(6));//Air Resistance
      }
      else{
        aX = Number((aX+0.01).toFixed(6));
      }
      vX = Number((vX + aX).toFixed(6));
      ballX = Number((ballX + vX).toFixed(6));

      //------Ball control at bottom edge
      if((ballY+ballR) >= stageHt){

        if(vY>2 || vY<-2){
          document.getElementById('pop').play();
        }

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

  //-----Ball control after colliding Top edge
  if((ballY-ballR) < 0){
    document.getElementById('pop').play();
    avY = Number((vY*(-0.8)).toFixed(6));
    }

  //-----Ball control after colliding right edge
  if((ballX+ballR) >= stageWd){
    document.getElementById('pop').play();
    ballX = stageWd-ballR;
    aX = Number((m*(-0.01)).toFixed(6));
    vX = Number((vX*(-0.5).toFixed(6)));
    }

  //-----Ball control after colliding left edge
  if((ballX-ballR) <= 0){
    document.getElementById('pop').play();
    ballX = ballR+0;
    aX = Number((m*(-0.01)).toFixed(6));
    vX = Number((vX*(-0.5).toFixed(6)));
    }

  //----Bounce with multiple bridges-----
  if(bridges[0]!=undefined){
    for(i=0; i<path; i++){

      if(bridges[i][0]<=bridges[i][2]){ xRangeBegin = bridges[i][0]}
      else if(bridges[i][2]<bridges[i][0]){xRangeBegin = bridges[i][2]}

      xRange = Math.abs(Number(bridges[i][2] - bridges[i][0]).toFixed(6)); //Finding the absolute distance between xStart and xEnd.
      xRangeEnd = xRangeBegin + xRange;//Finds end of range.

      if(ballX>xRangeBegin && ballX<xRangeEnd){

        calY = Number(((bridges[i][4]*ballX)+bridges[i][5]).toFixed(3));
        // console.log("Ball is above path "+ i);
        //Using ballX to calculate the height ball has to stop
        // console.log("Between X1:"+ bridges[i][0] + " , X2:" + bridges[i][2] + ", CalY:" + calY );
        // console.log("vX: "+ vX + " , vY:" + vY);

        //---Influencing ball's velocity in X-direction
          if((ballY+ballR) > (calY-5) && (ballY+ballR) < (calY+20)){
              if(vY>3 || vY<-3){
                document.getElementById('pop').play();
              }
              ballY = calY - (ballR+2);//updating ballY to calculated y-position
              if(bridges[i][4]>=0){

                if(vX<0){
                  aX = Number((bridges[i][4]*(0.2)).toFixed(6));
                  vX = 1;
                }
                else{
                  aX = Number((bridges[i][4]*(0.3)).toFixed(6));
                  vX = Number((vX*0.95).toFixed(6));
                }

              }
              else{
                if(vX>-0.3){
                  aX = Number((bridges[i][4]*(0.2)).toFixed(6));
                  vX = -1;
                }
                else{
                  aX = Number((bridges[i][4]*(0.3)).toFixed(6));
                  vX = Number((vX*0.95).toFixed(6));
                }
              }

            //Influencing ball's velocity in Y-direction
              vY = Number((vY*(-1)).toFixed(6));
              }
            }
      }
    }

  if(ballY>=488 && (vX<0.05 && vX>-0.05)){
    start  = 2;
  }
}

function goal(){
  ctx.save();
  ctx.beginPath();
  ctx.arc(goalX, goalY, goalR ,0 ,2*Math.PI, true);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();
}

function detectGoal(){
  distance();
  // console.log("pXY :" + pXY, " ballY :"+ ballY, "ballX :"+ ballX, "calY : "+ calY, "goalY :"+ goalY, "goalX :" + goalX, "vY :" + vY, "vX : "+vX);
  if(pXY<(ballR+goalR)-10){
    ballX = goalX;
    ballY = goalY;
    score = true;
  }
}

function distance(){ // To calculated the distance between the ball and the goal
  deltaX = Math.pow(Number((ballX - goalX).toFixed(6)),2);
  deltaY = Math.pow(Number((ballY - goalY).toFixed(6)),2);
  pXY = (Math.sqrt((deltaX + deltaY)).toFixed(6));
}

function scoreMsg(){

  document.getElementById('taDa').play();
  if (goalR>15){
      goalR-=5;//Reduces Goal size
    }

  ctx.font = "42px 'Gloria Hallelujah'" ;
  ctx.fillStyle = "white";

  //-----To ensure proper display of code-----
    if(goalX>(stageWd-150) && goalY<80){ //Right Top Corner
    ctx.fillText('Score!', (goalX-200), (goalY+80));
  }
  else if(goalX>(stageWd-150) && goalY>(stageHt-80) ){// Right Bottom Corner
    ctx.fillText('Score!', (goalX-200), (goalY- 60));
  }
  else if(goalX>(stageWd-80)){//Along Right Edge
    ctx.fillText('Score!', (goalX-200), (goalY-40));
  }
  else if(goalX<80 && goalY<80){//Left Top Corner
    ctx.fillText('Score!', (goalX+70), (goalY+50));
  }
  else if(goalX<80 && goalY>(stageHt-80)){//Left Bottom Corner
    ctx.fillText('Score!', (goalX+70), (goalY-50));
  }
  else if(goalX<80){ // Along left Edge
    ctx.fillText('Score!', (goalX+70), (goalY-25));
  }
  else if(goalY>400){//Along bottom Edge
    ctx.fillText('Score!', (goalX), (goalY-100));
  }
  else if(goalY<80){//Along top Edge
    ctx.fillText('Score!', (goalX), (goalY+100));
  }
  else{
    ctx.fillText('Score!', (goalX-100), (goalY-80));
  }
}

function miss(){
  ctx.font = "42px 'Gloria Hallelujah'" ;
  ctx.fillStyle = "white";

  if(goalX>(stageWd-150) && goalY<80){ //Right Top Corner
    ctx.fillText('I\'m here ~', (goalX-200), (goalY+80));
  }
  else if(goalX>(stageWd-150) && goalY>(stageHt-80) ){// Right Bottom Corner
    ctx.fillText('I\'m here ~', (goalX-200), (goalY- 60));
  }
  else if(goalX>(stageWd-150)){//Along Right Edge
    ctx.fillText('I\'m here ~', (goalX-200), (goalY-40));
  }
  else if(goalX<80 && goalY<80){//Left Top Corner
    ctx.fillText('I\'m here ~', (goalX+70), (goalY+50));
  }
  else if(goalX<80 && goalY>(stageHt-80)){//Left Bottom Corner
    ctx.fillText('I\'m here ~', (goalX+70), (goalY-50));
  }
  else if(goalX<80){ // Along left Edge
    ctx.fillText('I\'m here ~', (goalX+70), (goalY-25));
  }
  else if(goalY>400){//Along bottom Edge
    ctx.fillText('I\'m here ~', (goalX), (goalY-100));
  }
  else if(goalY<80){//Along top Edge
    ctx.fillText('I\'m here ~', (goalX), (goalY+100));
  }
  else{
    ctx.fillText('I\'m here ~', (goalX - 100), (goalY-80));
  }

  $('#clear').removeClass('hide')
}

function refresh(){
  ctx.clearRect(0,0,stageWd,stageHt);
}

function clear(){
  ctx.clearRect(0,0,stageWd,stageHt);

  do{
        ballX = Math.floor(Math.random()*(stageWd-100))+50;
        ballY = Math.floor(Math.random()*(stageHt/3))+(30); //Keeping Y to the top of third of the page

      do{
        var avoid = stageHt-ballY;//getting the remainging buffer with
        goalX = Math.floor(Math.random()*(stageWd-(goalR*2)))+goalR;
        goalY = Math.floor(Math.random()*(stageHt-(stageHt/3))+(stageHt/3));
      }while(goalX === ballX && goalY<(ballY+150));//Regenerates goal coords if goalY is not 150pts below ballY

      distance();

    }while(pXY<250);
    distance();
    console.log( "pXY = " + pXY);
    console.log("ballY-goalY =", ballY-goalY)

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

function retry() {
  document.getElementById('pife').innerHTML = "<div id=\"pife\">Pife: </div>";

  if(pife<3){
    var child;
    for(i=1;i<(4-pife);i++){
      child = $("<div>").addClass("lives").attr("id","life"+i);
      child.insertAfter("#pife");
    }
    pife = 3;
    pts = 0;
    document.getElementById('pts').innerHTML="<span id='pts'>"+pts+"<span>";

  }
  goalR = 50;
  clear();
  document.getElementById('wonderfulWorld').pause();
  $('#start').removeClass('hide');
  $('#retry').addClass('hide')
}

function backgroundMusic(){
  document.getElementById('wonderfulWorld').play();
}
