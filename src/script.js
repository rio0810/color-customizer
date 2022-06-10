import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// KHR_draco_mesh_compressionで圧縮された3Dモデルを読み込む
import khrDraco from "../static/assets/models/khr_draco.glb";
// 点群の3Dモデルを使用する際に使用
// import {PointGroupDraco} from "./pointGroup";
// import PointCloud from "../static/assets/models/pathToPointCloud.drc";

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
  
    // シーンを作成
    const scene = new THREE.Scene();

    // 点群の3Dモデルを読み込む
    // new PointGroupDraco(
    //     PointCloud,
    //     scene
    // );
  
    // カメラを作成
    const camera = new THREE.PerspectiveCamera(
      45,
      VIEWPORT_W / VIEWPORT_H,
      1,
      5000
    );
    camera.position.set(10,10,10);

    //OrbitControlsを作成
    const controls = new OrbitControls(camera, renderer.domElement);   

    // ローダーの読み込み
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    // KHR_draco_mesh_compressionで圧縮されたglbファイルを読みこむ
    dracoLoader.setDecoderPath( "https://www.gstatic.com/draco/v1/decoders/" );
    gltfLoader.setDRACOLoader( dracoLoader );
    gltfLoader.load(khrDraco, (gltf) =>{
      scene.add(gltf.scene);
    })

    // glbファイルを読み込む
    // gltfLoader.load('/assets/models/cube.glb', (gltf) => {
    //     const modelGroup = gltf.scene;
    //     modelGroup.traverse((child) => {
    //        if (child instanceof THREE.Mesh) {
    //        }
    //     });
    //     scene.add(gltf.scene);
    // });
  
    // 平行光源を生成
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

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
