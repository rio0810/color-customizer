import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";

const valueAcquisition = new RegExp(
    /[+-]?[0-9]+(\.[0-9]+)?(e-[0-9]+)?,[+-]?[0-9]+(\.[0-9]+)?(e-[0-9]+)?,[+-]?[0-9]+(\.[0-9]+)?(e-[0-9]+)?/,
    "g"
);
const getNumber = new RegExp(/[+-]?[0-9]+(\.[0-9]+)?(e-[0-9]+)?/, "g");

export class PointGroupDraco {
    constructor(URL, scene) {
        // Configure and create Draco decoder.
        const dracoLoader = new DRACOLoader();
        // エンコードもデコードもHttpからじゃないと動かない
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
        // dracoLoader.setDecoderConfig({ type: 'wasm' });


        dracoLoader.preload();
        dracoLoader.load(URL, (Geometry) => {
            Geometry.computeVertexNormals();

            Geometry.setAttribute(
                "color",
                new THREE.BufferAttribute(
                    new Uint8Array(Geometry.attributes.color.array),
                    3,
                    true
                )
            );
            const PointMaterial = new THREE.PointsMaterial({
                vertexColors: THREE.VertexColors,
                // size: 2,
                // baseColor
                color: 0xffffff,
            });

            this.mesh = new THREE.Points(Geometry, PointMaterial);

            this.mesh.rotation.x = -Math.PI / 2;
            scene.add(this.mesh);

            // Release decoder resources.本来はdispose();した方がいい
            // dracoLoader.dispose();
        });
    }
}
