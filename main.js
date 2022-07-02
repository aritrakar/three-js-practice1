import "./style.css";

import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { randFloatSpread } from "three/src/math/MathUtils";
import gsap from "gsap";

function jaggedPlane(planeMesh) {
  let planeVertices = planeMesh.geometry.attributes.position.array;
  const randomValues = [];
  for (let i = 0; i < planeVertices.length; ++i) {
    if (i % 3 == 0) {
      const x = planeVertices[i];
      const y = planeVertices[i + 1];
      const z = planeVertices[i + 2];

      // planeVertices[i] = x + randFloatSpread(1);
      // planeVertices[i + 1] = y + randFloatSpread(0.5);
      // planeVertices[i + 2] = z + randFloatSpread(0.25);

      planeVertices[i] = x + (Math.random() - 0.5) * 0.25;
      planeVertices[i + 1] = y + (Math.random() - 0.5) * 0.25;
      planeVertices[i + 2] = z + (Math.random() - 0.5) * 0.5;
    }

    randomValues.push(Math.random() * Math.PI * 2);
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues;
  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array;

  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }

  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
}

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    // world.planeMesh.width,
    // world.planeMesh.height,
    // world.planeMesh.widthSegments,
    // world.planeMesh.heightSegments
    22,
    12,
    20,
    15
  );

  jaggedPlane(planeMesh);
}

/*
// Create a gui object
const gui = new dat.GUI();
const world = {
  planeMesh: {
    width: 22,
    height: 12,
    widthSegments: 20,
    heightSegments: 15,
  },
};

// Width slider
gui.add(world.planeMesh, "width", 1, 20).onChange(generatePlane);

// Height slider
gui.add(world.planeMesh, "height", 1, 20).onChange(generatePlane);

// Width segments slider
gui.add(world.planeMesh, "widthSegments", 1, 20).onChange(generatePlane);

// Height segments slider
gui.add(world.planeMesh, "heightSegments", 1, 20).onChange(generatePlane);

*/
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// const renderer = new THREE.WebGLRenderer({
//   canvas: document.querySelector("#bg"),
// });

const renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(7);
document.body.appendChild(renderer.domElement);

// Box
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, -1, 1);
scene.add(light);

// Back light
const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

// Plane
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
generatePlane();

// Controls
// const controls = new OrbitControls(camera, renderer.domElement);

const mouse = { x: undefined, y: undefined };

let frame = 0;

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.5,
  });
  const star = new THREE.Mesh(geometry, material);

  // To map the stars randomly
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(250));
  star.position.set(x, y + 75, z);
  scene.add(star);
}

// function addStar2() {
//   const starGeometry = new THREE.BufferGeometry();
//   for (let i = 0; i < 6000; i++) {
//     let star = new THREE.Vector3(
//       Math.random() * 600 - 300,
//       Math.random() * 600 - 300,
//       Math.random() * 600 - 300
//     );
//     starGeometry.vertices.push(star);
//   }
//   const starTexture = new THREE.TextureLoader().load("star.jpg");
//   let starMaterial = new THREE.PointsMaterial({
//     color: 0xaaaaaa,
//     size: 0.7,
//     map: starTexture,
//   });
//   return new THREE.Points(starGeometry, starMaterial);
// }

let starGeometry = undefined;

function addStar2() {
  starGeometry = new THREE.BufferGeometry();
  let vertices = [];
  for (let i = 0; i < 6000; i++) {
    vertices.push(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
  }
  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3)
  );
  const starTexture = new THREE.TextureLoader().load("./star.png");
  const starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.7,
    map: starTexture,
  });
  return new THREE.Points(starGeometry, starMaterial);
}

function getStars() {
  Array(200).fill().forEach(addStar);
}

document.getElementById("work").addEventListener("mousedown", () => {
  gsap.to(camera.position, { z: 2, y: -3, duration: 1.75 });
  gsap.to(camera.rotation, { x: 1.75, duration: 1.5 });
  gsap.to(document.getElementById("text"), {
    opacity: 0,
    display: "none",
    duration: 1.75,
  });
  // getStars();
  scene.add(addStar2());
});

function animate() {
  requestAnimationFrame(animate);

  frame += 0.01;

  // controls.update();

  // if(starGeometry){
  //   starGeometry.vertices.forEach(p => {
  //     p.velocity += 0.02;
  //     p.y -= p.velocity
  //   })
  // }

  renderer.render(scene, camera);

  const { array, originalPosition, randomValues } =
    planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.001;
    array[i + 1] =
      originalPosition[i + 1] + Math.cos(frame + randomValues[i]) * 0.0001;
    array[i + 2] =
      originalPosition[i + 2] + Math.cos(frame + randomValues[i]) * 0.0005;
  }

  planeMesh.geometry.attributes.position.needsUpdate = true;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;

    color.needsUpdate = true;

    const initialColor = { r: 0, g: 0.19, b: 0.4 };
    const hoverColor = { r: 0.1, g: 0.5, b: 1 };
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        // vertex 1
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        // vertex 2
        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        // vertex 3
        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
      },
    });
  }
}

animate();

addEventListener("mousemove", (event) => {
  // Normalize mouse coordinates
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
