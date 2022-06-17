import * as THREE from 'three'
import * as d3geo from 'd3-geo'
import threejsWebGL from './threejsWebGL.js'
import { CSM } from 'three/examples/jsm/csm/CSM.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class threejsMap extends threejsWebGL {
    constructor(scene, camera, webGL, webGLDOM) {
        super()
        this.scene = this.getValue('scene')
        this.camera = this.getValue('camera')
        this.webGL = this.getValue('webGL')
        this.webGLDOM = this.getValue('webGLDOM')
        // data
        this.mapPackage = null
        this.raycaster = null
        this.lastPick = null
        this.tooltip = null
        this.mouse = null
        this.mapData = []
        this.init()
        super.initRender()
    }

    init() {
        // set webGL
        this.webGL.setPixelRatio(window.devicePixelRatio)
        // // set scene
        this.scene.background = new THREE.Color(0xf0f0f0)
        // // set controls
        // this.controls.enableZoom = true
        // this.controls.autoRotate = false
        // this.controls.autoRotateSpeed = 2
        // this.controls.enablePan = true
        // Object 3D
        // this.mapObject = new THREE.Object3D()
        // set light
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1.1)
        directionalLight.position.set(300, 1000, 500)
        directionalLight.target.position.set(0, 0, 0)
        directionalLight.castShadow = true
        this.scene.add(directionalLight)
    }

    initMap(mapData) {
        if (!mapData) return
        this.mapData = mapData
        // d3-geo转化坐标
        const projection = d3geo.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0])
        // 初始化一个地图对象
        const mapPackage = new THREE.Object3D()
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 'white'
        })

        const material = new THREE.MeshBasicMaterial({
            color: '#2defff',
            transparent: true,
            opacity: 0.6
        })

        const material1 = new THREE.MeshBasicMaterial({
            color: '#3480C4',
            transparent: true,
            opacity: 0.5
        })

        mapData.features.forEach((elem) => {
            this.mapShowName(elem.name, elem.center[0], elem.center[1])
            // 定一个省份3D对象
            const province = new THREE.Object3D()
            // 循环坐标数组
            elem.geometry.coordinates.forEach((multiPolygon) => {
                multiPolygon.forEach((polygon) => {
                    const shape = new THREE.Shape()
                    const lineGeometry = new THREE.BufferGeometry()
                    const vector3Array = new Array()
                    for (let i = 0, j = polygon.length; i < j; i++) {
                        const [xVal, yVal] = projection(polygon[i])
                        const x = xVal ? xVal : 0
                        const y = yVal ? -yVal : 0
                        if (i === 0) shape.moveTo(x, y)
                        shape.lineTo(x, y)
                        vector3Array.push(new THREE.Vector3(x, y, 4.01))
                        // this.mapShowName(elem.name, x, y)
                        // vector3Array.push(x, y, 4.01)
                    }
                    // const vertices = new Float32Array(vector3Array)
                    // lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
                    lineGeometry.setFromPoints(vector3Array)

                    const geometry = new THREE.ExtrudeGeometry(shape, {
                        depth: 10,
                        bevelEnabled: false
                    })

                    const mesh = new THREE.Mesh(geometry, [material.clone(), material1.clone()])
                    const line = new THREE.Line(lineGeometry, lineMaterial.clone())
                    province.properties = elem.properties
                    province.add(mesh)
                    province.add(line)
                    mapPackage.add(province)
                })
            })
        })
        this.mapPackage = mapPackage
        this.scene.add(mapPackage)
        this.camera.position.set(0, -20, 150)
        this.setTools()
        this.setRaycaster()
    }

    setTools() {
        if (!this.tooltip) {
            const ele = document.createElement('div')
            ele.setAttribute('id', 'tooltip')
            ele.setAttribute(
                'style',
                `
                position: absolute;
                z-index: 2;
                background: white;
                padding: 10px;
                border-radius: 2px;
                visibility: hidden;
                user-select: none;
                `
            )
            document.querySelector('#app').appendChild(ele)
            this.tooltip = ele
        } else {
            this.tooltip = document.querySelector('#tooltip')
        }
    }

    setRaycaster() {
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.webGLDOM.addEventListener('mousemove', this.mouseEvent.bind(this))
        this.animationPlay('raycaster', () => {
            // 通过摄像机和鼠标位置更新射线
            this.raycaster.setFromCamera(this.mouse, this.camera)
            // 算出射线 与当场景相交的对象有那些
            // 算出射线 与当场景相交的对象有那些
            const intersects = this.raycaster.intersectObjects(this.scene.children, true)
            // 恢复上一次清空的
            if (this.lastPick) {
                this.lastPick.object.material[0].color.set('#2defff')
                this.lastPick.object.material[1].color.set('#3480C4')
            }
            this.lastPick = null
            this.lastPick = intersects.find((item) => item.object?.material?.length === 2)
            this.tooltip.style.visibility = 'hidden'
            if (this.lastPick) {
                this.lastPick.object.material[0].color.set(0xff0000)
                this.lastPick.object.material[1].color.set(0xff0000)
                const properties = this.lastPick.object.parent.properties
                if (properties.name) {
                    this.tooltip.textContent = properties.name
                    this.tooltip.style.visibility = 'visible'
                }
            }
            this.initRender()
        })
    }

    mouseEvent(event) {
        const { top, left, width, height } = this.webGLDOM.getBoundingClientRect()
        const clientX = event.clientX - left
        const clientY = event.clientY - top

        this.mouse.x = (clientX / width) * 2 - 1
        this.mouse.y = -(clientY / height) * 2 + 1
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        // 更改div位置
        this.tooltip.style.left = clientX + 2 + 'px'
        this.tooltip.style.top = clientY + 2 + 'px'
    }

    // 显示名称
    mapShowName(name, x, y) {
        //创建canvas对象用来绘制文字
        // let position = { x: 0, y: 0, z: 0 }
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = 'rgb(255,255,250)'
        ctx.font = 'bolder 36px Arial '
        ctx.strokeStyle = '#FFFFFF'
        ctx.fillStyle = '#000000'
        ctx.fillText(name, 130, 55)
        ctx.globalAlpha = 1
        // 将画布生成的图片作为贴图给精灵使用，并将精灵创建在设定好的位置
        let texture = new THREE.Texture(canvas)
        texture.needsUpdate = true
        //创建精灵，将该材质赋予给创建的精灵
        let spriteMaterial = new THREE.PointsMaterial({
            map: texture,
            sizeAttenuation: true,
            size: 30,
            transparent: true,
            opacity: 1
        })
        //创建坐标点，并将材质给坐标
        let geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([x, y, 0], 1))
        let sprite = new THREE.Points(geometry, spriteMaterial)
        sprite.position.set(x, -y + 2, 6)
        this.scene.add(sprite)
        canvas.remove()
    }

    // 销毁
    destroyed() {}
}
