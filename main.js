// Imports en basis setup
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

// GUI controls voor zon en tijd
const gui = new dat.GUI();
const clockControl = { hour: 12 };

// Zonlicht
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(sunLight);

// Zon object
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// GUI setup voor zon en tijd
const sunFolder = gui.addFolder('Sun');
sunFolder.add(sunLight.position, 'x', -10, 10);
sunFolder.add(sunLight.position, 'y', -10, 30);
sunFolder.add(sunLight.position, 'z', -10, 10);
sunFolder.add(sunLight, 'intensity', 0, 1);

const timeFolder = gui.addFolder('Time');
timeFolder.add(clockControl, 'hour', 0, 24, 1).name('Hour').onChange(updateSunPosition);

// Omgevingslicht
const ambientLight = new THREE.AmbientLight(0x87ceeb, 0.5);
scene.add(ambientLight);

// Camera besturing
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
scene.background = new THREE.Color(0x87ceeb);

// Grond
const groundGeometry = new THREE.PlaneGeometry(400, 400);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x226B22, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

// Villa basis
const villaFloorGeometry = new THREE.BoxGeometry(8, 0.1, 8);
const villaFloorMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d });
const villaFloor = new THREE.Mesh(villaFloorGeometry, villaFloorMaterial);
villaFloor.position.y = -1;
villaFloor.receiveShadow = true;
scene.add(villaFloor);

// Villa muren met baksteen textuur
const brickTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/brick_diffuse.jpg');
const brickMaterial = new THREE.MeshStandardMaterial({ map: brickTexture, roughness: 0.5, metalness: 0.1 });

const villaWallGeometry = new THREE.BoxGeometry(8, 3, 0.1);
const villaWall1 = new THREE.Mesh(villaWallGeometry, brickMaterial);
villaWall1.position.set(0, 0.5, -3.9);
scene.add(villaWall1);

const villaWall2 = new THREE.Mesh(villaWallGeometry, brickMaterial);
villaWall2.position.set(0, 0.5, 3.9);
scene.add(villaWall2);

const villaWallSideGeometry = new THREE.BoxGeometry(0.1, 3, 8);
const villaWall3 = new THREE.Mesh(villaWallSideGeometry, brickMaterial);
villaWall3.position.set(-3.9, 0.5, 0);
scene.add(villaWall3);

const villaWall4 = new THREE.Mesh(villaWallSideGeometry, brickMaterial);
villaWall4.position.set(3.9, 0.5, 0);
scene.add(villaWall4);

// Dak van de villa
const roofGeometry = new THREE.ConeGeometry(6, 2, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 3;
roof.rotation.y = Math.PI / 4;
roof.castShadow = true;
scene.add(roof);

// Deur met textuur
const doorTexture = new THREE.TextureLoader().load('public/fit.jpg');
const doorMaterialWithTexture = new THREE.MeshStandardMaterial({
    map: doorTexture,
    roughness: 0.8,
    metalness: 0.1
});
const doorGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.05);
const door = new THREE.Mesh(doorGeometry, doorMaterialWithTexture);
door.position.set(0, -0.25, -3.9);
door.castShadow = true;
scene.add(door);

// Zwembad
const poolGeometry = new THREE.BoxGeometry(6, 0.5, 6);
const poolMaterial = new THREE.MeshStandardMaterial({ color: 0x1e90ff, opacity: 0.8, transparent: true });
const pool = new THREE.Mesh(poolGeometry, poolMaterial);
pool.position.set(8, -1.20, 0);
pool.receiveShadow = true;
scene.add(pool);

// Boom functie
function createTree(x, z) {
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

    const foliageGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);

    trunk.position.set(x, 0, z);
    foliage.position.set(x, 1.2, z);

    scene.add(trunk, foliage);
}

// Plaats bomen rondom villa
for (let i = -15; i <= 15; i += 10) {
    for (let j = -15; j <= 15; j += 10) {
        if (Math.random() > 0.5) createTree(i, j);
    }
}

// Huizen maken functie
function createHouse(x, z) {
    const houseBaseGeometry = new THREE.BoxGeometry(3, 2, 3);
    const houseBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const houseBase = new THREE.Mesh(houseBaseGeometry, houseBaseMaterial);
    houseBase.position.set(x, 0, z);
    houseBase.castShadow = true;

    const houseRoofGeometry = new THREE.ConeGeometry(3, 1.5, 4);
    const houseRoofMaterial = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
    const houseRoof = new THREE.Mesh(houseRoofGeometry, houseRoofMaterial);
    houseRoof.position.set(x, 1.5, z);
    houseRoof.rotation.y = Math.PI / 4;

    scene.add(houseBase, houseRoof);
}

// Plaats huizen rondom de villa
for (let i = -15; i <= 15; i += 30) {
    for (let j = -15; j <= 15; j += 20) {
        if (i !== 0 || j !== 0) createHouse(i, j);
    }
}

// Wolken
const cloudTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/cloud.png');
cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
cloudTexture.repeat.set(5, 5);

const cloudGeometry = new THREE.PlaneGeometry(50, 50);
const cloudMaterial = new THREE.MeshStandardMaterial({
    map: cloudTexture,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
clouds.rotation.x = -Math.PI / 2;
clouds.position.y = 15;
scene.add(clouds);

// Animatiefuncties en loop
function animate() {
    controls.update();
    renderer.render(scene, camera);
}

function updateSunPosition(hour) {
    const angle = (hour / 24) * Math.PI * 2;
    sun.position.set(15 * Math.cos(angle), 15 * Math.sin(angle), 5);
    sunLight.position.copy(sun.position);
    sunLight.intensity = Math.max(0.1, Math.sin(angle) * 0.5 + 0.5);
}

camera.position.set(0, 5, 20);
updateSunPosition(clockControl.hour);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
