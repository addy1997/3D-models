import Stats from 'three/addons/libs/stats.module.js';

  import {
  TWEEN
  } from 'three/addons/libs/tween.module.min.js';
  import {
  ColladaLoader
  } from 'three/addons/loaders/ColladaLoader.js';


  AFRAME.registerComponent('three-collada-loader', {
  schema: {},
  init() {
  let container;
  let
  stats;

  let camera;
  let scene;
  let
  renderer;
  let particleLight;
  let dae;

  let kinematics;
  let kinematicsTween;
  const tweenParameters = {};

  const loader = new ColladaLoader();
  loader.load('https://raw.githubusercontent.com/addy1997/3D-models/main/ur5/ur5.dae', (collada) => {
  dae = collada.scene;
  });
  dae.scale.x = dae.scale.y = dae.scale.z = 0.01;
  dae.rotation.x = -90 * Math.PI / 180;
  dae.updateMatrix();

  kinematics = collada.kinematics;

  update();
  animate();
  },

  update() {
  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(2, 2, 3);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  // Grid

  const grid = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
  scene.add(grid);

  // Add the COLLADA

  scene.add(dae);

  particleLight = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), new THREE.MeshBasicMaterial({
  color: 0xffffff,
  }));
  scene.add(particleLight);

  // Lights

  const light = new THREE.HemisphereLight(0xffeeee, 0x111122);
  scene.add(light);

  const pointLight = new THREE.PointLight(0xffffff, 0.3);
  particleLight.add(pointLight);

  renderer = new THREE.WebGLRenderer({
  antialias: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  stats = new Stats();
  container.appendChild(stats.dom);

  setupTween();

  //

  window.addEventListener('resize', onWindowResize);
  },

  setupTween() {
  const duration = THREE.MathUtils.randInt(1000, 5000);

  const target = {};

  for (const prop in kinematics.joints) {
  if (kinematics.joints.hasOwnProperty(prop)) {
  if (!kinematics.joints[prop].static) {
  const joint = kinematics.joints[prop];

  const old = tweenParameters[prop];

  const position = old || joint.zeroPosition;

  tweenParameters[prop] = position;

  target[prop] = THREE.MathUtils.randInt(joint.limits.min, joint.limits.max);
  }
  }
  }

  kinematicsTween = new TWEEN.Tween(tweenParameters).to(target, duration).easing(TWEEN.Easing.Quadratic.Out);

  kinematicsTween.onUpdate((object) => {
  for (const prop in kinematics.joints) {
  if (kinematics.joints.hasOwnProperty(prop)) {
  if (!kinematics.joints[prop].static) {
  kinematics.setJointValue(prop, object[prop]);
  }
  }
  }
  });

  kinematicsTween.start();

  setTimeout(setupTween, duration);
  },
  onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  },
  animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
  TWEEN.update();
  },
  render() {
  const timer = Date.now() * 0.0001;

  camera.position.x = Math.cos(timer) * 20;
  camera.position.y = 10;
  camera.position.z = Math.sin(timer) * 20;

  camera.lookAt(0, 5, 0);

  particleLight.position.x = Math.sin(timer * 4) * 3009;
  particleLight.position.y = Math.cos(timer * 5) * 4000;
  particleLight.position.z = Math.cos(timer * 4) * 3009;

  renderer.render(scene, camera);
  },
  });
