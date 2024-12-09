// script.js

// Navigate to the Demo 1 page
function goToDemo() {
    window.location.href = "demo1.html";
}

// Handle the Back button on the Demo 1 page
function goBack() {
    window.location.href = "index.html";
}

// Generate a 3D Model (for Demo 1 only)
function generate3DModel() {
    const modelViewer = document.getElementById("canvas");
    if (!modelViewer) {
        alert("3D model viewer canvas not found.");
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: modelViewer });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x0077be });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}

// Load Gaussian splatting (for Demo 1 only)
if (window.location.pathname.includes("demo1.html")) {
    // Ensure the gsplat viewer works on this page
    document.addEventListener("DOMContentLoaded", () => {
        const canvas = document.getElementById("canvas");
        if (canvas) {
            import('./gsplat/src/gsplatLoad.js')
                .then(() => {
                    console.log("gsplat.js loaded successfully.");
                })
                .catch((err) => {
                    console.error("Error loading gsplat.js:", err);
                });
        }
    });
}
