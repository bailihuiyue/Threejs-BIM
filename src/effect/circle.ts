import { color } from '../config'

import * as THREE from 'three';

export default function Circle(scene: any, time: any) {

  const geometry = new THREE.CylinderGeometry(80, 80, 1, 32, 1, false)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_color: {
        value: new THREE.Color(color.circle)
      },
      u_width: {
        value: 10
      },
      u_opacity: {
        value: 0.8
      },
      u_time: time
    },
    vertexShader: `
      uniform float u_time;
      uniform float u_speed;

      void main() {
        vec3 v_position = position * mod(u_time/1.8, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
      }
    `,
    fragmentShader: `
        uniform vec3 u_color;
        
        void main() {
          gl_FragColor = vec4(u_color, 0.6);
        }
    `,
    transparent: true,
    depthTest: false, // 被建筑物遮挡的问题
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.copy(new THREE.Vector3(300, 0, 250));

  scene.add(mesh);
}