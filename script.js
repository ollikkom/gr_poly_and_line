document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('my-canvas');

    var ctx = canvas.getContext("2d");

    var fragmentSize = 2;
    var polygonPainted = false;
    var lastClickCoords = { x: 0, y: 0 };
    var firstClickCoords = { x: 0, y: 0 };
    var secondClickCoords = { x: 0, y: 0 };

    var clickCounter = 0;

    function onWindowResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    onWindowResize();

    window.addEventListener('resize', onWindowResize);

    canvas.addEventListener('click', onClickDraw);

    function onClickDraw(e) {
        var x = e.clientX;
        var y = e.clientY;

        ctx.strokeStyle = "#F972FF";
        ctx.fillStyle = "#F972FF";

        clickCounter++;

        if (!polygonPainted) {
            if (clickCounter === 1) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                firstClickCoords = { x: x, y: y };
            } else {
                if (Math.abs(firstClickCoords.x - x) < 10 && Math.abs(firstClickCoords.y - y) < 10) {
                    ctx.fill();
                    ctx.clip();
                    clickCounter = 0;
                    polygonPainted = true;
                } else {
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        } else {
            if (clickCounter % 2) {
                firstClickCoords = { x: x, y: y };
                secondClickCoords = firstClickCoords;
            } else {
                secondClickCoords = { x: x, y: y };
                ctx.fillStyle = "#74d4ff";
                drawLine(firstClickCoords, secondClickCoords);
            }
        }

        lastClickCoords = { x: x, y: y };
    }

    function drawLine(start, end) {
        var deltaX = end.x - start.x;
        var deltaY = end.y - start.y;

        var absDeltaX = Math.abs(deltaX);
        var absDeltaY = Math.abs(deltaY);

        var deltas = { x: deltaX, y: deltaY };
        var absDeltas = { x: absDeltaX, y: absDeltaY };

        var mainDir = absDeltaX > absDeltaY ? 'x' : 'y';
        var secondaryDir = absDeltaX > absDeltaY ? 'y' : 'x';

        var secondaryVar = start[secondaryDir];
        var secondaryEnd = deltas[secondaryDir] > 0 ? end[secondaryDir] : start[secondaryDir];
        var directionOfSecondary = (secondaryEnd - secondaryVar > 0) ? 1 : -1;

        var err = 0;
        var deltaErr = absDeltas[secondaryDir];

        var calcAndDraw = function (loopVar, mainDelta) {
            var fillX = mainDir === 'x' ? loopVar : secondaryVar;
            var fillY = mainDir === 'x' ? secondaryVar : loopVar;

            ctx.fillRect(fillX, fillY, fragmentSize, fragmentSize);
            err = err + deltaErr;

            if (2 * err >= mainDelta) {
                secondaryVar = secondaryVar + directionOfSecondary;
                err = err - mainDelta;
            }
        };

        if (deltas[mainDir] > 0) {
            for (var loopVar = start[mainDir]; loopVar <= end[mainDir]; loopVar++) {
                calcAndDraw(loopVar, deltas[mainDir]);
            }
        } else {
            for (var loopVar = start[mainDir]; loopVar >= end[mainDir]; loopVar--) {
                calcAndDraw(loopVar, absDeltas[mainDir]);
            }
        }
    }
});

