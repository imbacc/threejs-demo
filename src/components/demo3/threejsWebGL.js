import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class threejsWebGL {
    constructor() {
        this.webGLDOM = null
        this.webGL = null
        this.camera = null
        this.scene = null
        this.controls = null
        this.initWebGL()
        this.initCamera()
        this.initScene()
        this.initControl()
        this.initRender()
    }

    // 初始化WebGL
    initWebGL() {
        // antialias 反锯齿
        this.webGL = new THREE.WebGLRenderer({ antialias: true })
        // 设置大小
        this.webGL.setSize(window.innerWidth, window.innerHeight)
        this.webGL.setClearColor(0x000000, 1.0)
        this.webGLDOM = this.webGL.domElement
        document.querySelector('#app').appendChild(this.webGLDOM)
    }

    // 初始化相机
    initCamera() {
        // this.camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000)
        // // this.camera.up.x = 0
        // // this.camera.up.y = 0
        // // this.camera.up.z = 1
        // // this.camera.position.set(100, 100, 100)
        // // this.camera.lookAt(0, 0, 0)
        // this.camera.position.set(0, 100, -3)
        // this.camera.lookAt(new THREE.Vector3())

        this.camera = new THREE.PerspectiveCamera(8, window.innerWidth / window.innerHeight, 1, 1000)
        //向上的一个坐标系
        this.camera.up.x = 0
        this.camera.up.y = 0
        this.camera.up.z = 1
        this.camera.position.set(100, 300, 300)
        this.camera.lookAt(0, 0, 0)
    }

    // 初始化场景
    initScene() {
        this.scene = new THREE.Scene()
    }

    // 初始化编译
    initRender() {
        this.webGL.render(this.scene, this.camera)
    }

    initControl() {
        this.controls = new OrbitControls(this.camera, this.webGLDOM)
        this.controls.update()
    }

    // 销毁webgl
    destroyed() {
        this.camera.remove()
        this.scene.remove()
        this.webGL.dispose()
        this.camera = null
        this.scene = null
        this.webGL = null
        document.querySelector('#app').removeChild(this.webGLDOM)
    }
}
