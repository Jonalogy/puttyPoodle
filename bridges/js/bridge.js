//-----Global Variables-----
var ctx = document.getElementById('canvas').getContext('2d');
var clr = document.getElementById('clear').addEventListener('click',clear)

//-----Bridge-----
var xStart, yStart;
var xEnd, yEnd;


//----Event Listeners-----
//document.body.addEventListener("mousedown",function(){console.log("Click");})
$('body').mousedown(down);
$('body').mouseup(lift);


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
  draw();
}


function draw(){
  ctx.beginPath();
  ctx.moveTo(xStart,yStart);
  ctx.lineTo(xEnd,yEnd);
  ctx.stroke();
}



function clear(){
  ctx.clearRect(0,0,300,300);
}
