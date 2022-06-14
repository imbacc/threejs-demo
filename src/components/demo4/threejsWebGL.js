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
        this.initScene()
        this.initCamera()
        this.initControl()
        this.initAroundLight()
        this.initRender()
    }

    getValue(key) {
        return this[key]
    }

    // 初始化WebGL
    initWebGL() {
        // antialias 反锯齿
        this.webGL = new THREE.WebGLRenderer({ antialias: true })
        // 设置大小
        this.webGL.setSize(window.innerWidth, window.innerHeight)
        this.webGL.setClearColor(0xb9d3ff, 1)
        this.webGLDOM = this.webGL.domElement
        document.querySelector('#app').appendChild(this.webGLDOM)
    }

    // 初始化相机
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000)
        this.camera.position.set(100, 300, 300)
        this.camera.lookAt(0, 0, 0)
    }

    // 初始化场景
    initScene() {
        this.scene = new THREE.Scene()
        this.scene.background = null
    }

    // 初始化编译
    initRender() {
        this.webGL.render(this.scene, this.camera)
    }

    // 初始化控制器
    initControl() {
        this.controls = new OrbitControls(this.camera, this.webGLDOM)
        this.controls.update()
    }

    // 初始化光源
    initAroundLight() {
        var ambient = new THREE.AmbientLight(0x444444)
        this.scene.add(ambient)
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
