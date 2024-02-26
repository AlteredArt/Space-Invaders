// FISHING GAME

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

// MOUSE
let canvasPosition = canvas.getBoundingClientRect();
// console.log(canvasPosition);
const mouse = {
    x: canvas.width / 2,
    y: canvas.height /2,
    click: false
}

canvas.addEventListener('mousedown', function(event){
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    // console.log(event);
    // console.log(mouse.x, mouse.y);

})

canvas.addEventListener('mouseup', function(event){
   mouse.click = false;
});

// PLAYER

const playerLeft = new Image();
playerLeft.src = 'red_fish_left.png';
const playerRight = new Image();
playerRight.src = 'red_fish_right.png';


class Player {
    // PLAYER CONSTRUCTOR
    constructor(){
        // CANVAS SIZE
        this.x = canvas.width;
        this.y = canvas.height / 2;
        // RADIUS & ANGLE
        this.radius = 50;
        this.angle = 0;
        // FRAME X & Y
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        // SPRITE SIZE
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }

    update(){
        // DELTA X & DELTA Y
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        // THETA & ANGLE
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        // ?
        if (mouse.x != this.x){this.x-= dx / 20;} 
        if (mouse.y != this.y){this.y -= dy / 20;}
    }

    // PLAYER DRAW
    draw(){
        // MOUSE CLICK
        if (mouse.click){
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect( this.x, this.y, this.radius, 10);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this,this.spriteWidth / 4, this.spriteHeight/4);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this,this.spriteWidth / 4, this.spriteHeight/4);
        }
        ctx.restore();
    }
}

// CALL NEW PLAYER
const player = new Player();


// BUBBLE ARRAY
const bubblesArray = [];
// BUBBLE CLASS
class Bubble {
    // BUBBLE CONSTRUCTOR
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        // BUBBLE SPEED
        this.speed = Math.random() * 5 +1;
        this.distance;
        this.counted = false;
        // RANDOMIZE SOUND
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }

    // BUBBLE UPDATE
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }

    // BUBBLE DRAW
    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
}

// BUBBLE SOUND 1
const bubblePop1 = document.createElement('audio');
bubblePop1.src = './assets/sounds/Plop.ogg';

// BUBBLE SOUND 2
const bubblePop2 = document.createElement('audio');
bubblePop2.src = './assets/sounds/bubbles-single2.wav';

function handleBubbles(){

    if (gameFrame % 50 == 0){
        bubblesArray.push(new Bubble());
        // console.log(bubblesArray.length);
    }

    for (let i = 0; i < bubblesArray.length; i++){
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i,1);
        }

        if (bubblesArray[i]){
            if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
                if(!bubblesArray[i].counted){
                    if(bubblesArray[i].sound == 'sound1'){

                    } else {

                    }
                    score++;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i, 1);
                }
            }
        }
        bubblesArray[i].update();
        bubblesArray[i].draw();
    }

}

// ANIMATE FUNCTION
function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50)
    gameFrame++;
    // console.log(gameFrame);
    requestAnimationFrame(animate);
}
// CALL ANIMATE
animate();


// ADD EVENT LISTENER TO PREVENT FLASHING
window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})