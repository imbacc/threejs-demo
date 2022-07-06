import * as THREE from 'three'
import * as d3geo from 'd3-geo'
import threejsWebGL from './threejsWebGL.js'
import { CSM } from 'three/examples/jsm/csm/CSM.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import TWEEN from '@tweenjs/tween.js'

export default class threejsMap extends threejsWebGL {
    constructor(scene, camera, webGL, webGLDOM) {
        super()
        this.scene = this.getValue('scene')
        this.camera = this.getValue('camera')
        this.controls = this.getValue('controls')
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
        this.scene.background = new THREE.Color('#192741')
        // // set controls
        // this.controls.enableZoom = true
        // this.controls.autoRotate = false
        // this.controls.autoRotateSpeed = 2
        // this.controls.enablePan = true
        // crame
        this.camera.position.set(0, -20, 150)
        // Object 3D
        // this.mapObject = new THREE.Object3D()
        // set light
        // let directionalLight = new THREE.DirectionalLight(0xffffff, 1.1)
        // directionalLight.position.set(300, 1000, 500)
        // directionalLight.target.position.set(0, 0, 0)
        // directionalLight.castShadow = true
        // this.scene.add(directionalLight)

        const addBox = (i) => {
            const box = new THREE.BoxGeometry(2.2, 2.2, 2.2)
            const material = new THREE.MeshNormalMaterial()
            const mesh = new THREE.Mesh(box, material)
            mesh.translateX(i * 10)
            // 然后添加到场景
            this.scene.add(mesh)
            this.animationPlay('box', () => {
                mesh.rotation.x += 0.01
                mesh.rotation.y += 0.01
                mesh.castShadow = true
                this.initRender()
            })
        }

        for (let i = 0; i < 3; i++) {
            addBox(i)
        }

        let material = new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true })

        let geometry = new THREE.PlaneGeometry(2000, 2000)

        let mesh2 = new THREE.Mesh(geometry, material)
        mesh2.position.set(0, -3, 0)
        mesh2.rotation.x = -Math.PI * 0.5
        mesh2.receiveShadow = true
        this.scene.add(mesh2)

        super.onControlsChange()
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
            // this.mapShowName(elem.properties.name, elem.properties.center)
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
        this.setTools()
        this.setRaycaster()

        // setTimeout(() => {
        //     new tween.Tween([100, 300, 300])
        //         .to([900, 900, 900], 1000 * 1)
        //         .easing(tween.Easing[100])
        //         .onUpdate(() => {
        //             camera.position.set([300, 600, 600])
        //             camera.lookAt(0, 0, 0)
        //         })
        //         .start()

        //     this.animationPlay('tween', () => {
        //         tween.update()
        //     })
        // })

        setTimeout(() => {
            var position = { x: 0, y: 300 }
            var target = { x: 400, y: 50 }
            const tween = new TWEEN.Tween(position).to(target, 2000).easing(TWEEN.Easing.Linear.None).start()
            this.animationPlay('tween', () => {
                tween.update()
            })
        }, 2300)
    }

    initMap2(mapData) {
        if (!mapData) return
        const canvas = document.createElement('canvas')
        canvas.setAttribute('id', 'name')
        canvas.setAttribute(
            'style',
            `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            `
        )
        document.querySelector('#app').appendChild(canvas)
        this.mapData = mapData
        const mapPackage = new THREE.Object3D()
        // d3-geo转化坐标
        const projection = d3geo.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0])
        // 遍历省份构建模型
        this.mapData.features.forEach((elem) => {
            // 新建一个省份容器：用来存放省份对应的模型和轮廓线
            const province = new THREE.Object3D()
            const coordinates = elem.geometry.coordinates
            coordinates.forEach((multiPolygon) => {
                multiPolygon.forEach((polygon) => {
                    // 这里的坐标要做2次使用：1次用来构建模型，1次用来构建轮廓线
                    const shape = new THREE.Shape()
                    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })

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
                    const extrudeSettings = {
                        depth: 4,
                        bevelEnabled: false
                    }
                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
                    const material = new THREE.MeshBasicMaterial({ color: '#d13a34', transparent: true, opacity: 0.6 })
                    const mesh = new THREE.Mesh(geometry, material)
                    const line = new THREE.Line(lineGeometry, lineMaterial)
                    province.add(mesh)
                    province.add(line)
                })
            })
            // 将geojson的properties放到模型中，后面会用到
            province.properties = elem.properties
            if (elem.properties.centroid) {
                const [x, y] = projection(elem.properties.centroid)
                province.properties._centroid = [x, y]
            }
            mapPackage.add(province)
        })
        this.mapPackage = mapPackage
        this.scene.add(mapPackage)

        // this.showName()
        // super.animationPlay('showName', () => {
        //     this.showName()
        // })
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

    showName() {
        const width = window.innerWidth
        const height = window.innerHeight
        let canvas = document.querySelector('#name')
        if (!canvas) return
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        // 新建一个离屏canvas
        const offCanvas = document.createElement('canvas')
        offCanvas.width = width
        offCanvas.height = height
        const ctxOffCanvas = canvas.getContext('2d')
        // 设置canvas字体样式
        ctxOffCanvas.font = '16.5px Arial'
        ctxOffCanvas.strokeStyle = '#FFFFFF'
        ctxOffCanvas.fillStyle = '#000000'
        // texts用来存储显示的名称，重叠的部分就不会放到里面
        const texts = []
        /**
         * 遍历省份数据，有2个核心功能
         * 1. 将3维坐标转化成2维坐标
         * 2. 后面遍历到的数据，要和前面的数据做碰撞对比，重叠的就不绘制
         * */
        this.mapData.features.forEach((elem, index) => {
            if (!elem.properties._centroid) return
            // 找到中心点
            const y = -elem.properties._centroid[1]
            const x = elem.properties._centroid[0]
            const z = 4
            // 转化为二维坐标
            const vector = new THREE.Vector3(x, y, z)
            const position = vector.project(this.camera)
            // 构建文本的基本属性：名称，left, top, width, height -> 碰撞对比需要这些坐标数据
            const name = elem.properties.name
            const left = ((vector.x + 1) / 2) * width
            const top = (-(vector.y - 1) / 2) * height
            const text = {
                name,
                left,
                top,
                width: ctxOffCanvas.measureText(name).width,
                height: 16.5
            }
            // 碰撞对比
            let show = true
            for (let i = 0, j = texts.length; i < j; i++) {
                if (
                    text.left + text.width < texts[i].left ||
                    text.top + text.height < texts[i].top ||
                    texts[i].left + texts[i].width < text.left ||
                    texts[i].top + texts[i].height < text.top
                ) {
                    show = true
                } else {
                    show = false
                    break
                }
            }
            if (show) {
                texts.push(text)
                ctxOffCanvas.strokeText(name, left, top)
                ctxOffCanvas.fillText(name, left, top)
            }
        })
        // 离屏canvas绘制到canvas中
        ctx.drawImage(offCanvas, 0, 0)
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
    mapShowName(name, center) {
        if (!center) return
        const x = center[0]
        const y = -center[1]
        const z = 10.6
        //创建canvas对象用来绘制文字
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = 'rgb(255,255,250)'
        ctx.font = 'bolder 36px Arial '
        ctx.strokeStyle = '#FFFFFF'
        ctx.fillStyle = '#000000'
        ctx.fillText(name, 20, 55)
        // ctx.globalAlpha = 1
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
        geometry.setFromPoints([new THREE.Vector2(x, y, z)])
        let sprite = new THREE.Points(geometry, spriteMaterial)
        sprite.position.set(x - 200, y + 50, z)
        // sprite.translateX(-190)
        // sprite.translateY(30)
        this.scene.add(sprite)
        canvas.remove()
    }

    // 销毁
    destroyed() {}
}
