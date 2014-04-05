document.addEventListener("DOMContentLoaded", init, false);

function $(id) {return document.getElementById(id);}

var canvas = $('canvas');
var ctx;

var prevX;
var prevY;
var sensitivity = 30;

function init() {
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = "red";
    ctx.lineWidth   = 5;
    ctx.lineCap     = 'round';
	ctx.globalAlpha = 1;
	
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
}

var started = false;
canvas.onmousedown = function(e) {
	if (!started) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		ctx.beginPath();		
		ctx.moveTo(x,y);
		
		prevX = x;
		prevY = y;
		started = true;
	}
};

canvas.onmousemove = function(e) {
	if (started) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		ctx.lineTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
		ctx.stroke();
		
		var changeX = x - prevX;
		var changeY = y - prevY;
		var d = Math.sqrt(changeX*changeX + changeY*changeY);
		if (d > sensitivity) {
			ctx.beginPath();
			ctx.strokeStyle = "blue";
			var cardinal = cardinalize(x-prevX,y-prevY);
			ctx.moveTo(prevX, prevY);
			var theta = (Math.PI/4)*cardinal;
			ctx.lineTo(prevX + d*Math.cos(theta), prevY + d*Math.sin(theta));
			ctx.stroke();
			
			prevX = x;
			prevY = y;
			
			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.moveTo(x, y);
		}
	}
	
};
	
canvas.onmouseup = function() {
	started = false;
};

function cardinalize(x, y) {
	var theta = (y > 0)? Math.acos(x/Math.sqrt(x*x+y*y)) : 2*Math.PI - Math.acos(x/Math.sqrt(x*x+y*y));
	return (Math.round(theta*4/Math.PI))%8;
}