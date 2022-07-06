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
        this.tempStorage = {}
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
        this.webGL.setPixelRatio(window.devicePixelRatio)
        this.webGL.setSize(window.innerWidth, window.innerHeight)
        this.webGL.setClearColor(0xffffff, 0)
        this.webGLDOM = this.webGL.domElement
        this.webGL.shadowMap.enabled = true
        this.webGL.shadowMap.type = THREE.PCFSoftShadowMap
        this.webGL.outputEncoding = THREE.sRGBEncoding
        document.querySelector('#app').appendChild(this.webGLDOM)
        window.addEventListener('resize', this.onWindowResize.bind(this), false)
    }

    // 初始化相机
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000)
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
        this.controls.minDistance = 20
        this.controls.maxDistance = 500
        this.controls.enablePan = false
        // this.controls.enableDamping = true
        // this.controls.dampingFactor = 0.4
        // this.controls.rotateSpeed = 0.5
        // this.controls.enableDamping = true
        // this.controls.dampingFactor = 0.25
        // this.controls.rotateSpeed = 0.35
        this.controls.addEventListener('change', this.onControlsChange.bind(this))

        // 控制器动画
        // this.animationPlay('controlsAnimation', () => {
        //     if (this.controls) this.controls.update()
        // })

        // this.controls.enableZoom = true // false-禁止右键缩放
        // this.controls.maxDistance = 200 // 最大缩放 适用于 PerspectiveCamera
        // this.controls.minDistance = 50 // 最大缩放
        // this.controls.enableRotate = true // false-禁止旋转
        // this.controls.minZoom = 0.5 // 最小缩放 适用于OrthographicCamera
        // this.controls.maxZoom = 2 // 最大缩放
    }

    // 初始化光源
    initLight() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.1)
        this.scene.add(ambient)

        const spotLight = new THREE.SpotLight(0xffffff, 1)
        spotLight.position.set(15, 40, 35)
        spotLight.angle = Math.PI / 4
        spotLight.penumbra = 0.1
        spotLight.decay = 2
        spotLight.distance = 200
        spotLight.castShadow = true
        spotLight.shadow.mapSize.width = 512
        spotLight.shadow.mapSize.height = 512
        spotLight.shadow.camera.near = 10
        spotLight.shadow.camera.far = 200
        spotLight.shadow.focus = 1
        this.tempStorage.spotLight = spotLight
        this.scene.add(spotLight)
    }

    // 初始化辅助系统 网格和坐标
    initHelper() {
        const axisHelper = new THREE.AxesHelper(300)
        this.scene.add(axisHelper)

        const gridHelper = new THREE.GridHelper(600, 60)
        this.scene.add(gridHelper)

        const lightHelper = new THREE.SpotLightHelper(this.tempStorage.spotLight)
        this.tempStorage.lightHelper = lightHelper
        this.scene.add(lightHelper)

        const shadowCameraHelper = new THREE.CameraHelper(this.tempStorage.spotLight.shadow.camera)
        this.tempStorage.shadowCameraHelper = shadowCameraHelper
        this.scene.add(shadowCameraHelper)
    }

    // 根据浏览器窗口变化动态更新尺寸
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.webGL.setSize(window.innerWidth, window.innerHeight)
        this.initRender()
    }

    onControlsChange() {
        this.tempStorage.lightHelper.update()
        this.tempStorage.shadowCameraHelper.update()
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
        this.tempStorage.timeS = this.tempStorage.timeS + clock.getDelta()
        if (this.tempStorage.timeS > renderT) {
            // 控制台查看渲染器渲染方法的调用周期，也就是间隔时间是多少
            console.log(`调用.render时间间隔`, this.tempStorage.timeS * 1000 + '毫秒')
            this.tempStorage.timeS = 0
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
        this.animation = {}
        this.tempStorage = {}
        this.camera = null
        this.scene = null
        this.webGL = null
        document.querySelector('#app').removeChild(this.webGLDOM)
    }
}
