import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = () => {

  window.addEventListener('resize', () =>{
    const width = window.innerWidth;
    const height = window.innerHeight;

    // レンダラーのサイズを調整する
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // カメラのアスペクト比を正す
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  const VIEWPORT_W = window.innerWidth;
  const VIEWPORT_H = window.innerHeight;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer();
  // レンダラーのサイズを設定
  renderer.setSize(VIEWPORT_W, VIEWPORT_H);
  renderer.setPixelRatio(window.devicePixelRatio);
  // canvasをbodyに追加
  document.body.appendChild(renderer.domElement);
  //RGBの設定
  renderer.outputEncoding = THREE.sRGBEncoding
  // 背景色の設定
  const BACKGROUND_COLOR = 0xf1f1f1;

  // シーンを作成
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);


  // カメラを作成
  const camera = new THREE.PerspectiveCamera(
      50,
      VIEWPORT_W / VIEWPORT_H,
      0.1,
      1000
  );
  camera.position.set(0,10,5);

  //OrbitControlsを作成
  const controls = new OrbitControls(camera, renderer.domElement);

  // ローダーの読み込み
  const gltfLoader = new GLTFLoader();

  // 椅子の3Dモデルの読み込み
  gltfLoader.load('/assets/models/chair.glb', (gltf) => {
      const modelGroup = gltf.scene;
      modelGroup.scale.set(2,2,2);
      modelGroup.position.y = -1 ;
      // なんでMath.PIを入れると回転するの？？わけわかめ
      modelGroup.rotation.y = Math.PI;
    // modelGroup.traverse((child) => {
      //    if (child instanceof THREE.Mesh) {
      //    }
      // });
      console.log(gltf.scene);
      scene.add(gltf.scene);
  }, undefined, (error) => {
    console.error(error)
  });

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1,1);
  const floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 0
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = -1;
  scene.add(floor);

  // HemisphereLightを生成
  const hemisphere = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
  hemisphere.position.set(0,50,0);
  scene.add(hemisphere);

  // DirectionalLightを追加
  const dirLight = new THREE.DirectionalLight(0xffff, 0.54);
  dirLight.position.set(-8, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  scene.add(dirLight);

  //グリッドヘルパーを追加
  const size = 10;
  const step = 1;
  const gridHelper = new THREE.GridHelper(size, step);
  scene.add(gridHelper);

  const tick = () => {
    requestAnimationFrame(tick);

    // 描画
    renderer.render(scene, camera);
  };
  tick();
};
