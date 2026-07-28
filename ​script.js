const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 50;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class PixelParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2; // Pixel block size
        this.speedY = Math.random() * 1 - 0.5; // Drift speed
        this.speedX = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.6 + 0.1;
    }
    update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        // Reset if it floats off-screen
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(0, 243, 255, ${this.opacity})`;
        // Drawing squares instead of circles gives it that retro pixel/tech feel
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new PixelParticle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
