import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// dat gui voor de zon en klok
const gui = new dat.GUI();
const clockControl = {
    hour: 12, // Default tijd is 12 uur (middag)
};

// Zon
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(sunLight);

// Zon als object
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Zon in GUI
const sunFolder = gui.addFolder('Zon');
sunFolder.add(sunLight.position, 'x', -10, 10);
sunFolder.add(sunLight.position, 'y', -10, 30);  // Zonpositie aanpassen
sunFolder.add(sunLight.position, 'z', -10, 10);
sunFolder.add(sunLight, 'intensity', 0, 1);

// Klok GUI voor het instellen van het uur van de dag
const timeFolder = gui.addFolder('Tijd');
timeFolder.add(clockControl, 'hour', 0, 24, 1).name('Uur van de dag').onChange(updateSunPosition);

// Ambient light (blauwachtige lucht)
const ambientLight = new THREE.AmbientLight(0x87ceeb, 0.5); // Lucht
scene.add(ambientLight);

// Orbit controls voor de camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Blauwe lucht
const skyColor = new THREE.Color(0x87ceeb); // Blauwe lucht
scene.background = skyColor;

// Wolken (beweging)
const cloudTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/skybox/px.jpg'); // Wolktextuur
const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.8,
});
const cloudGeometry = new THREE.PlaneGeometry(30, 30);
const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud.position.set(0, 15, 0); // Wolken in de lucht
cloud.rotation.x = Math.PI / 2;
scene.add(cloud);

// Beweeg de wolken
let cloudSpeed = 0.02; // Snellere beweging
function moveClouds() {
    cloud.position.x += cloudSpeed;
    if (cloud.position.x > 30) {
        cloud.position.x = -30;
    }
}

// Groene grond
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide }); // Groene kleur voor de grond
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2;
ground.position.y = -1; // Plattegrond op de grond
scene.add(ground);


// Huis met muren, dak en deur
const brickTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/brick_diffuse.jpg'); // Baksteentextuur

// Vloer van het huis
const floorGeometry = new THREE.BoxGeometry(5, 0.1, 5);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// Muren
const brickMaterial = new THREE.MeshStandardMaterial({
    map: brickTexture,
    roughness: 0.5,
    metalness: 0.1
});
const wall1 = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 0.1), brickMaterial);
wall1.position.set(0, 0.5, -2.5);
scene.add(wall1);

const wall2 = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 0.1), brickMaterial);
wall2.position.set(0, 0.5, 2.5);
scene.add(wall2);

const wall3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3, 5), brickMaterial);
wall3.position.set(-2.5, 0.5, 0);
scene.add(wall3);

const wall4 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3, 5), brickMaterial);
wall4.position.set(2.5, 0.5, 0);
scene.add(wall4);

// Dak van het huis
const roofGeometry = new THREE.ConeGeometry(4, 2, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 3;
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
scene.add(roof);

// Deur met textuur
const doorTexture = new THREE.TextureLoader().load('/wood.jpg');
const doorMaterialWithTexture = new THREE.MeshStandardMaterial({
    map: doorTexture,
    roughness: 0.8,
    metalness: 0.1
});
const doorGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.05);
const door = new THREE.Mesh(doorGeometry, doorMaterialWithTexture);
door.position.set(0, -0.25, -2.5);
door.castShadow = true;
scene.add(door);

// Schilderij in het huis
const paintingTexture = new THREE.TextureLoader().load('/fit.jpg');
const paintingGeometry = new THREE.PlaneGeometry(1, 1.5);
const paintingMaterial = new THREE.MeshStandardMaterial({
    map: paintingTexture,
});
const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
painting.position.set(0, 0, 2.4);
painting.rotation.y = Math.PI;
scene.add(painting);

// Camera animatie
camera.position.z = 10;
const clock = new THREE.Clock();
let animateCamera = true;
function animate() {
    if (animateCamera) {
        camera.position.x += 0.05;
        camera.position.z -= 0.05;
        if (camera.position.z < 5) animateCamera = false;
    }

    moveClouds();  // Beweeg de wolken
    updateSunPosition(clockControl.hour); // Pas zon positie aan
    controls.update();
    renderer.render(scene, camera);
}

// Zon positie en intensiteit aanpassen op basis van het uur van de dag
function updateSunPosition(hour) {
    let intensity = 0;
    let yPos = 0;

    // Zonintensiteit & positie aanpassen afhankelijk van het uur
    if (hour >= 6 && hour <= 18) {
        intensity = Math.min(1, (hour - 6) / 12); // Intensiteit stijgt van 6u tot 18u
        yPos = Math.sin((hour - 6) / 12 * Math.PI); // Zon volgt de curve van de hemel
    } else {
        intensity = 0.1; // Zon in de nacht is heel zwak
        yPos = Math.sin((hour - 6) / 12 * Math.PI); // Zon in de nacht, maar wel een negatieve hoogte
    }

    sunLight.intensity = intensity;
    sun.position.y = 10 * yPos; // Zonhoogte
    sun.position.x = 10 * Math.cos((hour / 24) * 2 * Math.PI); // Zon beweegt in een cirkel
    sun.position.z = 10 * Math.sin((hour / 24) * 2 * Math.PI); // Zon beweegt in een cirkel
}

// Resizes the renderer and camera when the window size changes
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Begin animatie na 2 seconden
setTimeout(() => {
    animateCamera = true;
}, 2000);
