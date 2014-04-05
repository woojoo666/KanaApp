		function $(id) {return document.getElementById(id);}
		
		var results = $("results");

		var containr = $("containr");

		var cols;
		
		var cellWidth = 85;
		var maxFont = 85;
		var cellspace = 20;
	
		window.addEventListener('resize', resizeTable, false);	
		
		var prevY;
		
		containr.ontouchstart = function (event) {
			prevY = event.pageY;
		}
		
		containr.ontouchmove = function (event) {
			var nextTop = containr.scrollTop + (prevY - event.pageY);
			if (nextTop < 0) {
				containr.scrollTop = 0;
			} else if (nextTop > containr.scrollHeight - containr.clientHeight) {
				containr.scrollTop = containr.scrollHeight - containr.clientHeight;
			} else {
				containr.scrollTop = nextTop;
			}
			prevY = event.pageY;
		};
	
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
	
			//note: final cell width is cellWidth+2 for some reason
			cols = Math.floor((containr.clientWidth - cellspace)/(cellWidth+2+cellspace));
	
			containr.style.overflow = "auto";
	
			var row = document.createElement("tr");
			for(var i = 0; i < hiragana.length; i++) {
				var r = hiragana[i] + "r";
				var t = hiragana[i] + "t";
	//			localStorage[r] = 1;
	//			localStorage[t] = 3;
		
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
	
				cell.myDiv = div;//WHOA WHATS HAPPENING, new property?
				cell.index = i;
	
				cell.onclick = function() {reveal(this);};
	
				if (localStorage[t] > 0) {
					var score = 1-(localStorage[r]*.5/localStorage[t]); //the smaller the better!
					div.style.fontSize = Math.floor(score*maxFont) + "px";
				} else {
					div.style.fontSize = maxFont + "px";
				}
	
	
				if(i%cols == cols-1 || i == hiragana.length - 1) {
					results.appendChild(row);
					row = document.createElement("tr");
				}
			}
		}
		
		function reveal(cell) {
			var div = cell.myDiv;
			var i = cell.index;
			if (div.innerHTML == hiragana[i]) {
				showPercent(cell);
			} else {
				showCharacter(cell);
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
				showAllCharacters();
			}
		}
	
		function showAllPercents() {
			for (var i = 0; i < results.rows.length; i++) {
				for(var j = 0; j < results.rows[i].cells.length; j++) {
					showPercent(results.rows[i].cells[j]);
				}
			}
		}
	
		function showAllCharacters() {
			for (var i = 0; i < results.rows.length; i++) {
				for(var j = 0; j < results.rows[i].cells.length; j++) {
					showCharacter(results.rows[i].cells[j]);
				}
			}
		}
	
		function showPercent(cell) {
			var div = cell.myDiv;
			var i = cell.index;
			var r = hiragana[i] + "r";
			var t = hiragana[i] + "t";
			var score = (localStorage[t] > 0)? (localStorage[r]/localStorage[t]): "NA";
	
			div.style.fontSize = Math.floor(maxFont*.5) + "px";
			var txt = (score == "NA")? "NA" : Math.floor(100*score) + "%";
			div.innerHTML = "<p style='margin-top:0; margin-bottom:0'>" + txt + "</p>"
			var clear = document.createElement('p');
			clear.style.marginTop = 0;
			clear.style.fontSize = Math.floor(maxFont/4) + "px";
			clear.innerHTML = "clear";
			clear.onclick = function() {
				var yes = confirm("Clear Data for " + hiragana[i] + "?");
				if (yes) {
					localStorage.removeItem(r);
					localStorage.removeItem(t);
				}
			};
			div.appendChild(clear);
		}
	
		function showCharacter(cell) {
			var div = cell.myDiv;
			var i = cell.index;
			var r = hiragana[i] + "r";
			var t = hiragana[i] + "t";
			var score = (localStorage[t] > 0)? (localStorage[r]/localStorage[t]): "NA";
			div.style.fontSize = ((score == "NA")? maxFont : Math.floor((1-(score*.5))*maxFont)) + "px";
			div.innerHTML = hiragana[i];
		}