const BACKGROUND_COLOR = '#000000'
const LINE_COLOR = '#FFFFFF';
const LINE_WITDH = 15;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var canvas;
var context;
var drawLine = false;

function prepareCanvas() {
    //console.log('Preparing Canvas');

    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WITDH;
    context.lineJoin = 'round';

    document.addEventListener('mousedown', function (event) {
        //console.log('X coordiante:' + event.clientX);
        //console.log('Y coordiante:' + event.clientY);

        //console.log('Mouse pressed.');
        drawLine = true;
        context.beginPath();

    });

    document.addEventListener('mousemove', function (event) {
        previousX = currentX;
        currentX = event.clientX - canvas.offsetLeft;

        previousY = currentY;
        currentY = event.clientY - canvas.offsetTop;
        if (drawLine) {
            context.moveTo(previousX, previousY);
            context.lineTo(currentX, currentY);
            context.closePath();
            context.stroke();
        }


    });

    document.addEventListener('mouseup', function (event) {
        //console.log('X coordiante:' + event.clientX);
        //console.log('Y coordiante:' + event.clientY);
       // console.log('Mouse released.');
        drawLine = false;

    });

    canvas.addEventListener('mouseleave', function (event) {
        //console.log('X coordiante:' + event.clientX);
        //console.log('Y coordiante:' + event.clientY);
        //console.log('Mouse  out of range.');
        drawLine = false;

    });




    canvas.addEventListener('touchstart', function (event) {
       // console.log('Touchstart.');
        drawLine = true;

        previousX = currentX;
        currentX = event.touches[0].clientX - canvas.offsetLeft;

        previousY = currentY;
        currentY = event.touches[0].clientY - canvas.offsetTop;

        context.beginPath();
    });

    canvas.addEventListener('touchmove', function (event) {
        //console.log('Touchmove.');
        previousX = currentX;
        currentX = event.touches[0].clientX - canvas.offsetLeft;

        previousY = currentY;
        currentY = event.touches[0].clientY - canvas.offsetTop;

        if (drawLine) {
            context.moveTo(previousX, previousY);
            context.lineTo(currentX, currentY);
            context.closePath();
            context.stroke();
        }


    });

    canvas.addEventListener('touchend', function (event) {
        //console.log('X coordiante:' + event.clientX);
        //console.log('Y coordiante:' + event.clientY);
        //console.log('Touchend.');
        drawLine = false;

    });








}

function clearCanvas() {

    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.beginPath();

}