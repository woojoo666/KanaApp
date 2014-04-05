// When the DOM is ready
//document.addEventListener("DOMContentLoaded", init, false);

var notifs = document.getElementById("notifications");

var ctx1;
var ctx2;
var canvas1 = document.getElementById('canvas1');
var canvas2 = document.getElementById('canvas2');

var canvasbtn = document.getElementById('canvasbtn');
var ctx;

var canvasDiv = document.getElementById('canvasDiv');

var totalArea;
var intersectionArea;

function init()
{
    document.addEventListener('touchmove', preventScrollingHandler, false);
    
    ctx1             = canvas1.getContext('2d');
    ctx1.strokeStyle = "rgba(255,0,0,1)";
    ctx1.lineWidth   = 10;
    ctx1.lineCap     = 'round';
    ctx1.fillStyle = "rgba(255,0,0,1)";
      
    ctx2             = canvas2.getContext('2d');
    ctx2.strokeStyle = "rgba(0,255,0,1)";
    ctx2.lineWidth   = 10;
    ctx2.lineCap     = 'round';
    ctx2.font = '200px Kozuko';
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';
    ctx2.fillStyle = 'blue';
    ctx2.fillText('な', canvas2.width/2, canvas2.height/2);
    
	ctx = ctx1;
    
	notifs.innerHTML = "initialized";

   document.addEventListener("touchstart",touchstartHandler,false);
   document.addEventListener("touchmove", touchmoveHandler,false);
   document.addEventListener("touchcancel", touchcancelHandler,false);

//	var width1 = canvas1.width;
	
//	ctx1.fillRect(100,100,10,10);
	ctx1.strokeRect(0,0,canvas1.width, canvas1.height);
	ctx2.strokeRect(0,0,canvas1.width, canvas1.height);
//	notifs.innerHTML = canvas1.width;
}

function switchCanvas() {
	if (ctx === ctx1) {
		ctx = ctx2;
		canvasbtn.innerHTML = "Layer 2 (click to change layer)";
	} else {
		ctx = ctx1;
		canvasbtn.innerHTML = "Layer 1 (click to change layer)";
	}
}

function touchstartHandler(event)
{
	if(document.getElementsByTagName('section')[0]){
		document.body.removeChild(document.getElementsByTagName('section')[0]);
	}
    notifs.innerHTML = "touchstart";
    ctx.beginPath();
    ctx.moveTo(event.touches[0].pageX - canvasDiv.offsetLeft, event.touches[0].pageY - canvasDiv.offsetTop);
}

function touchmoveHandler(event)
{
    notifs.innerHTML = "touchmove";
    ctx.lineTo(event.touches[0].pageX - canvasDiv.offsetLeft, event.touches[0].pageY - canvasDiv.offsetTop);
    ctx.stroke();
}

function touchcancelHandler(event)
{
	alert('The application has paused, click to continue');
}

function preventScrollingHandler(event)
{
    event.preventDefault();
}

function intersection() {
	notifs.innerHTML = "calculating intersection";
	totalArea = intersectionArea = 0;
	var imgData1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
	var imgData2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
	var pixels1 = imgData1.data;
	var pixels2 = imgData2.data;
	for (var i = 0; i < pixels1.length; i+=4) {
		var a = pixels1[i] + pixels1[i+1] + pixels1[i+2] + pixels1[i+3];
		var b = pixels2[i] + pixels2[i+1] + pixels2[i+2] + pixels2[i+3];
		if (a !== 0 && b !== 0) {
			intersectionArea++;
			totalArea++;
		} else if (a !== 0 || b !== 0){
			totalArea++;
			pixels1[i] = pixels1[i+1] = pixels1[i+2] = 255;
			pixels2[i] = pixels2[i+1] = pixels2[i+2] = 255;
			pixels1[i+3] = pixels2[i+3] = 0;
		}
	}
	var testP = (105*200*4) + (105*4);
	alert("data at 105, 105: rgb(" + pixels1[testP] + "," + pixels1[testP+1] + "," + pixels1[testP+2] + ")");
	notifs.innerHTML = "total:" + totalArea + " intersection:" + intersectionArea;
	ctx1.putImageData(imgData1,0,0);
	ctx2.putImageData(imgData2,0,0);
}