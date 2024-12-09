import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create scene
const scene = new THREE.Scene();
scene.background = null; // Make background transparent

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Adjust camera position
camera.lookAt(0, 0, 0);

// Create renderer with transparency
const renderer = new THREE.WebGLRenderer({ 
    alpha: true, // Enable transparency
    antialias: true // Smoother edges
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Transparent background

// Get the container element and append the renderer
const container = document.getElementById('container3D');
container.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.autoRotate = true; // Auto rotate the model
controls.autoRotateSpeed = 2.0; // Rotation speed

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Brighter ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Add point lights for better illumination
const pointLight1 = new THREE.PointLight(0xffffff, 1);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1);
pointLight2.position.set(-10, -10, -10);
scene.add(pointLight2);

// Load 3D Model
const loader = new GLTFLoader();
let model; // Store model reference for animations

loader.load(
    '/pages/exp/models/burger', // Update this path to your model
    function (gltf) {
        model = gltf.scene;
        
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Scale model to fit scene
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim; // Adjust this value to change model size
        model.scale.multiplyScalar(scale);
        
        scene.add(model);
        
        // Add click interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        container.addEventListener('click', (event) => {
            // Calculate mouse position in normalized device coordinates
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObject(model, true);

            if (intersects.length > 0) {
                // Model clicked - add your interaction here
                console.log('Model clicked!');
                // Example: Toggle auto-rotation
                controls.autoRotate = !controls.autoRotate;
            }
        });
        
        console.log('Model loaded successfully');
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error occurred loading the model:', error);
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Add any custom animations here
    if (model) {
        // Example: Gentle floating motion
        model.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start animation
animate();
