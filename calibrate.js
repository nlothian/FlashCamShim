function Config(pImage, pCan) {
    var image = pImage;
    var can = pCan;
    var ctx = can.getContext('2d');
    var canvas_width = can.width;
    var canvas_height = can.height;
    var ui_height = 100;
    var timeoutRef;

    var sensor = new Sensor(can);
    //sensor.left = 15;
    sensor.top = 180;

    image.onload = function(){
        ctx.drawImage(image, 0, 0, can.width, can.height);
        drawCalibrateUI();

    }

    /*
    video.addEventListener("play", function() {
            videoTimerCallback();
          }, false);
    */

    this.sensedColorRange = function() {
        ctx.drawImage(image, 0, 0, can.width, canvas_height);
        return sensor.sensedColorRange();
    }

    this.close = function() {
        if (timeoutRef || false) {
            clearTimeout(timeoutRef);
        }
        ctx.drawImage(image, 0, 0, can.width, canvas_height);
    }

    /*
    function videoTimerCallback() {
        if (video.paused || video.ended) {
            if (timeoutRef || false) {
                clearTimeout(timeoutRef);
            }
        
            return;
        }

        ctx.drawImage(video, 0, 0, can.width, can.height);
        drawCalibrateUI();

        timeoutRef = setTimeout(function () {
                videoTimerCallback();
            }, 250);
    }
    */


    function Sensor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = 50;
        this.height = 50;
        this.left = (this.canvas.width - this.width)/2;
        this.top = (ui_height - this.height)/2

        this.draw = function() {
            this.context.strokeRect(this.left, this.top, this.width, this.height);
        }

        this.sensedColorRange = function () {
            var configArea = this.context.getImageData(this.left, this.top, this.width, this.height);

            var step = 4;
            var len = configArea.data.length;

            var r = 0;
            var g = 0;
            var b = 0;
            var rMin = 130;
            var gMin = 255;
            var bMin = 255;
            var rMax = 0;
            var gMax = 0;
            var bMax = 0;

            var rSum = 0;
            var gSum = 0;
            var bSum = 0;

            for (var i = 0; i < len; i += step) {
                r = configArea.data[i + 0];
                //console.log("red:" + r);
                
                g = configArea.data[i + 1];
                b = configArea.data[i + 2];
                alpha = configArea.data[i + 3];

                if (r < rMin) {rMin = r};
                if (g < gMin) {gMin = g};
                if (b < bMin) {bMin = b};

                if (r > rMax) {rMax = r};
                if (g > gMax) {gMax = g};
                if (b > bMax) {bMax = b};

                rSum += r;
                gSum += g;
                bSum += b;
            }
            
            var rAve = rSum/(len/step);
            var gAve = gSum/(len/step);
            var bAve = bSum/(len/step);

            var maxRGB = {r:rMax, g:gMax, b:bMax};
            var minRGB = {r:rMin, g:gMin, b:bMin};
            var aveRGB = {r:rAve, g:gAve, b:bAve};

            return {max:RGBtoHex(rMax, gMax, bMax), avg:RGBtoHex(rAve, gAve, bAve), min:RGBtoHex(rMin, gMin, bMin),maxRGB:maxRGB,minRGB:minRGB,aveRGB:aveRGB};

        }
    }

    function drawCalibrateUI() {

        var colorRange = sensor.sensedColorRange();

        
        // Should really clean this up some!
        document.getElementById('display').value = colorRange.avg;
        document.getElementById('calibratedcolor').style.borderColor = '#' + colorRange.avg;
        document.getElementById('maxcolor').style.borderColor = '#' + colorRange.max;
        document.getElementById('mincolor').style.borderColor = '#' + colorRange.min;

        ctx.fillStyle = 'rgba(255,255,255, 0.85)';
        ctx.fillRect(0, 0, can.width, ui_height);
        
        ctx.font = '12pt sans-serif';
        ctx.fillStyle = 'rgba(0,0,0, 0.9)';
        ctx.textBaseline = 'middle';
        var text = "Place your marker in the square below";
        var textLen = ctx.measureText(text);
        if (textLen || false) {
            textLen = ctx.mozMeasureText(text);
        }

        ctx.fillText(text, (can.width - textLen)/2, (ui_height)/2);

        sensor.draw();
    }
}
