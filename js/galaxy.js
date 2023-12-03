import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

//GALAXY
const parameters = {}
parameters.count = 100000;
parameters.size = 0.001;
parameters.radius = 2.15; 
parameters.branches = 5;
parameters.spin = 3;
parameters.randomness = 5;
parameters.randomnessPower = 6;
parameters.insideColor = '#8C52FF';
parameters.outsideColor = '#fd68f8';
parameters.backgroundColor = "#0F1010";

let material = null; 
let geometry = null; 
let points = null; 

const generateGalaxy = () => {
    
  if(points !== null){
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);

  const colors = new Float32Array(parameters.count * 3);
  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for(let i=0; i<parameters.count; i++){
    const i3 = i*3;
    const radius = Math.pow(Math.random()*parameters.randomness, Math.random()*parameters.radius);
    const spinAngle = radius*parameters.spin;
    const branchAngle = ((i%parameters.branches)/parameters.branches)*Math.PI*2;
    
    const negPos = [1,-1];
    const randomX = Math.pow(Math.random(), parameters.randomnessPower)*negPos[Math.floor(Math.random() * negPos.length)];
    const randomY = Math.pow(Math.random(), parameters.randomnessPower)*negPos[Math.floor(Math.random() * negPos.length)];
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower)*negPos[Math.floor(Math.random() * negPos.length)];

    positions[i3] = Math.cos(branchAngle + spinAngle)*(radius) + randomX;
    positions[i3+1] = randomY;
    positions[i3+2] = Math.sin(branchAngle + spinAngle)*(radius) + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, (Math.random()*radius/parameters.radius)* .3);

    colors[i3] = mixedColor.r;
    colors[i3+1] = mixedColor.g;
    colors[i3+2] = mixedColor.b;
  }

  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  
  points = new THREE.Points(geometry, material);
  scene.add(points);
  
}
generateGalaxy();


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () =>{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.5, 100)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//BACKGROUND
scene.background = new THREE.Color(parameters.backgroundColor);


//CLOCK
const clock = new THREE.Clock()

const tick = () =>{

  const elapsedTime = clock.getElapsedTime()

  camera.position.x = Math.cos(elapsedTime*0.05);
  camera.position.z = Math.sin(elapsedTime*0.05);
  camera.position.y = Math.tan(elapsedTime*0.005 + 10);
    camera.lookAt(0,0,0);
    
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()