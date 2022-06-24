import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class threejsWebGL {
    constructor() {
        this.webGLDOM = null
        this.webGL = null
        this.camera = null
        this.scene = null
        this.controls = null
        this.animation = {}
        this.timeS = 0
        this.initWebGL()
        this.initScene()
        this.initCamera()
        this.initControl()
        this.initLight()
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
        this.webGL.setClearColor(0xffffff, 0)
        this.webGLDOM = this.webGL.domElement
        document.querySelector('#app').appendChild(this.webGLDOM)
        window.addEventListener('resize', this.onWindowResize.bind(this), false)
    }

    // 初始化相机
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000)
        this.camera.position.set(100, 300, 300)
        this.camera.lookAt(0, 0, 0)
        setTimeout(() => {
            this.animationPlay('fov', () => {
                this.camera.fov = 150
            })
        }, 1000)
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
        this.controls.dampingFactor = 0.4
        this.controls.rotateSpeed = 0.5
        // this.controls.enableDamping = true
        // this.controls.dampingFactor = 0.25
        // this.controls.rotateSpeed = 0.35

        // 控制器动画

        this.animationPlay('controlsAnimation', () => {
            if (this.controls) this.controls.update()
        })

        // this.controls.enableZoom = true // false-禁止右键缩放
        // this.controls.maxDistance = 200 // 最大缩放 适用于 PerspectiveCamera
        // this.controls.minDistance = 50 // 最大缩放
        // this.controls.enableRotate = true // false-禁止旋转
        // this.controls.minZoom = 0.5 // 最小缩放 适用于OrthographicCamera
        // this.controls.maxZoom = 2 // 最大缩放
    }

    // 初始化光源
    initLight() {
        const ambient = new THREE.AmbientLight()
        this.scene.add(ambient)
    }

    // 初始化辅助系统 网格和坐标
    initHelper() {
        const axisHelper = new THREE.AxesHelper(300)
        this.scene.add(axisHelper)
        const gridHelper = new THREE.GridHelper(600, 60)
        this.scene.add(gridHelper)
    }

    // 根据浏览器窗口变化动态更新尺寸
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.webGL.setSize(window.innerWidth, window.innerHeight)
        this.initRender()
    }

    // 模型对象进行动画
    animationPlay(name, fun) {
        if (!name || !fun || typeof fun !== 'function') return
        fun()
        this.initRender()
        this.animation[name] = requestAnimationFrame(this.animationPlay.bind(this, name, fun))
    }

    // 时钟按FPS执行
    clockCallBack(FPS = 60, callback) {
        // 创建一个时钟对象Clock
        const clock = new THREE.Clock()
        // 设置渲染频率为30FBS，也就是每秒调用渲染器render方法大约30次
        const renderT = 1 / FPS //单位秒  间隔多长时间渲染渲染一次
        // 声明一个变量表示render()函数被多次调用累积时间
        // 如果执行一次renderer.render，timeS重新置0
        this.timeS = this.timeS + clock.getDelta()
        if (this.timeS > renderT) {
            // 控制台查看渲染器渲染方法的调用周期，也就是间隔时间是多少
            console.log(`调用.render时间间隔`, this.timeS * 1000 + '毫秒')
            this.timeS = 0
            callback && callback.call(this)
        }
    }

    // 销毁webgl
    destroyed() {
        Object.keys(this.animation).forEach((key) => cancelAnimationFrame(this.animation[key]))
        this.controls.dispose()
        this.camera.remove()
        this.scene.remove()
        this.webGL.clear()
        this.webGL.dispose()
        this.camera = null
        this.scene = null
        this.webGL = null
        document.querySelector('#app').removeChild(this.webGLDOM)
    }
}
