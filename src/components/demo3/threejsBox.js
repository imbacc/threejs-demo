import * as THREE from 'three'

export default class threejsMap {
    constructor(scene, camera, webGL, webGLDOM) {
        this.scene = scene
        this.camera = camera
        this.webGL = webGL
        this.webGLDOM = webGLDOM

        this.animation = null
        this.box = null
        this.material = null
        this.mesh = null
        this.projection = null
        this.group = null
        this.initBox()
        this.initMaterial()
        this.initMesh()
        this.initHelper()
    }

    // 初始化物体
    initBox() {
        this.box = new THREE.BoxGeometry(2.2, 2.2, 2.2)
    }

    // 初始化材料
    initMaterial() {
        this.material = new THREE.MeshNormalMaterial()
    }

    // 初始化网格
    initMesh() {
        // 物体 + 材料 附加到网格
        this.mesh = new THREE.Mesh(this.box, this.material)
        // 然后添加到场景
        this.scene.add(this.mesh)
        this.animationMeshBox()
    }

    // 网格上的物体进行动画
    animationMeshBox() {
        this.animation = requestAnimationFrame(this.animationMeshBox.bind(this))
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.01
        this.webGL.render(this.scene, this.camera)
    }

    // 初始化坐标轴帮助线
    initHelper() {
        const helper = new THREE.AxesHelper(5)
        this.scene.add(helper)
    }

    // 绘制网格
    getMesh(point = []) {
        const shape = new THREE.Shape()
        point.forEach((p, i) => {
            const [x, y] = p
            if (i === 0) {
                shape.moveTo(x, y)
            } else if (i === point.length - 1) {
                shape.quadraticCurveTo(x, y, x, y)
            } else {
                shape.lineTo(x, y)
            }
        })

        const geometry = new THREE.ExtrudeBufferGeometry(shape, {
            depth: 2,
            bevelEnabled: true
        })
        // 材质
        const material = new THREE.MeshBasicMaterial({
            color: '#007cff',
            transparent: true,
            opacity: 0.5
        })
        // 合并
        const meshMerge = new THREE.Mesh(geometry, material)
        return meshMerge
    }

    // 销毁
    destroyed() {}
}
