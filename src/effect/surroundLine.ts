import * as THREE from "three";
import { color } from '../config'

export class SurroundLine {
    height: any;
    scene: any;
    child: any;
    time: any;
    constructor(scene: any, child: any, height: { value: number; }) {
        this.height = height;
        this.scene = scene;
        this.child = child;
        // this.time = time;

        this.createMesh();

        // 创建外围线条
        this.createLine();
    }

    computedMesh() {
        // 几何体Geometry调用Box3的方法.setFromPoints()封装了一个方法.computeBoundingBox()，用来计算几何体的包围盒属性.boundingBox。

        // 几何体包围盒属性.boundingBox默认值为空null，执行.computeBoundingBox()方法才会计算该几何体的包围盒Box3，然后赋值给.boundingBox属性。
        this.child.geometry.computeBoundingBox();
        // this.child.geometry.computeBoundingSphere();
    }

    createMesh() {
        this.computedMesh();
        const { max, min } = this.child.geometry.boundingBox

        // 高度差
        const size = max.z - min.z

        const material = new THREE.ShaderMaterial({
            uniforms: {
                // 当前扫描的高度
                u_height: this.height,
                // 扫描线条的颜色是什么
                u_up_color: {
                    value: new THREE.Color(color.risingColor),
                },
                u_city_color: {
                    // 得需要一个模型颜色 最底部显示的颜色
                    value: new THREE.Color(color.mesh)
                },
                u_head_color: {
                    // 要有一个头部颜色 最顶部显示的颜色
                    value: new THREE.Color(color.head)
                },
                u_size: {
                    value: size,
                },
            },
            vertexShader: `
              varying vec3 v_position;
              
              void main() {
              
                v_position = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              varying vec3 v_position;
              
              uniform vec3 u_city_color;
              uniform vec3 u_head_color;
              uniform float u_size;

              uniform vec3 u_up_color;
              uniform float u_height;

              void main() {
                vec3 base_color = u_city_color;
                base_color = mix(base_color, u_head_color, v_position.z / u_size);

                // 上升线条的高度是多少
                if (u_height > v_position.z && u_height < v_position.z + 3.0) {
                    float f_index = (u_height - v_position.z) / 3.0;
                    // 让线产生模糊的效果(就像建筑物从下到上变化颜色一样)
                    base_color = mix(u_up_color, base_color, abs(f_index - 1.0));
                }

                gl_FragColor = vec4(base_color, 1.0);
              }
            `,
        })
        const mesh = new THREE.Mesh(this.child.geometry, material);

        // 让mesh 继承 child 的旋转、缩放、平移
        mesh.position.copy(this.child.position)
        mesh.rotation.copy(this.child.rotation)
        mesh.scale.copy(this.child.scale)

        this.scene.add(mesh);
    }

    createLine() {
        const geometry = new THREE.EdgesGeometry(this.child.geometry)

        const material = new THREE.ShaderMaterial({
            uniforms: {
                line_color: {
                    value: new THREE.Color(color.soundLine)
                },
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 line_color;

                void main() {
                    gl_FragColor = vec4(line_color, 1.0);
                 }
            `
        })

        // 创建线条
        const line = new THREE.LineSegments(geometry, material)

        // 继承建筑物的偏移量和旋转
        line.scale.copy(this.child.scale)
        line.rotation.copy(this.child.rotation)
        line.position.copy(this.child.position)

        this.scene.add(line)
    }
}