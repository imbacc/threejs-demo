import * as THREE from 'three'
import threejsWebGL from './threejsWebGL.js'

export default class threejsMap extends threejsWebGL {
    constructor() {
        super()
        this.scene = super.getValue('scene')
        this.camera = super.getValue('camera')
        this.webGL = super.getValue('webGL')
        this.webGLDOM = super.getValue('webGLDOM')

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
        this.initLight()
    }

    // 初始化 几何体
    initBox() {
        this.box = new THREE.BoxGeometry(2.2, 2.2, 2.2)
    }

    // 初始化材质
    initMaterial() {
        this.material = new THREE.MeshNormalMaterial()
    }

    // 初始化模型对象
    initMesh() {
        // 物体 + 材料 附加到网格
        this.mesh = new THREE.Mesh(this.box, this.material)
        // 然后添加到场景
        this.scene.add(this.mesh)
        this.animationMeshBox()
    }

    // 初始化坐标轴帮助线
    initHelper() {
        const helper = new THREE.AxesHelper(5)
        this.scene.add(helper)
    }

    initLight() {
        //点光源
        var point = new THREE.PointLight(0xffffff)
        point.position.set(400, 200, 300) //点光源位置
        this.scene.add(point) //点光源添加到场景中
        //环境光
        var ambient = new THREE.AmbientLight(0x444444)
        this.scene.add(ambient)
    }

    // 网格上的物体进行动画
    animationMeshBox() {
        this.mesh.rotateX(0.01)
        this.mesh.rotateY(0.01)
        this.webGL.render(this.scene, this.camera)
        this.animation = requestAnimationFrame(this.animationMeshBox.bind(this))
    }

    // 获取模型对象
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
