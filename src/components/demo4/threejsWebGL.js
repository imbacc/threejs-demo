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
        this.initHelper()
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
        window.addEventListener('resize', this.onWindowResize.bind(this), false)
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
    }

    // 初始化编译
    initRender() {
        this.webGL.render(this.scene, this.camera)
    }

    // 初始化控制器
    initControl() {
        this.controls = new OrbitControls(this.camera, this.webGLDOM)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.rotateSpeed = 0.35
        this.controls.update()
    }

    // 初始化光源
    initAroundLight() {
        var ambient = new THREE.AmbientLight()
        // var ambient = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambient)
    }

    // 初始化辅助系统 网格和坐标
    initHelper() {
        const axisHelper = new THREE.AxesHelper(300)
        this.scene.add(axisHelper)
        // const gridHelper = new THREE.GridHelper(600, 60)
        // this.scene.add(gridHelper)
    }

    // 根据浏览器窗口变化动态更新尺寸
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.webGL.setSize(window.innerWidth, window.innerHeight)
    }

    // 销毁webgl
    destroyed() {
        this.controls.dispose()
        this.camera.remove()
        this.scene.remove()
        this.webGL.dispose()
        this.camera = null
        this.scene = null
        this.webGL = null
        document.querySelector('#app').removeChild(this.webGLDOM)
    }
}
