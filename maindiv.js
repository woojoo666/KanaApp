function $(id) {
    return document.getElementById(id);
}

var canvas = $('canvas');
var canvasDiv = $('canvasDiv');
var player = $('player');

var ctx = canvas.getContext('2d');
var canvasBorder = 0;

var minData = 3; //minimum data points for displaying score in resultpage

var hiragana = [
    'あ', 'い', 'う', 'え', 'お',
    'か', 'き', 'く', 'け', 'こ',
    'が', 'ぎ', 'ぐ', 'げ', 'ご',
    'さ', 'し', 'す', 'せ', 'そ',
    'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
    'た', 'ち', 'つ', 'て', 'と',
    'だ', 'ぢ', 'づ', 'で', 'ど',
    'な', 'に', 'ぬ', 'ね', 'の',
    'は', 'ひ', 'ふ', 'へ', 'ほ',
    'ば', 'び', 'ぶ', 'べ', 'ぼ',
    'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',
    'ま', 'み', 'む', 'め', 'も',
    'や', 'ゆ', 'よ',
    'ら', 'り', 'る', 'れ', 'ろ',
    'わ', 'を',
    'ん'
];

var current; //which character you're on
var drawing; //whether we're on drawing or checking screen

var a = document.getElementsByTagName("a");
for (var i = 0; i < a.length; i++) {
    if (!a[i].onclick && a[i].getAttribute("target") != "_blank") {
        a[i].onclick = function() {
            window.location = this.getAttribute("href");
            return false;
        };
    }
}

function initTest() {
    drawing = false;

    initCanvas();
    initStorage();

    ctx.font = '30px Kozuko';
    ctx.fillText('Two-finger-tap to start.', canvas.width / 2, canvas.height / 2 - 110);
    ctx.fillText('Listen for audio cue, and write', canvas.width / 2, canvas.height / 2 - 80);
    ctx.fillText('the corresponding hiragana', canvas.width / 2, canvas.height / 2 - 50);
    ctx.fillText('(with correct stroke order!!)', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Write your guess, then two-finger-tap', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText(' to check your answer. Two-finger-tap', canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText('again to move onto next letter', canvas.width / 2, canvas.height / 2 + 90);
    ctx.font = '500px Kozuko';
}

function initCanvas() {
    resizeCanvas();

    ctx.strokeStyle = "red";
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 1;

    ctx.font = '500px Kozuko';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,255,0.5)';

}

function resizeCanvas() {
    ctx.canvas.width = canvasDiv.scrollWidth - canvasBorder * 2;
    ctx.canvas.style.border = canvasBorder + "px solid white";
}

function initStorage() {
    for (var i = 0; i < hiragana.length; i++) {
        var r = hiragana[i] + "r";
        var t = hiragana[i] + "t";
        if (!localStorage[t]) { //if it doesn't exist
            localStorage[r] = localStorage[t] = 0;
        }
    }
}

function newChar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    current = Math.floor(46 * Math.random());
    OCR.initChar(current);

    player.src = "sounds/" + (current + 1) + ".mp3";

    drawing = true;
}

function next() {
    if (drawing) {
        ctx.fillText(hiragana[current], canvas.width / 2, canvas.height / 2);
        check();
    } else {
        newChar();
        player.play();
    }
}

function check() {
    var correct = OCR.isCorrect();

    var r = hiragana[current] + "r";
    var t = hiragana[current] + "t";

    localStorage[t]++;
    if (correct)
        localStorage[r]++;

    //draw correct/wrong symbols
    if (correct) {
        ctx.strokeStyle = "rgba(100,255,100,0.75)";
        ctx.beginPath();
        ctx.moveTo(canvas.width / 4, canvas.height / 2);
        ctx.lineTo(canvas.width / 2, 3 * canvas.height / 4);
        ctx.lineTo(5 * canvas.width / 6, canvas.height / 6);
        ctx.stroke();
    } else {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
    }
    drawing = false;
}
