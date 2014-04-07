        var results = $("results");
        var containr = $("containr");

        var cols;

        var cellWidth = 85;
        var maxFont = 85;
        var cellspace = 20;


        var minData = 3; //minimum data points for displaying score in resultpage

        var prevY;

        window.addEventListener('resize', resizeTable, false);

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

        function resizeTable() {
            containr.removeChild(results);
            results = document.createElement('table');
            containr.appendChild(results);
            initTable();
        }

        function initTable() {
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
                    var score = 1 - (localStorage[r] * .5 / localStorage[t]); //the smaller the better!
                    div.style.fontSize = Math.floor(score * maxFont) + "px";
                } else {
                    div.style.fontSize = maxFont + "px";
                }


                if (i % cols == cols - 1 || i == hiragana.length - 1) {
                    results.appendChild(row);
                    row = document.createElement("tr");
                }
            }

            initSecondTable();
            showAllCharacters();
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
            listtable.style.display = "block";
        }

        function showAllCharacters() {
            results.style.display = "block";
            listtable.style.display = "none";
        }

        function refresh() {
            results.innerHTML = "";
            listtable.innerHTML = "";
            initTable();
        }


        var listtable = document.getElementById('listtable');
        var totalwidth = 400;
        var maxwidth = 300;
        var minwidth = 10;

        function initSecondTable() {
            for (var i = 0; i < hiragana.length; i++) {

                var r = hiragana[i] + "r";
                var t = hiragana[i] + "t";
                var score = (localStorage[t]) ? localStorage[r] / localStorage[t] : "NA";

                var row = document.createElement('tr');
                row.on = true;
                row.index = i;
                row.style.textAlign = "left";
                var left = document.createElement('td');
                left.innerHTML = hiragana[i] + ":";

                var middle = document.createElement('td');
                middle.style.width = totalwidth + "px";
                var textspace = document.createElement('span');
                textspace.style.float = "left";
                textspace.style.textAlign = "right";
                textspace.innerHTML = (localStorage[t]) ? Math.floor(score * 100) + "%" : "NA";
                textspace.style.width = (localStorage[t]) ? Math.floor(score * (maxwidth - minwidth) + minwidth) + "px" : minwidth + "px";
                middle.appendChild(textspace);

                var right = document.createElement('td');
                right.innerHTML = "On";
                right.onclick = function() {
                    toggle(this);
                };

                var clear = document.createElement('td');
                clear.innerHTML = "clear";
                clear.onclick = function() {
                    clearcell(this);
                };

                row.appendChild(left);
                row.appendChild(middle);
                row.appendChild(right);
                row.appendChild(clear);
                listtable.appendChild(row);
            }
        }

        function toggle(m) {
            var row = m.parentNode;
            row.on = !row.on;
            if (row.on) {
                m.innerHTML = "On";
                row.style.color = "rgba(255,255,255,1)";
            } else {
                m.innerHTML = "Off";
                row.style.color = "rgba(255,255,255,0.5)";
            }
        }

        function clearcell(m) {
            var row = m.parentNode;
            var i = row.index;
            var r = hiragana[i] + "r";
            var t = hiragana[i] + "t";
            var yes = confirm("Clear Data for " + hiragana[i] + "?");
            if (yes) {
                localStorage.removeItem(r);
                localStorage.removeItem(t);
            }
        }
