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
  // 影がでるようにする
  renderer.shadowMap.enabled = true;
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
  camera.position.set(0,0,5);

  //OrbitControlsを作成
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 3;
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.1;
  controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
  controls.autoRotateSpeed = 0.2;

  // Initial material
  const INITIAL_MTL = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 10 } );
  const INITIAL_MAP = [
    {childID: "back", mtl: INITIAL_MTL},
    {childID: "base", mtl: INITIAL_MTL},
    {childID: "cushions", mtl: INITIAL_MTL},
    {childID: "legs", mtl: INITIAL_MTL},
    {childID: "supports", mtl: INITIAL_MTL},
  ];
  // ローダーの読み込み
  const gltfLoader = new GLTFLoader();

  let modelGroup;

  // 椅子の3Dモデルの読み込み
  gltfLoader.load('/assets/models/chair.glb', (gltf) => {
      modelGroup = gltf.scene;
      modelGroup.scale.set(2,2,2);
      modelGroup.position.y = -1 ;
      // なんでMath.PIを入れると回転するの？？わけわかめ
      modelGroup.rotation.y = Math.PI;
      modelGroup.traverse((child) => {
         if (child.isMesh) {
           child.castShadow = true;
           child.receiveShadow = true;
         }
      });
      // console.log(gltf.scene);
    // マテリアルを設定
    for(let object of INITIAL_MAP){
      initColor(modelGroup, object.childID, object.mtl);
    };
    scene.add(modelGroup);
  }, undefined, (error) => {
    console.error(error)
  });

  const initColor = (parent, type, mtl) => {
    parent.traverse((o) =>{
      if(o.isMesh){
        if (o.name.includes(type)){
          o.material = mtl;
          o.nameID = type;
        }
      }
    });
  }

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1,1);
  const floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xeeeeee,
    shininess: 0
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = -1;
  scene.add(floor);

  // HemisphereLightを生成
  const hemisphere = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );
  hemisphere.position.set(0,50,0);
  scene.add(hemisphere);

  // DirectionalLightを追加
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
  dirLight.position.set(-8, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  scene.add(dirLight);

  const tick = () => {
    requestAnimationFrame(tick);

    controls.update();

    // 描画
    renderer.render(scene, camera);
  };
  tick();
};
