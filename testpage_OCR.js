var OCR = (function() {

    var strokes; //an array containing the checkpoints for the current character
    var progress; //which checkpoint you just got to
    var currentStroke; //which stroke your on
    var correct; //if your character is currently correct

    var _return = {};

    _return.initChar = function(c) {
        strokes = strokesForChar[c].split(" ");
        currentStroke = 0;
        correct = true;
    };

    _return.startStroke = function() {
        console.log('start stroke');
        progress = -1;
    };

    _return.partialStroke = function(x, y) {
        console.log('partial stroke');
        var cardinal = this.cardinalize(x, y);
        this.checkProgress(cardinal);
    };

    _return.finishStroke = function() {
        if (currentStroke < strokes.length && (2 * (progress + 1)) > strokes[currentStroke].length) {
            //alert('YAY');
        } else {
            correct = false;
        }
        currentStroke++;
    };

    _return.cardinalize = function(x, y) {
        var theta = (y > 0) ? Math.acos(x / Math.sqrt(x * x + y * y)) : 2 * Math.PI - Math.acos(x / Math.sqrt(x * x + y * y));
        return (Math.round(theta * 4 / Math.PI)) % 8;
    };

    _return.checkProgress = function(card) {
        if (currentStroke < strokes.length && (2 * (progress + 1)) < strokes[currentStroke].length) {
            var checkpoint = parseInt(strokes[currentStroke].charAt(2 * (progress + 1)), 10);
            if (card == checkpoint || card == (checkpoint - 1) % 8 || card == (checkpoint + 1) % 8) {
                progress++;
            }
        }
    };

    _return.isCorrect = function() {
        return (currentStroke == strokes.length && correct);
    };


    /* Cardinal directions:
     *     5 6 7
     *     4   0
     *     3 2 1
     */

    /* Each string encodes the strokes that make up a character
     * E.g. strokes[4] contains the 3 strokes for hiragana[4] (お)
     * Each string is made up of strokes (separated by a space),
     *   and each stroke is made up of a sequence of cardinal
     *   directions (represented by numbers).
     * E.g., strokes[2] has two strokes, with the first stroke being
     *   a south-east line, and the second stroke being a curve from
     *   east to south-west.
     * Note: 'o' means a smooth transition (like a curve) and 'v' means sharp transition,
     *   but I haven't implemented this yet
     */
    var strokesForChar = [
        '0 2 3o0o3',
        '2 1',
        '1 0o3',
        '1 0v3v7o2o0',
        '0 2o0o3', //??
        '0o3', //??
        '0 0 1 3o7',
        '3v1',
        '2 0 2o3',
        '0 3o0',
        '0o3 1 1',
        '0 0 1 3o7 1 1',
        '3v1 1 1',
        '2 0 2o3 1 1',
        '0 3o0 1 1',
        '0 1 3o7',
        '2o7',
        '0 2o6o2o3',
        '0 2 2o0',
        '0 3v4v3o0',
        '0 1 3o7 1 1',
        '2o7 1 1',
        '0 2o6o2o3 1 1',
        '0 2 2o0 1 1',
        '0 3v4v3o0 1 1',
        '0 3 0 3o0',
        '0 3v7o4',
        '0o4',
        '0v3o0',
        '2 3o0',
        '0 3 0 3o0 1 1',
        '0 3v7o4 1 1',
        '0o4 1 1',
        '0v3o0 1 1',
        '2 3o0 1 1',
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
        '2 0 2o0o1 1 1',
        '0v3o0o6v1 1 1',
        '1 3o1o5 3 1 1 1',
        '7v1 1 1',
        '2 0 0 2o4o1 1 1',
        '2 0 2o0o1 4o0o4',
        '0v3o0o6v1 4o0o4',
        '1 3o1o5 3 1 4o0o4',
        '7v1 4o0o4',
        '2 0 0 2o4o1 4o0o4',
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
        '3v7o2o7'
    ];

    return _return;
})();
