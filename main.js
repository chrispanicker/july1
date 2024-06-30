import * as THREE from 'three';
import selects from './src/Selects.png'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, clock, controls, material, texture
let sceneObjects = []

console.log(selects)


window.addEventListener('load', init)


function init() {
    scene = new THREE.Scene()
    let color1 = new THREE.Color(0xb7b4ff)
    scene.background =color1
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    clock = new THREE.Clock();

    texture = new THREE.TextureLoader().load(selects, (texture)=>{
        texture.minFilter = THREE.NearestFilter;
    })
  
    // loadTexture()
    document.body.appendChild(renderer.domElement)
    adjustLighting()
    // addBasicCube()
    // addExperimentalCube()
    addTorus()
    for(let i=0; i<3; i++){

    }
    animationLoop()
    onWindowResize();
    window.addEventListener('resize', (camera)=>{onWindowResize(camera)}, false);
}



function onWindowResize(){
    let width = window.innerWidth;
    let height = window.innerHeight;
    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function adjustLighting() {
    let pointLight = new THREE.PointLight(0xdddddd)
    pointLight.position.set(-5, -3, 3)
    scene.add(pointLight)

    let ambientLight = new THREE.AmbientLight(0xb7b4ff)
    scene.add(ambientLight)
}

function addBasicCube() {
  let geometry = new THREE.BoxGeometry(1, 1, 1)
  let material = new THREE.MeshLambertMaterial()  

  let mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = -2
  scene.add(mesh)
  sceneObjects.push(mesh)
}

function addTorus(){
    let geometry = new THREE.SphereGeometry( 15, 32, 16 );
    material =  new THREE.ShaderMaterial({
      fragmentShader: fragmentShader(),
      vertexShader: vertexShader(),
      uniforms:{
        uTime:{value:0},
        uTexture:{value:texture}
      },
      transparent: true,
      side: THREE.DoubleSide
    }); 
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh)
    sceneObjects.push(mesh)
}

function vertexShader() {
    return `
      varying vec2 vUv; 
      uniform float uTime;
  
      void main() {
        vUv = uv;   
        vec3 transformed = position;
        transformed.z += cos(position.x+uTime);
        transformed.x += sin(position.z+uTime);
        gl_Position = projectionMatrix * modelViewMatrix*vec4(transformed, 1.0); 
      }
    `
  }

function fragmentShader(){
    return `
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTexture;

    void main() {
      float time = uTime;
      vec2 uv = vUv;
      uv.x += tan(uv.y+time)*.01;
      uv.y += sin(uv.x-time)*.001;
      vec2 repeat = vec2(6.0, 3.0);
      uv = fract(time/10.0+uv*repeat);

      vec4 color = texture2D(uTexture, uv);
      gl_FragColor = color;
    }`
}
  
function animationLoop() {
    controls.update();
  // for(let object of sceneObjects) {
  //   object.rotation.x += 0.01
  //   object.rotation.y += 0.03
  // }
    material.uniforms.uTime.value = clock.getElapsedTime();

  requestAnimationFrame(animationLoop)
  renderer.render(scene, camera)
}

function render(){



}

