window.addEventListener('resize', resizeCanvas, false);

//all player handlers in a closure
(function addPlayerHandlers() {
    player.addEventListener('playing', refreshPlaybutton, false);
    player.addEventListener('ended', refreshPlaybutton, false);
    $('playbutton').addEventListener('click', play, false);

    function play() {
        player.load();
        player.play();
    }

    function refreshPlaybutton() {
        $('playbutton').src = (player.paused) ? 'Images/Playbutton On.png' : 'Images/Playbutton Off.png';
    }
})();

//all touch handling in a closure
(function addTouchHandlers() {

    canvas.addEventListener("touchstart", touchstartHandler, false);
    canvas.addEventListener("touchmove", touchmoveHandler, false);
    canvas.addEventListener("touchend", touchendHandler, false);
    canvas.addEventListener("touchcancel", touchcancelHandler, false);

    var prevX;
    var prevY;
    var sensitivity = 10;
    var multitouch = false;

    function touchstartHandler(e) {
        if (e.touches.length > 1) {
            multitouch = true;
            next();
        } else {
            multitouch = false;
            var x = e.touches[0].pageX - canvasDiv.offsetLeft; //e.pageX only works for mobile safari
            var y = e.touches[0].pageY - canvasDiv.offsetTop;
            ctx.beginPath();
            ctx.moveTo(x, y);

            OCR.startStroke();

            prevX = x;
            prevY = y;
        }
    }

    function touchmoveHandler(e) {
        e.preventDefault(); //prevent scrolling
        if (!multitouch) {
            var x = e.touches[0].pageX - canvasDiv.offsetLeft; //e.pageX only works for mobile safari
            var y = e.touches[0].pageY - canvasDiv.offsetTop;
            ctx.lineTo(x, y);
            ctx.stroke();

            var changeX = x - prevX;
            var changeY = y - prevY;
            var d = Math.sqrt(changeX * changeX + changeY * changeY);

            if (d > sensitivity) {
                OCR.partialStroke(changeX, changeY);

                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.moveTo(x, y);

                prevX = x;
                prevY = y;
            }
        }
    }

    function touchendHandler() {
        if (!multitouch) {
            OCR.finishStroke();
        }
    }

    function touchcancelHandler(event) {
        //alert('The application has paused, click to continue');
    }
})();
