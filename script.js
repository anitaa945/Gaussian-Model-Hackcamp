// Initialization
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Gaussian Splatting Parameters
const particleCountPerImage = 5000;
let pointsArray = [];

// Function to create Gaussian splatting from a single image
function createGaussianSplatting(image) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(image);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCountPerImage * 3);
    const colors = new Float32Array(particleCountPerImage * 3);

    for (let i = 0; i < particleCountPerImage; i++) {
        // Random positions around the origin
        const x = (Math.random() - 0.5) * 5;
        const y = (Math.random() - 0.5) * 5;
        const z = (Math.random() - 0.5) * 5;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Random color (Gaussian-like effect)
        const color = Math.random();
        colors[i * 3] = color;
        colors[i * 3 + 1] = color * 0.8;
        colors[i * 3 + 2] = color * 0.6;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        map: texture,
        transparent: true,
        depthWrite: false,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    pointsArray.push(points);
    scene.add(points);
}

// Add Interactivity
camera.position.z = 5;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', () => {
    isDragging = true;
});
document.addEventListener('mouseup', () => {
    isDragging = false;
});
document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    pointsArray.forEach((points) => {
        points.rotation.y += deltaX * 0.005;
        points.rotation.x += deltaY * 0.005;
    });

    previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Handle File Upload
document.getElementById('image-input').addEventListener('change', (event) => {
    const files = event.target.files;
    if (!files.length) return;

    // Clear existing points from the scene
    pointsArray.forEach((points) => scene.remove(points));
    pointsArray = [];

    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            createGaussianSplatting(e.target.result);
        };
        reader.readAsDataURL(file);
    });
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    pointsArray.forEach((points) => {
        points.rotation.y += 0.001;
    });

    renderer.render(scene, camera);
}
animate();

// Handle Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
