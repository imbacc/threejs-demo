import * as THREE from 'three'

export default class threejsMap {
    constructor() {
        this.WebGLDOM = null
        this.WebGL = null
        this.Carmera = null
        this.Scene = null
        this.Box = null
        this.Material = null
        this.Mesh = null
        this.Animation = null
        this.initWebGL()
        this.initCamera()
        this.initScene()
        this.initBox()
        this.initMaterial()
        this.initMesh()
        this.initHelper()
        this.initRender()
    }

    // 初始化WebGL
    initWebGL() {
        // antialias 反锯齿
        this.WebGL = new THREE.WebGLRenderer({ antialias: true })
        // 设置大小
        this.WebGL.setSize(window.innerWidth, window.innerHeight)
        this.WebGLDOM = this.WebGL.domElement
        document.querySelector('#app').appendChild(this.WebGLDOM)
    }

    // 初始化相机
    initCamera() {
        this.Carmera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.01, 1000)
        this.Carmera.position.z = 1

        // 
        this.Carmera.up.x = 0
        this.Carmera.up.y = 0
        this.Carmera.up.z = 1
        this.Carmera.position.set(100, 100, 100)
        this.Carmera.lookAt(0, 0, 0)
    }

    // 初始化场景
    initScene() {
        this.Scene = new THREE.Scene()
    }

    // 初始化物体
    initBox() {
        this.Box = new THREE.BoxGeometry(2.2, 2.2, 2.2)
    }

    // 初始化材料
    initMaterial() {
        this.Material = new THREE.MeshNormalMaterial()
    }

    // 初始化网格
    initMesh() {
        // 物体 + 材料 附加到网格
        this.Mesh = new THREE.Mesh(this.Box, this.Material)
        // 然后添加到场景
        this.Scene.add(this.Mesh)
    }

    // 初始化坐标轴帮助线
    initHelper() {
        const helper = new THREE.AxesHelper(5)
        this.Scene.add(helper)
    }

    // 初始化编译
    initRender() {
        this.animateRender()
    }

    // 销毁webgl
    destroyedWebGL() {
        cancelAnimationFrame(this.Animation)
        this.Box.dispose()
        this.Material.dispose()
        this.Mesh.geometry.dispose()
        this.Mesh.remove()
        this.Scene.remove()
        this.WebGL.dispose()
        this.WebGL = null
        this.Carmera = null
        this.Scene = null
        this.Box = null
        this.Material = null
        this.Mesh = null
        document.querySelector('#app').removeChild(this.WebGLDOM)
    }

    animateRender() {
        this.Animation = requestAnimationFrame(this.animateRender.bind(this))
        this.Mesh.rotation.x += 0.01
        this.Mesh.rotation.y += 0.01
        this.WebGL.render(this.Scene, this.Carmera)
    }
}
