import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// --- CONFIGURATION DE BASE ---
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#080808');
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Caméra
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0.5, 7);
scene.add(camera);

// Rendu
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Contrôles
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minAzimuthAngle = -Math.PI / 4;
controls.maxAzimuthAngle = Math.PI / 4;

controls.maxPolarAngle = Math.PI / 2.1; 

controls.minPolarAngle = Math.PI / 4; 

controls.maxDistance = 10;
controls.minDistance = 3;
controls.enableDamping = true;

// Variables globales
let computer = null;
let isAnimating = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// --- CHARGEMENT DE L'ORDINATEUR ---
const loader = new GLTFLoader();
loader.load('/Portfolio/public/models/computer.glb', (gltf) => {
    console.log("Modèle chargé !"); 
    computer = gltf.scene;
    computer.scale.set(1, 1, 1);
    computer.rotation.y = Math.PI;
    computer.position.set(5, -22.17, 0);
    
    computer.traverse((child) => {
        if(child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true; 
        }
    });

    scene.add(computer);
});

// --- GESTION DU CLIC ET REDIRECTION ---
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
});

window.addEventListener('click', () => {
    if (isAnimating || !computer) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(computer, true);

    if (intersects.length > 0) {
        isAnimating = true;
        controls.enabled = false;
        document.body.style.cursor = 'wait';
        
        // NOUVEAU : On cache l'indicateur visuel
        if(indicator) indicator.classList.add('hidden');

        gsap.to(camera.position, {
            x: 0,
            y: -0.5,
            z: 4.5, 
            duration: 1.5,
            ease: "power2.inOut",
            
            onComplete: () => {
                gsap.to(scene.background, { r: 0, g: 0, b: 0, duration: 0.1 });
                
                setTimeout(() => {
                    window.location.href = 'about.html'; 
                }, 50);
            }
        });

        gsap.to(controls.target, {
            x: 0, y: 0.2, z: 0,
            duration: 1.5, ease: "power2.inOut"
        });
    }
});
const menuToggle = document.querySelector('.menu-toggle');
            const menuText = document.querySelector('.menu-text');
            const menuOverlay = document.querySelector('.menu-overlay');
            
            const menuTl = gsap.timeline({ paused: true });

            menuTl
                .to(menuOverlay, { autoAlpha: 1, duration: 0.5 }) 
                .to(".menu-top", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
                .to(".menu-line", { scaleX: 1, duration: 0.8, ease: "power2.out", stagger: 0.1 }, "-=0.3")
                .to(".menu-link-item", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 }, "-=0.8")
                .to(".menu-bottom", { opacity: 1, y: 0, duration: 0.5 }, "-=0.6");

            let isMenuOpen = false;

            menuToggle.addEventListener('click', () => {
                if (!isMenuOpen) {
                    menuTl.play(); 
                    menuText.textContent = "CLOSE"; 
                    isMenuOpen = true;
                } else {
                    menuTl.reverse(); 
                    menuText.textContent = "MENU";
                    isMenuOpen = false;
                }
            });
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#080808', 
    metalness: 0.5,   
    roughness: 0.1,   
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; 
floor.position.y = 0; 
floor.receiveShadow = true;
scene.add(floor);

const screenLight = new THREE.SpotLight(0x909090, 10); 
screenLight.position.set(0, 3, 0); 
screenLight.angle = Math.PI / 6;
screenLight.penumbra = 1; 
screenLight.distance = 20; 
screenLight.castShadow = true; 
screenLight.target.position.set(0, 0, 0); 

scene.add(screenLight);
scene.add(screenLight.target);

const backLight = new THREE.PointLight(0xffffff, 2, 20);
backLight.position.set(0, 0, 0); 
scene.add(backLight);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 300;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 25; 
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.4,
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
particlesMesh.position.set(0, 0, 0);
scene.add(particlesMesh);
// --- BOUCLE ---
const indicator = document.querySelector('.click-indicator');

function tick() {
    controls.update();
    
    if(particlesMesh) {
        particlesMesh.rotation.y += 0.001;
        particlesMesh.position.y += Math.sin(Date.now() * 0.001) * 0.002;
    }

    // NOUVEAU : Détection du survol pour changer le curseur
    if (computer && !isAnimating) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(computer, true);

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer'; // Curseur "main"
        } else {
            document.body.style.cursor = 'default'; // Curseur normal
        }
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});
