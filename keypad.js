function Keypad(pImage, pCan, pCalibratedColorRange) {
    var image = pImage;
    var can = pCan;
    var calibratedColorRange = pCalibratedColorRange;

    var ctx = can.getContext('2d');
    var timeoutRef;

    this.enable = function() {
        /*
        timeoutRef = setInterval(function () {
                videoTimerCallback();
            }, 250);
        */
    }


    image.onload = function() {
        ctx.drawImage(image, 0, 0, can.width, can.height);
        var keys = drawKeypad();

        var vecCalibratedAverage = Vector.create([calibratedColorRange.aveRGB.r, calibratedColorRange.aveRGB.g, calibratedColorRange.aveRGB.b]);
        var len = keys.length;
        var minAngle;
        var bestMatch;
        for (var i = 0; i < len; i += 1) {
            var keyColorVec = keys[i].colorVector();

            var angle = keyColorVec.angleFrom(vecCalibratedAverage); // in radian

            // must be a fairly close match to consider
            if (angle < 0.5) {
                if (minAngle || false) {
                    if (angle < minAngle) {
                        minAngle = angle
                        bestMatch = keys[i];
                    }
                } else {
                    minAngle = angle
                    bestMatch = keys[i];
                }
            }

        }

        if (bestMatch || false) {
            document.getElementById('angle').value = minAngle;
            bestMatch.selected();
        }

    }

    function drawKeypad() {
        var padLeft = can.width * 0.125;
        var padTop = can.height * 0.05;
        var padWidth = can.width * 0.75;
        var padHeight = can.height * 0.9;

        var buttonWidth = padWidth/4;
        var buttonHeight = padHeight/4;
        var buttonHPadding = buttonWidth/4;
        var buttonVPadding = buttonHeight/4;

        // setup all the keys before drawing, so they can see the original image
        // need to think of a better way of doing this
        var keys = new Array();
        var num = 0;
        for (var i = 0; i < 3; i += 1) {
            for (var j = 0; j < 3; j += 1) {
                left = padLeft + buttonHPadding + ((buttonWidth + buttonHPadding) * i);
                top = padTop + buttonVPadding + ((buttonHeight + buttonVPadding) * j);

                var key = new Key(ctx, String(num), left, top, buttonWidth, buttonHeight);
                key.onSense = onKeySensed;

                keys[num] = key;

                num++;
            }
        }

        ctx.fillStyle = 'rgba(100,100,100, 0.7)';
        ctx.fillRect(padLeft, padTop, padWidth, padHeight);

        for (var i = 0; i < num; i += 1) {
            keys[i].draw();
        }

        return keys;
    }

    function onKeySensed(character) {
        document.getElementById('key').childNodes[0].nodeValue = character;
    }



    function Key(context, character, left, top, width, height) {
        var context = context;
        var character = character;
        var left = left;
        var right = right;
        var width = width;
        var height = height;
        var savedKeyImg;

        this.draw = function() {
            // need to save the image prior to writing over the top of it
            savedKeyImg = context.getImageData(left, top, width, height);

            drawIt('rgba(255,255,255, 0.8)', 'rgba(0,0,0,1.0)');
        }

        function drawIt(bgFill, fgFill) {
            context.fillStyle = bgFill;
            context.fillRect(left, top, width, height);

            context.fillStyle = fgFill;
            context.font = '20pt sans-serif';
            context.textBaseline = 'middle';
            var textLen = context.measureText(character);
            if (textLen || false) {
                textLen = context.mozMeasureText(character);
            }
            context.fillText(character, left + (width - textLen)/2, top + (height)/2);

        }

        this.colorVector = function() {
            var step = 4;
            var len = savedKeyImg.data.length;

            var r = 0;
            var g = 0;
            var b = 0;
            var rSum = 0;
            var gSum = 0;
            var bSum = 0;

            for (var i = 0; i < len; i += step) {
                r = savedKeyImg.data[i + 0];
                g = savedKeyImg.data[i + 1];
                b = savedKeyImg.data[i + 2];

                rSum += r;
                gSum += g;
                bSum += b;
            }

            var rAve = rSum/(len/step);
            var gAve = gSum/(len/step);
            var bAve = bSum/(len/step);

            return Vector.create([rAve,gAve,bAve]);
        }

        this.selected = function() {
            drawIt('rgba(255,255,255, 1)', 'rgba(0,0,0,1.0)');

            if (this.onSense || false) {
                this.onSense(character);
                return true;
            }
        }
    }

}
