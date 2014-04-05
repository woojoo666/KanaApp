// When the DOM is ready
//document.addEventListener("DOMContentLoaded", init, false);

var notifs = document.getElementById("notifications");

var ctx;
var canvas = document.getElementById('canvas');

var totalArea;
var intersectionArea;

var mode = document.getElementById('mode');
var testMode = false;

var current = 0; //current Character

var drawing = true; //whether we're on the drawing or checking screen

var strokesDrawn = 0; //number of strokes drawn

var hiragana = [
	"あ","い","う","え","お",
	"か","き","く","け","こ",
	"さ","し","す","せ","そ",
	"た","ち","つ","て","と",
	"な","に","ぬ","ね","の",
	"は","ひ","ふ","へ","ほ",
	"ま","み","む","め","も",
	"や","ゆ","よ",
	"ら","り","る","れ","ろ",
	"わ","を",
	"ん"];

var strokes = [
	3,2,2,2,3,
	3,4,1,3,2,
	3,1,2,3,2,
	4,2,1,1,2,
	4,3,2,2,1,
	3,1,4,1,4,
	3,2,3,2,3,
	3,2,2,
	2,2,1,2,1,
	2,3,
	1];
	
var roman = [
	"a","i","u","e","o",
	"ka","ki","ku","ke","ko",
	"sa","shi","su","se","so",
	"ta","chi","tsu","te","to",
	"na","ni","nu","ne","no",
	"ha","hi","fu","he","ho",
	"ma","mi","mu","me","mo",
	"ya","yu","yo",
	"ra","ri","ru","re","ro",
	"wa","wo",
	"n"];

function init()
{
    document.addEventListener('touchmove', preventScrollingHandler, false);
    
    ctx             = canvas.getContext('2d');
    ctx.lineWidth   = 20;
    ctx.lineCap     = 'round';
      
    ctx.font = '200px Kozuko';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,255,0.5)';
    
    notifs.innerHTML = "initialized";

    next();

//touchscreen
   canvas.addEventListener("touchstart",touchstartHandler,false);
   canvas.addEventListener("touchmove", touchmoveHandler,false);
   canvas.addEventListener("touchcancel", touchcancelHandler,false);

}

function changeMode() {
	testMode = !testMode;
	mode.innerHTML = (testMode? "test mode" : "training mode");
}

function done() {
	drawing? intersection() : next();
	drawing = !drawing;
}
	

function next() {
	ctx.strokeStyle = "rgba(255,75,75,1)";
	strokesDrawn = 0;
	current = Math.floor(46*Math.random());
	ctx.clearRect (0,0,canvas.width,canvas.height);
	if (!testMode) {
		ctx.fillText(hiragana[current], canvas.width/2, canvas.height/2);
	}
	notifs.innerHTML = roman[current];
}

//touchscreen
function touchstartHandler(event)
{
	strokesDrawn++;
	if(document.getElementsByTagName('section')[0]){
		document.body.removeChild(document.getElementsByTagName('section')[0]);
	}
    ctx.beginPath();
    ctx.moveTo(event.touches[0].pageX - canvas.offsetLeft, event.touches[0].pageY - canvas.offsetTop);
}

function touchmoveHandler(event)
{
    ctx.lineTo(event.touches[0].pageX - canvas.offsetLeft, event.touches[0].pageY - canvas.offsetTop);
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

	ctx.fillText(hiragana[current], canvas.width/2, canvas.height/2);

	totalArea = intersectionArea = 0;
	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixels = imgData.data;
	for (var i = 0; i < pixels.length; i+=4) {
		var r = pixels[i];
		var b = pixels[i+2];
		var a = pixels[i+3];
		if (r < 255 && b < 255 && a > 0) {
			intersectionArea++;
			totalArea++;
		} else if (a > 0){
			totalArea++;
		}
	}
	ctx.putImageData(imgData,0,0);
	check();
}

function check() {
	if (strokesDrawn == strokes[current] && intersectionArea/totalArea > 0.25) { //RIGHT!
		ctx.strokeStyle = "rgba(100,255,100,0.75)";
		ctx.beginPath();
		ctx.moveTo(canvas.width/4, canvas.height/2);
		ctx.lineTo(canvas.width/2, 3*canvas.height/4);
		ctx.lineTo(5*canvas.width/6, canvas.height/6);
		ctx.stroke();
	} else { //WRONG
		if (
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(canvas.width,canvas.height);
		ctx.moveTo(0,canvas.height);
		ctx.lineTo(canvas.width,0);
		ctx.stroke();
	}
	notifs.innerHTML = (Math.floor(100*intersectionArea/totalArea)) + "%";
}