import * as THREE from 'three'
import { color } from '../config'
import * as TWEEN from '@tweenjs/tween.js'

export class Cone {
  scene: any;
  camera: any;
  constructor(scene: any, camera: any) {
    this.scene = scene;
    this.camera = camera;

    this.createCone()
  }

  createCone() {
    const geometry = new THREE.ConeGeometry(
      15,
      30,
      4,
    )

    const material = new THREE.MeshBasicMaterial({ color: color.cone })

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(new THREE.Vector3(0, 50, 0));
    mesh.rotateZ(Math.PI);

    const coneTweenRotation = new TWEEN.Tween(mesh.rotation).to({
      y: Math.PI,
    }, 1000).yoyo(false).start().repeat(Infinity)

    const coneTweenPosition = new TWEEN.Tween(mesh.position).to({
      y: 10,
    }, 1000).yoyo(true).start().repeat(Infinity)

    this.scene.add(mesh);


    const start = () => {
      coneTweenPosition.update()
      coneTweenRotation.update()
      
      requestAnimationFrame(start)
    }

    start()

  }
}
