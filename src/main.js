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
    
    // --- AJOUT : Activer les ombres sur l'objet ---
    computer.traverse((child) => {
        if(child.isMesh) {
            child.castShadow = true; // L'objet projette une ombre
            child.receiveShadow = true; // L'objet reçoit des ombres (ex: clavier)
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
    // Si on anime déjà ou si l'ordi n'est pas chargé, on arrête
    if (isAnimating || !computer) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(computer, true);

    if (intersects.length > 0) {
        isAnimating = true;
        controls.enabled = false; // On bloque la souris
        document.body.style.cursor = 'wait'; // Petit curseur de chargement

        // 1. ZOOM DANS L'ÉCRAN
        gsap.to(camera.position, {
            x: 0,
            y: -0.5,
            z: 4.5, // Très proche de l'écran
            duration: 1.5,
            ease: "power2.inOut",
            
            // --- C'EST ICI QUE LA MAGIE OPÈRE ---
            onComplete: () => {
                // Écran noir pour la transition
                gsap.to(scene.background, { r: 0, g: 0, b: 0, duration: 0.1 });
                
                // On attend une demi-seconde et on change de page !
                setTimeout(() => {
                    window.location.href = 'about.html'; 
                }, 50);
            }
        });

        // On centre la caméra
        gsap.to(controls.target, {
            x: 0, y: 0.2, z: 0,
            duration: 1.5, ease: "power2.inOut"
        });
    }
});
const menuToggle = document.querySelector('.menu-toggle');
            const menuText = document.querySelector('.menu-text');
            const menuOverlay = document.querySelector('.menu-overlay');
            
            // On crée une Timeline GSAP en pause
            const menuTl = gsap.timeline({ paused: true });

            menuTl
                // 1. Apparition du fond
                .to(menuOverlay, { autoAlpha: 1, duration: 0.5 }) // autoAlpha gère opacity + visibility
                
                // 2. Langues (Haut)
                .to(".menu-top", { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
                
                // 3. Les Lignes qui s'étirent
                .to(".menu-line", { scaleX: 1, duration: 0.8, ease: "power2.out", stagger: 0.1 }, "-=0.3")
                
                // 4. Les Liens qui montent
                .to(".menu-link-item", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 }, "-=0.8")
                
                // 5. Le Footer (Bas)
                .to(".menu-bottom", { opacity: 1, y: 0, duration: 0.5 }, "-=0.6");

            let isMenuOpen = false;

            menuToggle.addEventListener('click', () => {
                if (!isMenuOpen) {
                    menuTl.play(); // On joue l'animation
                    menuText.textContent = "CLOSE"; // Change le texte
                    isMenuOpen = true;
                } else {
                    menuTl.reverse(); // On rembobine l'animation
                    menuText.textContent = "MENU";
                    isMenuOpen = false;
                }
            });
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#080808', // Même noir que le fond
    metalness: 0.5,   // Un peu métallique
    roughness: 0.1,   // Très lisse pour bien refléter
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // À plat
floor.position.y = 0; // Au niveau des pieds de ton ordi
floor.receiveShadow = true; // Le sol reçoit les ombres
scene.add(floor);

// 2. LUMIÈRE D'ÉCRAN (Le "Glow" Cyan)
// On crée une lumière qui part de l'écran et éclaire le clavier/utilisateur
const screenLight = new THREE.SpotLight(0x909090, 10); // Couleur Cyan, Intensité 10
screenLight.position.set(0, 3, 0); // Position approximative de l'écran
screenLight.angle = Math.PI / 6; // Angle du faisceau
screenLight.penumbra = 1; // Bordures floues
screenLight.distance = 20; // Portée
screenLight.castShadow = true; // Cette lumière crée des ombres
screenLight.target.position.set(0, 0, 0); // Elle pointe vers l'avant (le clavier)

scene.add(screenLight);
scene.add(screenLight.target);

// 3. LUMIÈRE D'AMBIANCE DOUCE (Contre-jour)
// Pour détacher la silhouette de l'ordi du fond noir
const backLight = new THREE.PointLight(0xffffff, 2, 20);
backLight.position.set(0, 0, 0); // Derrière l'ordi
scene.add(backLight);

// 4. PARTICULES DE POUSSIÈRE (Atmosphère)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 300;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Particules aléatoires autour de l'ordi
    posArray[i] = (Math.random() - 0.5) * 25; 
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00eeff, // Cyan pour matcher l'écran
    transparent: true,
    opacity: 0.4,
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
particlesMesh.position.set(0, 0, 0); // Centré sur l'ordi
scene.add(particlesMesh);
// --- BOUCLE ---
function tick() {
    controls.update();
    
    // Animation douce des particules
    if(particlesMesh) {
        particlesMesh.rotation.y += 0.001; // Tourne lentement
        particlesMesh.position.y += Math.sin(Date.now() * 0.001) * 0.002; // Flotte haut/bas
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});
