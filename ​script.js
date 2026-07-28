const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ==========================================
// System 1: The Grid and Dead Pixel
// ==========================================
let squaresArray = [];
const gridSize = 30; // Spacing between squares
const cellSize = 6;  // Size of each square

function initGrid() {
    squaresArray = [];
    for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
            squaresArray.push({
                x: x,
                y: y,
                // Default subtle glow opacity
                alpha: Math.random() * 0.15 + 0.05
            });
        }
    }
}

// Pick one specific square to be the 'Dead Pixel'
const deadPixelIndex = Math.floor(Math.random() * squaresArray.length);

const glitchColors = [
    { rgb: '255, 0, 0', glow: '#ff0000' },     // Vibrant Red
    { rgb: '0, 255, 255', glow: '#00ffff' },   // Cyan
    { rgb: '0, 255, 0', glow: '#00ff00' },     // Green
    { rgb: '255, 255, 0', glow: '#ffff00' },   // Yellow
    { rgb: '255, 0, 255', glow: '#ff00ff' }    // Magenta
];

// Color glitch logic: Changes color every few seconds
setInterval(() => {
    // Only glitch if the pixel exists
    if (squaresArray[deadPixelIndex]) {
        squaresArray[deadPixelIndex].alpha = 0.9; // Boost visibility
        const color = glitchColors[Math.floor(Math.random() * glitchColors.length)];
        squaresArray[deadPixelIndex].color = color;
    }
}, Math.random() * 2000 + 1500); // Glitches randomly between 1.5s and 3.5s

function drawGrid() {
    for (let i = 0; i < squaresArray.length; i++) {
        let sq = squaresArray[i];

        if (i === deadPixelIndex && sq.color) {
            // Drawing the special DEAD PIXEL with vibrant glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = sq.color.glow;
            ctx.fillStyle = `rgba(${sq.color.rgb}, ${sq.alpha})`;
            ctx.fillRect(sq.x, sq.y, cellSize, cellSize);
            ctx.shadowBlur = 0; // Reset blur for other pixels
        } else {
            // Default subtle white pixels
            ctx.fillStyle = `rgba(255, 255, 255, ${sq.alpha})`;
            ctx.fillRect(sq.x, sq.y, cellSize, cellSize);
        }
    }
}


// ==========================================
// System 2: The Ghostly Figure
// ==========================================
// We will define the ghost shape as simple arcs and lines
const ghostX = canvas.width / 2; // Position in center
const ghostY = canvas.height * 0.75; // Position near bottom
const ghostBaseWidth = 120;
const ghostHeight = 180;

function drawGhost() {
    // Extremely subtle color: --off-black from CSS, very low alpha
    ctx.strokeStyle = `rgba(5, 5, 5, 0.1)`; 
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0; // The ghost itself doesn't glow much

    // A stylized hood or form shape
    ctx.beginPath();
    ctx.moveTo(ghostX - ghostBaseWidth / 2, ghostY);
    ctx.lineTo(ghostX - ghostBaseWidth / 2 + 10, ghostY - ghostHeight * 0.4);
    ctx.quadraticCurveTo(ghostX, ghostY - ghostHeight - 20, ghostX + ghostBaseWidth / 2 - 10, ghostY - ghostHeight * 0.4);
    ctx.lineTo(ghostX + ghostBaseWidth / 2, ghostY);
    ctx.stroke();

    // Subtle outline of eyes or logic core inside the figure
    ctx.strokeRect(ghostX - 15, ghostY - ghostHeight * 0.65, 8, 8);
    ctx.strokeRect(ghostX + 7, ghostY - ghostHeight * 0.65, 8, 8);
}


// ==========================================
// System 3: Smoke Engine (Grey and Red)
// ==========================================
let smokeParticles = [];
const maxSmoke = 80;

class SmokeParticle {
    constructor() {
        this.x = ghostX + (Math.random() - 0.5) * (ghostBaseWidth * 0.8);
        this.y = ghostY + Math.random() * 20; // Starts from ghost base
        this.size = Math.random() * 15 + 10;
        this.vy = -(Math.random() * 0.8 + 0.3); // Rising speed
        this.vx = (Math.random() - 0.5) * 0.6; // Slight horizontal drift
        this.alpha = 0.4;
        this.shrinkRate = Math.random() * 0.05 + 0.02;
        this.fadeRate = Math.random() * 0.003 + 0.001;
        
        // ** Tasteful Red smoke logic **
        // 93% chance of Grey smoke, 7% chance of Red smoke
        if (Math.random() < 0.07) {
            this.color = { rgb: '255, 0, 0', glow: '#ff0000' }; // Vibrant Red
        } else {
            this.color = { rgb: '85, 85, 85', glow: 'transparent' }; // Grey smoke
        }
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;
        this.size -= this.shrinkRate;
        this.alpha -= this.fadeRate;
        
        // Add subtle natural "weave" to smoke
        this.vx += (Math.random() - 0.5) * 0.1;
    }

    draw() {
        if (this.size > 0 && this.alpha > 0) {
            ctx.fillStyle = `rgba(${this.color.rgb}, ${this.alpha})`;
            
            // Red smoke needs a subtle glow
            if (this.color.glow !== 'transparent') {
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color.glow;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
        }
    }
}

function spawnSmoke() {
    if (smokeParticles.length < maxSmoke) {
        smokeParticles.push(new SmokeParticle());
    }
}

function updateSmoke() {
    for (let i = 0; i < smokeParticles.length; i++) {
        smokeParticles[i].update();
        if (smokeParticles[i].size <= 0 || smokeParticles[i].alpha <= 0) {
            smokeParticles.splice(i, 1);
            i--;
        }
    }
}

function drawSmoke() {
    for (let i = 0; i < smokeParticles.length; i++) {
        smokeParticles[i].draw();
    }
}


// ==========================================
// Main Animation Loop
// ==========================================
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw the hidden ghost figure first (so smoke sits on top)
    drawGhost();

    // 2. Spawn and Update Smoke
    spawnSmoke();
    updateSmoke();
    drawSmoke();

    // 3. Draw the background grid and the specific DEAD PIXEL
    drawGrid();

    requestAnimationFrame(animate);
}

// Handle resizing (we need to redraw the ghost/grid center)
window.addEventListener('resize', () => {
    resizeCanvas();
    // Re-initialize ghost position if needed, though they are center-based already
    // but the grid coordinates will need updating.
    initGrid();
});

initGrid();
animate();
