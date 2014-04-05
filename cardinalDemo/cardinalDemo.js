document.addEventListener("DOMContentLoaded", init, false);

function $(id) {return document.getElementById(id);}

var canvas = $('canvas');
var ctx;

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
		ctx.beginPath();
		ctx.moveTo(canvas.width/2, canvas.height/2);

		started = true;
	}
};

canvas.onmousemove = function(e) {
	if (started) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.beginPath();
		ctx.moveTo(canvas.width/2, canvas.height/2);
		ctx.lineTo(x, y);
		
		var cardinal = cardinalize(x-canvas.width/2,y-canvas.height/2);
		ctx.moveTo(canvas.width/2, canvas.height/2);
		var theta = (Math.PI/4)*cardinal;
		ctx.lineTo(canvas.width/2 + 100*Math.cos(theta), canvas.height/2 + 100*Math.sin(theta));
		ctx.fillText("Cardinal: " + cardinal, 10, 40);
		ctx.stroke();
	}
	
};
	
canvas.onmouseup = function() {
	started = false;
};

function cardinalize(x, y) {
	var theta = (y > 0)? Math.acos(x/Math.sqrt(x*x+y*y)) : 2*Math.PI - Math.acos(x/Math.sqrt(x*x+y*y));
	return (Math.round(theta*4/Math.PI))%8;
}