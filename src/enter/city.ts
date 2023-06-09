import { loadFBX } from '../utils/index'
import { Background } from '../effect/background'
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { SurroundLine } from '../effect/surroundLine'
import { Wall } from '../effect/wall'
import { Radar } from '../effect/radar'
import Circle from '../effect/circle'
import { Ball } from '../effect/ball'
import { Cone } from '../effect/cone'
import { Fly } from '../effect/fly'
import { Road } from '../effect/road'
import { Font } from '../effect/font'
import Snow from '../effect/snow'
import Rain from '../effect/rain'
import { Smoke } from '../effect/smoke'

export class City {
  scene: any;
  camera: any;
  tweenPosition: TWEEN.Tween<any> | null;
  tweenRotation: TWEEN.Tween<any> | null;
  height: { value: number; };
  time: { value: number; };
  controls: any;
  effect: {};
  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: any) {
    this.scene = scene
    this.camera = camera;
    this.controls = controls;
    this.tweenPosition = null;
    this.tweenRotation = null;

    this.height = {
      value: 5,
    }

    this.time = {
      value: 0,
    }

    this.effect = {}

    this.loadCity();
  }

  addClick() {
    let flag = false;
    document.onmousedown = () => {
      flag = true;

      document.onmousemove = () => {
        flag = false;
      }
    }

    document.onmouseup = (event) => {
      if (flag) {
        this.clickEvent(event)
      }
      document.onmousemove = null;
    }
  }

  addWheel() {
    const body = document.body;
    body.onmousewheel = (event: any) => {
      const value = 30;
      // 鼠标当前的坐标信息
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      const vector = new THREE.Vector3(x, y, 0.5);

      // 转换到世界坐标
      vector.unproject(this.camera)
      vector.sub(this.camera.position).normalize()

      if (event.wheelDelta > 0) {

        // 注意,相机和轨道控件位置必须一起旋转,否则不生效(原理未知)
        this.camera.position.x += vector.x * value;
        this.camera.position.y += vector.y * value;
        this.camera.position.z += vector.z * value;

        this.controls.target.x += vector.x * value;
        this.controls.target.y += vector.y * value;
        this.controls.target.z += vector.z * value;
      } else {
        this.camera.position.x -= vector.x * value;
        this.camera.position.y -= vector.y * value;
        this.camera.position.z -= vector.z * value;

        this.controls.target.x -= vector.x * value;
        this.controls.target.y -= vector.y * value;
        this.controls.target.z -= vector.z * value;
      }
    }
  }

  clickEvent(event: any) {
    // 获取到浏览器坐标
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 创建设备坐标（三维）z=0.5表示坐标中心
    const standardVector = new THREE.Vector3(x, y, 0.5);
    // 转化为世界坐标
    const worldVector = standardVector.unproject(this.camera);
    // 做序列化
    const ray = worldVector.sub(this.camera.position).normalize();

    const raycaster = new THREE.Raycaster(this.camera.position, ray);
    const intersects: any = raycaster.intersectObjects(this.scene.children, true);

    let point3d = null
    if (intersects.length) {
      point3d = intersects[0]
    }
    if (point3d) {
      // 观察距离否则观察点就是鼠标点击的点，视线会被挡住
      const proportion = 1.5;
      // 开始动画来修改观察点
      const time = 1000;
      // 将相机移动到哪个位置
      this.tweenPosition = new TWEEN.Tween(this.camera.position).to({
        x: point3d.point.x * proportion,
        y: point3d.point.y * proportion,
        z: point3d.point.z * proportion,
      }, time).start();
      // 相机看向哪个位置
      this.tweenRotation = new TWEEN.Tween(this.camera.rotation).to({
        x: this.camera.rotation.x,
        y: this.camera.rotation.y,
        z: this.camera.rotation.z,
      }, time).start();
    }
  }

  loadCity() {
    // 加载模型，并且渲染到画布上
    loadFBX('/src/model/beijing.fbx').then((object: any) => {
      // 循环加载到的模型元素
      object.traverse((child: any) => {
        if (child.isMesh) {
          new SurroundLine(this.scene, child, this.height, this.time);
        }
      })

      // new Background(this.scene);
      // new Radar(this.scene, this.time);
      // new Wall(this.scene, this.time);
      // Circle(this.scene, this.time);
      // new Ball(this.scene, this.time);
      // new Cone(this.scene)
      // new Fly(this.scene, this.time)
      // new Road(this.scene, this.time)
      // new Font(this.scene)
      // Snow(this.scene)
      // Rain(this.scene)

      this.effect.smoke = new Smoke(this.scene)

      // 添加点击选择
      this.addClick();

      // 跟随鼠标位置进行缩放
      this.addWheel();
    })
  }

  start(delta: any) {
    for (const key in this.effect) {
      this.effect[key] && this.effect[key].animation();
    }

    if (this.tweenPosition && this.tweenRotation) {
      this.tweenPosition.update()
      this.tweenRotation.update()
    }

    this.time.value += delta;

    this.height.value += 0.4;
    if (this.height.value > 160) {
      this.height.value = 5;
    }
  }
}