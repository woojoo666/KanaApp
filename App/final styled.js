function $(id) {return document.getElementById(id);}

var canvas = $('canvas');
var ctx;

var prevX;
var prevY;
var sensitivity = 10;

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

var paths = [
	'0 2 3o0o3',
	'2 1',
	'1 0o3',
	'1 0v3v7o2o0',
	'0 2o0o3 1',
	'0o3',
	'0 0 1 3o7',
	'3v1',
	'2 0 2o3',
	'0 3o0',
	'0 1 3o7',
	'2o7',
	'0 2o6o2o3',
	'0 2 2o0',
	'0 3v4v3o0',
	'0 3 0 3o0',
	'0 3v7o4',
	'0o4',
	'0v3o0',
	'2 3o0',
	'0 3 1 2o0o1',
	'2 0 3o0',
	'2o1 3o0o4o1',
	'2 0v3v7o4o1',
	'2o0o3',
	'2 0 2o0o1',
	'0v3o0o6v1',
	'1 3o1o5 3 1',
	'7v1',
	'2 0 0 2o4o1',
	'0 0 2o4o1',
	'0v3o7o1 2o3',
	'0 2o6o2o0o6 1',
	'2o1 3o0o3',
	'0 0 2o0o5',
	'0o7o2o5 2 1',
	'2v6o2o5 2',
	'0 2o4o1',
	'1 2v7o2o4',
	'2 2o3',
	'0v3v7o4o1',
	'2 0v3v7o2o7',
	'0v3v7o4',
	'2 0v3v7o2o4',
	'0 3v7o2 4o0',
	'3v7o2o7',
	];

var current; //which character your on

var drawing; //whether we're on drawing or checking screen

var path; //an array containing the checkpoints for the current character
var progress; //which checkpoint you just got to
var currentStroke; //which stroke your on
var correct; //if your character is currently correct

var output = $('output');
var player = $('player');

var selector = $('selector');

var minData = 3; //minimum data points

var a=document.getElementsByTagName("a");
for(var i=0;i<a.length;i++) {
    if(!a[i].onclick && a[i].getAttribute("target") != "_blank") {
        a[i].onclick=function() {
                window.location=this.getAttribute("href");
                return false; 
        }
    }
}

function init() {
    ctx = canvas.getContext('2d');

    window.addEventListener('resize', initCanvas, false);

    current = 0;
    initChar();

	drawing = true;

	for(var i = 0; i < hiragana.length; i++) {
		var r = hiragana[i] + "r";
		var t = hiragana[i] + "t";
		if (localStorage[t] >= minData) {
			selector.innerHTML += "<option id='result"+i+"' value='"+i+"'>" + 
				hiragana[i] + ": " + Math.floor(localStorage[r]*100/localStorage[t]) + "%" + "</option>";
			selector.innerHTML
		} else {
			localStorage[r] = localStorage[t] = 0;
			selector.innerHTML += "<option id='result"+i+"' value='"+i+"'>" + 
				hiragana[i] + " Insufficient Data Points" + "</option>";
		}

	}
	
	player.volume = 0.5;

	initCanvas();

	$('cover').onclick = function() {fadeout();};
	$('loading').innerHTML = "Click to Continue";
	
	
//touchscreen
   canvas.addEventListener("touchstart",touchstartHandler,false);
   canvas.addEventListener("touchmove", touchmoveHandler,false);
   canvas.addEventListener("touchend", touchendHandler, false);
   canvas.addEventListener("touchcancel", touchcancelHandler,false);
   
   document.addEventListener('touchmove', preventScrollingHandler, false);

}

function preventScrollingHandler(event) {
    event.preventDefault();
}

function fadeout() {
	var cover = $("cover");
	cover.style.opacity = "0";
	cover.style.pointerEvents = "none";
}

function initCanvas() {
	var border = 3;
	ctx.canvas.width = $('canvasDiv').scrollWidth - border*2;
	ctx.canvas.style.border = border + "px solid white";

    ctx.strokeStyle = "red";
    ctx.lineWidth   = 20;
    ctx.lineCap     = 'round';
    ctx.globalAlpha = 1;

    ctx.font = '200px Kozuko';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,255,0.5)';

}

function next() {
	if (drawing) {
		ctx.fillText(hiragana[current], canvas.width/2, canvas.height/2);
		check();
	} else {
		current = Math.floor(46*Math.random());
		initChar();
		player.play();
	}
}

function go() {
	current = selector.value;
	initChar();
}

function initChar() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	output.innerHTML += "\n" + hiragana[current] + ": ";

	path = paths[current].split(" ");
	currentStroke = 0;
	correct = true;

	player.src = "sounds/" + (current+1) + ".mp3";

	drawing = true;
}

function touchstartHandler(e){
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		ctx.beginPath();		
		ctx.moveTo(x,y);
		
		prevX = x;
		prevY = y;
		started = true;
		progress = -1;
};

function touchmoveHandler(e){
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
		ctx.stroke();
		
		var changeX = x - prevX;
		var changeY = y - prevY;
		var d = Math.sqrt(changeX*changeX + changeY*changeY);
		if (d > sensitivity) {
			var cardinal = cardinalize(x-prevX,y-prevY);
			
			prevX = x;
			prevY = y;
			
			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.moveTo(x, y);
			
			checkpoint(cardinal);
	}
};
	
function touchendHandler() {
	if (currentStroke < path.length && (2*(progress+1)) > path[currentStroke].length) {
//		alert("YAY");
	} else {
		correct = false;
	}
	currentStroke++;
};

function touchcancelHandler(event){
	alert('The application has paused, click to continue');
}

function cardinalize(x, y) {
	var theta = (y > 0)? Math.acos(x/Math.sqrt(x*x+y*y)) : 2*Math.PI - Math.acos(x/Math.sqrt(x*x+y*y));
	return (Math.round(theta*4/Math.PI))%8;
}

function checkpoint(card) {
	if (currentStroke < path.length && (2*(progress+1)) < path[currentStroke].length) {
		var checkpoint = parseInt(path[currentStroke].charAt(2*(progress+1)));
		if (card == checkpoint || card == (checkpoint-1)%8 || card == (checkpoint+1)%8) {
			progress++;
		}
		output.innerHTML = progress;
	}
}

function check() {
	if (currentStroke == path.length && correct) { //RIGHT!
		ctx.strokeStyle = "rgba(100,255,100,0.75)";
		ctx.beginPath();
		ctx.moveTo(canvas.width/4, canvas.height/2);
		ctx.lineTo(canvas.width/2, 3*canvas.height/4);
		ctx.lineTo(5*canvas.width/6, canvas.height/6);
		ctx.stroke();

		sendScore(true);
	} else { //WRONG
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(canvas.width,canvas.height);
		ctx.moveTo(0,canvas.height);
		ctx.lineTo(canvas.width,0);
		ctx.stroke();

		sendScore(false);
	}
	drawing = false;
}

function sendScore(c) {
	var r = hiragana[current] + "r";
	var t = hiragana[current] + "t";
	
	if (c) {
		localStorage[r]++;
	}
	localStorage[t]++;

	if (localStorage[t] >= minData) {
		var id = "result" + current;
		$(id).innerHTML = hiragana[current] + ": " + Math.floor(localStorage[r]*100/localStorage[t]) + "%";
	}
}
