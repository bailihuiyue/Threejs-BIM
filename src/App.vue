<template>
  <canvas id="bim">浏览器不支持canvas,请切换浏览器重试</canvas>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { onMounted } from 'vue'
import { City } from './enter/city'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

onMounted(() => {
  const canvas = document.getElementById('bim') as HTMLCanvasElement;
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000)
  camera.position.set(1500, 500, 100)
  scene.add(camera)

  // 添加相机控件
  const controls = new OrbitControls(camera, canvas);
  // 是否有惯性
  controls.enableDamping = true;
  // 是否可以缩放
  controls.enableZoom = false;
  // 最近和最远距离
  controls.minDistance = 100;
  controls.maxDistance = 2000;
  // 开启右键拖动
  controls.enablePan = true;
  controls.enableZoom = true

  // 添加灯光
  // 环境光
  scene.add(new THREE.AmbientLight(0xadadad))
  // 平行光
  const directionLight = new THREE.DirectionalLight(0xffffff)
  directionLight.position.set(0, 0, 0)
  scene.add(directionLight)

  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.setSize(window.innerWidth, window.innerHeight)

  const city = new City(scene, camera, undefined);

  const clock = new THREE.Clock();
  const start = () => {

    city.start(clock.getDelta());

    controls.update();

    // 渲染场景
    renderer.render(scene, camera)

    requestAnimationFrame(start)
  }

  start();



  window.onresize = () => {
    // 更新宽高比
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新相机的投影矩阵
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置像素比
    renderer.setPixelRatio(window.devicePixelRatio)
  }
})
</script>
<style scoped></style>
