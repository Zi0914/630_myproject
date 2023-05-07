import './style.css';
import * as THREE from 'three';

// Camera settings
const camera_ratio = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(75, camera_ratio, 0.1, 1000);
camera.position.setZ(30);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Asset configs
const background_img_path = 'assets/space.jpg'
const donut_img_path = 'assets/donut.jpg';
const first_moon_img_path = 'assets/moon.jpg'
const second_moon_img_path = 'assets/texture.jpg'
const stream = "assets/sound.mp3"

// Scene initializtation
const scene = new THREE.Scene();
renderer.render(scene, camera);

// Background
scene.background = new THREE.TextureLoader().load(background_img_path);;

// Lighting
const pointLight = new THREE.PointLight(0x000000);
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);

// Donut
const donut = new THREE.Mesh(
  new THREE.TorusGeometry(2, 0.8), 
  new THREE.MeshBasicMaterial({ 
    map: new THREE.TextureLoader().load(donut_img_path) })
);
scene.add(donut);
donut.position.z = -5;
donut.position.x = 2;

// Speckles
function addSpeckles() {
  const speckle = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0xf3f4f6 }));

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  speckle.position.set(x, y, z);
  scene.add(speckle);
}
const speckle_count = 200;
Array(speckle_count).fill().forEach(addSpeckles);

// First moon
const first_moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.5), 
  new THREE.MeshBasicMaterial({
     map: new THREE.TextureLoader().load(first_moon_img_path)
  })
);
scene.add(first_moon);
first_moon.position.z = -5;
first_moon.position.x = 2;

// Second moon
const second_moon = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 1),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(second_moon_img_path), 
    normalMap: new THREE.TextureLoader().load(second_moon_img_path),
  })
  );
scene.add(second_moon);
second_moon.position.z = 5;
second_moon.position.setX(-3);

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  second_moon.rotation.x += 0.05;
  second_moon.rotation.y += 0.075;
  second_moon.rotation.z += 0.05;

  first_moon.rotation.y += 0.01;
  first_moon.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  donut.rotation.x += 0.0075;
  donut.rotation.y += 0.001;
  donut.rotation.z += 0.01;

  second_moon.rotation.x += 0.005;
  renderer.render(scene, camera);
}
animate();

// Audio
const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const backgroundSound = new THREE.Audio(listener);
const music_playing = false;

// Sound toggle
function play_music() {
  if (!backgroundSound.isPlaying) {
    audioLoader.load(stream, function(buffer) {
      backgroundSound.setBuffer(buffer);
      backgroundSound.setLoop(true);
      backgroundSound.setVolume(0.1);
      backgroundSound.play();
    })
  }
  else {
    backgroundSound.pause();
  }
};
document.addEventListener("click", play_music);