/* script.js */
function generate3DModel() {
    const fileInput = document.getElementById("imageInput").files[0];
    if (!fileInput) {
        alert("Please upload an image to generate a 3D model.");
        return;
    }

    // Hide input elements and show back button
    document.getElementById("imageInput").style.display = "none";
    document.querySelector("button[onclick='generate3DModel()']").style.display = "none";
    document.getElementById("backButton").style.display = "block";

    // Switch to full screen when the model is generated
    const container = document.getElementById("container");
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.mozRequestFullScreen) { // Firefox
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) { // Chrome, Safari and Opera
        container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) { // IE/Edge
        container.msRequestFullscreen();
    }

    const modelViewer = document.getElementById("modelViewer");
    modelViewer.innerHTML = ""; // Clear previous model

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    modelViewer.appendChild(renderer.domElement);

    const reader = new FileReader();
    reader.onload = function (event) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(event.target.result, function (texture) {
            const geometry = new THREE.PlaneGeometry(5, 5);
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
            const plane = new THREE.Mesh(geometry, material);
            scene.add(plane);

            camera.position.z = 5;
            // Controls to move around the 3D model
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableZoom = true;
            controls.enablePan = true;
            controls.enableRotate = true;

            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }

            animate();
        }, undefined, function (err) {
            alert("Error loading texture. Please try again with a different image.");
        });
    };
    reader.readAsDataURL(fileInput);
}

function goBackToMainPage() {
    // Show input elements and hide back button
    document.getElementById("imageInput").style.display = "block";
    document.querySelector("button[onclick='generate3DModel()']").style.display = "block";
    document.getElementById("backButton").style.display = "none";

    // Clear the 3D model viewer
    const modelViewer = document.getElementById("modelViewer");
    modelViewer.innerHTML = "";
}
// Assuming we have generated a point cloud from the input image
const pointCloudGeometry = new THREE.BufferGeometry();
const pointsMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        attribute float size;
        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        void main() {
            // Gaussian falloff function
            float distanceToCenter = length(gl_PointCoord - vec2(0.5));
            if (distanceToCenter > 0.5) discard;
            float alpha = exp(-distanceToCenter * distanceToCenter * 10.0);
            gl_FragColor = vec4(color, alpha);
        }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
});

// Example to set up the point cloud using Three.js
const pointCloud = new THREE.Points(pointCloudGeometry, pointsMaterial);
scene.add(pointCloud);
