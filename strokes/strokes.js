function $(id) {return document.getElementById(id);}

var canvas = $('canvas');
var ctx;

var output = $('output');

var prevX;
var prevY;
var sensitivity = 30;

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

var current = 0;
var currentCardinal;

function init() {
    document.addEventListener('touchmove', preventScrollingHandler, false);
    
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = "rgba(255,75,75,1)";
    ctx.lineWidth   = 5;
    ctx.lineCap     = 'round';

    ctx.font = '200px Kozuko';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,255,0.5)';

	ctx.fillText("あ", canvas.width/2, canvas.height/2);
	output.innerHTML = hiragana[current] + ": ";
	
	canvas.addEventListener("touchstart",touchstartHandler,false);
	canvas.addEventListener("touchmove", touchmoveHandler,false);
	canvas.addEventListener("touchcancel", touchcancelHandler,false);
}

function next() {
	alert("next");
	current++;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillText(hiragana[current],canvas.width/2,canvas.height/2);
	output.innerHTML += "\n" + hiragana[current] + ": ";
}

function touchstartHandler(e) {
	var x = e.pageX - canvas.offsetLeft;
	var y = e.pageY - canvas.offsetTop;
	ctx.beginPath();		
	ctx.moveTo(x,y);
	
	prevX = x;
	prevY = y;
	currentCardinal = -1;
	
	output.innerHTML += ",";
}

function touchmoveHandler(e) {
	var x = e.pageX - canvas.offsetLeft;
	var y = e.pageY - canvas.offsetTop;
	ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
	ctx.stroke();
	
	var changeX = x - prevX;
	var changeY = y - prevY;
	var d = Math.sqrt(changeX*changeX + changeY*changeY);
	if (d > sensitivity) {
		var cardinal = cardinalize(x-prevX,y-prevY);	
		ctx.beginPath();
		ctx.strokeStyle = "blue";
		ctx.moveTo(prevX, prevY);
		var theta = (Math.PI/4)*cardinal;
		ctx.lineTo(prevX + d*Math.cos(theta), prevY + d*Math.sin(theta));
		ctx.stroke();
		
		prevX = x;
		prevY = y;
		
		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.moveTo(x, y);
		
		if (cardinal != currentCardinal) {
			output.innerHTML += cardinal;
			currentCardinal = cardinal;
		}
	}
}

function touchcancelHandler(event)
{
	alert('The application has paused, click to continue');
}

function preventScrollingHandler(event)
{
    event.preventDefault();
}

function cardinalize(x, y) {
	var theta = (y > 0)? Math.acos(x/Math.sqrt(x*x+y*y)) : 2*Math.PI - Math.acos(x/Math.sqrt(x*x+y*y));
	return (Math.round(theta*4/Math.PI))%8;
}