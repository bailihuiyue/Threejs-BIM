import * as THREE from 'three'

export class Background {
  scene: any
  constructor(scene: any) {
    this.scene = scene

    this.init();
  }

  init() {
    const loader = new THREE.TextureLoader()
    const geometry = new THREE.SphereGeometry(5000, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: loader.load('../../src/assets/black-bg.png')
    })
    const sphere = new THREE.Mesh(geometry, material)

    this.scene.add(sphere)
  }
}