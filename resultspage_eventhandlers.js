window.addEventListener('resize', resizeTable, false);

var currentRow;

function rowTouchStart(e) {
    if (e.touches.length == 1) {
        if (currentRow)
            currentRow.hiddenMenu.style.width = 0; //for the previously selected row, rehide its menu
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
    percentsTable.addEventListener("touchstart", touchstartHandler, false);
    percentsTable.addEventListener("touchmove", touchmoveHandler, false);
    percentsTable.addEventListener("touchend", touchendHandler, false);
    percentsTable.addEventListener("touchcancel", touchendHandler, false);

    var startX;
    var MAXWIDTH = 320;

    function touchstartHandler(e) {
        if (e.touches.length == 1)
            startX = e.touches[0].pageX;
    }

    function touchmoveHandler(e) {
        e.preventDefault(); //prevent scrolling
        var x = e.touches[0].pageX;
        if (e.touches.length == 1 && x < startX) {
            currentRow.hiddenMenu.style.width = ((startX - x < MAXWIDTH) ? startX - x : MAXWIDTH) + 'px';
        }
    }

    function touchendHandler(e) {
        var x = e.changedTouches[0].pageX;
        if (e.changedTouches.length == 1 && startX - x < MAXWIDTH) {
            currentRow.hiddenMenu.style.width = 0;
        }
    }
})();
