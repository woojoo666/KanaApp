window.addEventListener('resize', resizeTable, false);

var currentRow;

function hiddenMenuTouched() {
    event.stopPropagation();
    event.preventDefault();
}

function rowTouchStart(e) {
    if (e.touches.length == 1) {
        if (currentRow) {
            currentRow.hiddenMenu.style.width = 0; //for the previously selected row, rehide its menu
            currentRow.arrow.innerHTML = '<';
        }
        currentRow = this;
    }
}

function resizeTable() {
    containr.removeChild(results);
    results = document.createElement('table');
    containr.appendChild(results);
    initResults();
}

//all touch handling in a closure
(function addTouchHandlers() {
    containr.addEventListener("touchstart", touchstartHandler, false);
    containr.addEventListener("touchmove", touchmoveHandler, false);
    containr.addEventListener("touchend", touchendHandler, false);
    containr.addEventListener("touchcancel", touchendHandler, false);

    var startX;
    var prevY;
    var MAXWIDTH = 290; //onoffDiv + clearDiv

    function touchstartHandler(e) {
        if (e.touches.length == 1) {
            startX = e.touches[0].pageX;
            prevY = event.touches[0].pageY;
        }
    }

    function touchmoveHandler(e) {
        e.preventDefault(); //prevent scrolling
        var x = e.touches[0].pageX;
        if (currentRow && e.touches.length == 1 && x < startX) {
            currentRow.hiddenMenu.style.width = ((startX - x < MAXWIDTH) ? startX - x : MAXWIDTH) + 'px';
        }

        var nextTop = containr.scrollTop + (prevY - event.touches[0].pageY);
        if (nextTop < 0) {
            containr.scrollTop = 0;
        } else if (nextTop > containr.scrollHeight - containr.clientHeight) {
            containr.scrollTop = containr.scrollHeight - containr.clientHeight;
        } else {
            containr.scrollTop = nextTop;
        }
        prevY = event.touches[0].pageY;
    }

    function touchendHandler(e) {
        var x = e.changedTouches[0].pageX;
        if (currentRow) { //in case we're on characters table and there's no current Row
            if (e.changedTouches.length == 1 && startX - x < MAXWIDTH) {
                currentRow.hiddenMenu.style.width = 0;
            } else {
                currentRow.arrow.innerHTML = '&nbsp';
            }
        }
    }
})();
