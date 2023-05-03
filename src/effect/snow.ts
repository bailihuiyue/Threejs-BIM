import * as THREE from 'three'

// 范围
let range = 1000;
// 雪花的个数
let count = 300;
let pointList: any[] = [];

let geometry: any = null
let hasInit = false

export const Snow = (scene: any) => {
    geometry = new THREE.BufferGeometry()

    for (let i = 0; i < count; i++) {
        const position: any = new THREE.Vector3(
            //Math.random() * range的值在[0,range]之间,再减去range的一半,这样就使得值有正有负
            Math.random() * range - range / 2,
            // 雪从天上下,只会向下,所以不用再计算了
            Math.random() * range,
            Math.random() * range - range / 2,
        )

        // 给每个雪花一个单独的变化速度
        position.speedX = Math.random() - 0.5;
        position.speedY = Math.random() + 0.5;
        position.speedZ = Math.random() - 0.5;

        pointList.push(position)
    }

    geometry.setFromPoints(pointList)

    const material = new THREE.PointsMaterial({
        size: 30,
        map: new THREE.TextureLoader().load('../../src/assets/snow.png'),
        transparent: true,
        opacity: 0.8,
        depthTest: false,
    })

    const point = new THREE.Points(geometry, material)
    scene.add(point)
}

const animate = (scene: any) => {
    if (!hasInit) {
        Snow(scene)
        hasInit = true
    }
    pointList.forEach(position => {
        position.x -= position.speedX;
        position.y -= position.speedY;
        position.z -= position.speedZ;

        // 雪花到地面之后再归位,重头来
        if (position.y <= 0) {
            position.y = range / 2;
        }
    })

    geometry.setFromPoints(pointList)

    requestAnimationFrame(animate)
}

export default animate