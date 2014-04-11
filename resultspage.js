var results = $("characterTable");
var containr = $("containr");
var percentsTable = document.getElementById('percentsTable');

var cols;

var cellWidth = 85;
var maxFont = 85;
var cellspace = 20;


var minData = 3; //minimum data points for displaying score in resultpage

var prevY;

/* ISN'T DOING ANYTHING...
        containr.ontouchstart = function(event) {
            prevY = event.touches[0].pageY;
        };

        containr.ontouchmove = function(event) {
            e.preventDefault();
            var nextTop = containr.scrollTop + (prevY - event.touches[0].pageY);
            if (nextTop < 0) {
                containr.scrollTop = 0;
            } else if (nextTop > containr.scrollHeight - containr.clientHeight) {
                containr.scrollTop = containr.scrollHeight - containr.clientHeight;
            } else {
                containr.scrollTop = nextTop;
            }
            prevY = event.touches[0].pageY;
        };*/

function initResults() {
    initCharacterTable();
    initPercentsTable();
    showAllCharacters();
}

function initCharacterTable() {
    results.cellpadding = results.border = "0";
    results.cellSpacing = cellspace;

    containr.style.overflow = "scroll";

    cols = Math.floor((containr.clientWidth - cellspace) / (cellWidth + 2 + cellspace));

    containr.style.overflow = "auto";

    var row = document.createElement("tr");
    for (var i = 0; i < hiragana.length; i++) {
        var r = hiragana[i] + "r";
        var t = hiragana[i] + "t";

        var cell = document.createElement("td");
        cell.style.width = cellWidth + "px";
        cell.style.height = cellWidth + "px";
        row.appendChild(cell);

        var div = document.createElement("div");
        div.style.width = cellWidth + "px";
        div.style.height = cellWidth + "px";
        div.style.overflow = "hidden";
        div.style.color = "white";
        div.innerHTML = hiragana[i];
        cell.appendChild(div);

        if (localStorage[t] > 0) {
            var score = 1 - (localStorage[r] * 0.5 / localStorage[t]); //the smaller the better!
            div.style.fontSize = Math.floor(score * maxFont) + "px";
        } else {
            div.style.fontSize = maxFont + "px";
        }


        if (i % cols == cols - 1 || i == hiragana.length - 1) {
            results.appendChild(row);
            row = document.createElement("tr");
        }
    }
}

function clearAll() {
    var yes = confirm("Clear All Data?");
    if (yes) {
        for (var i = 0; i < hiragana.length; i++) {
            var r = hiragana[i] + "r";
            var t = hiragana[i] + "t";
            localStorage.removeItem(r);
            localStorage.removeItem(t);
        }
    }
}

function showAllPercents() {
    results.style.display = "none";
    percentsTable.style.display = "block";
}

function showAllCharacters() {
    results.style.display = "block";
    percentsTable.style.display = "none";
}

function refresh() {
    results.innerHTML = "";
    percentsTable.innerHTML = "";
    initResults();
}

function initPercentsTable() {
    for (var i = 0; i < hiragana.length; i++) {

        var r = hiragana[i] + "r";
        var t = hiragana[i] + "t";
        var score = (localStorage[t]) ? localStorage[r] / localStorage[t] : "NA";

        var row = document.createElement('div');
        row.on = true;
        row.index = i;
        row.className = "percentsRow";
        row.addEventListener("touchstart", rowTouchStart, false);

        var left = document.createElement('div');
        left.className = 'leftDiv';
        left.innerHTML = hiragana[i] + ":";

        var percentDiv = document.createElement('div');
        percentDiv.className = 'percentDiv';

        var percent = document.createElement('div');
        percent.className = 'percent';
        percent.innerHTML = (score || score === 0) ? Math.floor(score * 100) + "%" : "NA";
        percent.style.width = Math.floor((score || 0)*100) + '%';
        percentDiv.appendChild(percent);

        row.hiddenMenu = document.createElement('div');
        row.hiddenMenu.className = 'hiddenMenu';
        row.hiddenMenu.style.width = 0;

        var onoff = document.createElement('span');
        onoff.className = 'onoffDiv';
        onoff.innerHTML = "disable";
        onoff.onclick = toggle;

        var clear = document.createElement('span');
        clear.className = 'clearDiv';
        clear.innerHTML = "clear";
        clear.onclick = clearcell;

        row.hiddenMenu.appendChild(onoff);
        row.hiddenMenu.appendChild(clear);

        row.appendChild(left);
        row.appendChild(row.hiddenMenu);
        row.appendChild(percentDiv);
        percentsTable.appendChild(row);
    }
}

function toggle() {
    var row = this.parentNode;
    row.on = !row.on;
    if (row.on) {
        this.innerHTML = "disable";
        row.style.color = "rgba(255,255,255,1)";
    } else {
        this.innerHTML = "enable";
        row.style.color = "rgba(255,255,255,0.5)";
    }
}

function clearcell() {
    var row = this.parentNode;
    var i = row.index;
    var r = hiragana[i] + "r";
    var t = hiragana[i] + "t";
    var yes = confirm("Clear Data for " + hiragana[i] + "?");
    if (yes) {
        localStorage.removeItem(r);
        localStorage.removeItem(t);
    }
}
