const BACKGROUND_COLOR = '#000000'
const LINE_COLOR = '#FFFFFF';
const LINE_WITDH = 15;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var canvas;
var context;

function prepareCanvas() {
    const ongoingTouches = [];

    function colorForTouch(touch) {
        let r = touch.identifier % 16;
        let g = Math.floor(touch.identifier / 3) % 16;
        let b = Math.floor(touch.identifier / 7) % 16;
        r = r.toString(16); // make it a hex digit
        g = g.toString(16); // make it a hex digit
        b = b.toString(16); // make it a hex digit
        const color = `#${r}${g}${b}`;
        return color;
      }
      function copyTouch({ identifier, pageX, pageY }) {
        return { identifier, pageX, pageY };
      }
      function ongoingTouchIndexById(idToFind) {
        for (let i = 0; i < ongoingTouches.length; i++) {
          const id = ongoingTouches[i].identifier;
      
          if (id === idToFind) {
            return i;
          }
        }
        return -1;    // not found
      }
                  

    function handleStart(evt) {
        evt.preventDefault();
        
        const el = document.getElementById('myCanvas');
        const ctx = el.getContext('2d');
        const touches = evt.changedTouches;
      
        for (let i = 0; i < touches.length; i++) {
          
          ongoingTouches.push(copyTouch(touches[i]));
          const color = colorForTouch(touches[i]);
          
          ctx.beginPath();
          ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
function handleMove(evt) {
  evt.preventDefault();
  const el = document.getElementById('myCanvas');
  const ctx = el.getContext('2d');
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const color = colorForTouch(touches[i]);
    const idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      
      ctx.beginPath();
     
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
    } else {
      
    }
  }
}
function handleEnd(evt) {
    evt.preventDefault();
    
    const el = document.getElementById('myCanvas');
    const ctx = el.getContext('2d');
    const touches = evt.changedTouches;
  
    for (let i = 0; i < touches.length; i++) {
      const color = colorForTouch(touches[i]);
      let idx = ongoingTouchIndexById(touches[i].identifier);
  
      if (idx >= 0) {
        ctx.lineWidth = 4;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
        ongoingTouches.splice(idx, 1);  // remove it; we're done
      } else {
        
      }
    }
  }
  function handleCancel(evt) {
    evt.preventDefault();
    
    const touches = evt.changedTouches;
  
    for (let i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
  }
    
      

    

    console.log('Preparing Canvas');
    
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

        console.log('Mouse pressed.');
        drawLine = true;
        context.beginPath();
         
    });

    document.addEventListener('mousemove', function (event) {
        previousX = currentX;
        currentX = event.clientX - canvas.offsetLeft;

        previousY = currentY;
        currentY = event.clientY - canvas.offsetTop;
        if (drawLine){
            context.moveTo(previousX, previousY);
            context.lineTo(currentX, currentY);
            context.closePath();
            context.stroke();
        }
        

    });

    document.addEventListener('mouseup', function (event) {
        //console.log('X coordiante:' + event.clientX);
        //console.log('Y coordiante:' + event.clientY);
        console.log('Mouse released.');
        drawLine = false;
        
    });

    canvas.addEventListener('mouseleave', function (event) {
        //console.log('X coordiante:' + event.clientX);
        //console.log('Y coordiante:' + event.clientY);
        console.log('Mouse  out of range.');
        drawLine = false;
        
    });

    function startup() {
        const el = document.getElementById('myCanvas');
        el.addEventListener('touchstart', handleStart);
        el.addEventListener('touchend', handleEnd);
        el.addEventListener('touchcancel', handleCancel);
        el.addEventListener('touchmove', handleMove);
        
      }
      
    document.addEventListener("DOMContentLoaded", startup);
    
    
    

    

}

function clearCanvas(){
    
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    context.beginPath();
    
}