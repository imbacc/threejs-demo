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
        this.group = null
        this.raycaster = null
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
        this.controls.enableZoom = true
        this.controls.autoRotate = false
        this.controls.autoRotateSpeed = 2
        this.controls.enablePan = true
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
        // 遍历省份构建模型
        const vector3Json = []
        this.mapData.features.forEach((element) => {
            const areas = element.geometry.coordinates[0]
            //es6解构 ...data
            //var a = { name: '张三', age: 25 }  var b = {job: 'web前端',...a}
            // 相当于 var c = {job: 'web前端',name: '张三',age: 25}
            const areaData = { ...element.properties, coordinates: [] }
            areas.forEach((area, i) => {
                if (area[0] instanceof Array) {
                    areaData.coordinates[i] = []
                    area.forEach((areaInner) => {
                        const [y, x] = projection([...areaInner])
                        areaData.coordinates[i].push([y, x, 0])
                    })
                } else {
                    const [y, x] = projection([...area])
                    areaData.coordinates.push([y, x, 0])
                }
            })
            // if (element.properties.name) vector3Json[element.properties.name] = areaData
            vector3Json.push(areaData)
        })
        //console.log('vector3json', this.vector3Json)
        //绘制模块
        const group = new THREE.Group()
        const lineGroup = new THREE.Line()
        vector3Json.forEach((provinces) => {
            const [x, y] = provinces.center || provinces.cp || [0, 0]
            this.mapShowName(provinces.name, x, y)
            //var a=[[1,2,3],[4,5,6]]
            //访问：a[0][0]=1,a[1][2]=6 （起始值0）
            if (provinces.coordinates[0][0] instanceof Array) {
                provinces.coordinates.forEach((area) => {
                    const mesh = this.getAreaMesh(area)
                    group.add(mesh)
                    const line = this.drawLine(area)
                    lineGroup.add(line)
                })
            } else {
                //单面
                //console.log(provinces.coordinates)
                const mesh = this.getAreaMesh(provinces.coordinates)
                group.add(mesh)
                const line = this.drawLine(provinces.coordinates)
                lineGroup.add(line)
            }
        })

        group.rotateX(360)
        lineGroup.rotateX(360)
        // group.rotation.y = Math.PI
        // lineGroup.rotation.y = Math.PI
        this.group = group
        this.scene.add(group)
        this.scene.add(lineGroup)
        this.camera.position.set(30, 80, 100)
        document.body.addEventListener('mousemove', this.mouseEvent.bind(this))
    }

    getAreaMesh(points) {
        //console.log('---' + points);
        const shape = new THREE.Shape() //实例一个形状

        //const [x0, y0] = points[0];
        points.forEach((p, i) => {
            //console.log(p);
            const [x, y] = p
            if (i === 0) {
                shape.moveTo(x, y)
            } else if (i === points.length - 1) {
                shape.quadraticCurveTo(x, y, x, y) //二次曲线
            } else {
                shape.lineTo(x, y, x, y)
            }
        })
        //几何体
        const geometry = new THREE.ExtrudeGeometry(
            shape,
            { depth: 2, bevelEnabled: false } //启用斜角
        )
        //材质
        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: '#007cff',
            transparent: true,
            opacity: 0.5
        })

        //合并成一个网格模型
        const mesh = new THREE.Mesh(geometry, material)
        return mesh
    }

    //绘制线条
    drawLine(points) {
        const material = new THREE.LineBasicMaterial({
            side: THREE.DoubleSide,
            color: '#ccc',
            transparent: true,
            opacity: 0.8
        })
        const geometry = new THREE.BufferGeometry()
        const pointsArray = new Array()
        points.forEach((d) => {
            const [x, y, z] = d
            pointsArray.push(new THREE.Vector3(x, y, z))
        })

        geometry.setFromPoints(pointsArray)
        const line = new THREE.Line(geometry, material)
        return line
    }

    mouseEvent(event) {
        if (!this.raycaster) this.raycaster = new THREE.Raycaster()
        if (!this.mouse) this.mouse = new THREE.Vector2()

        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        // 通过摄像机和鼠标位置更新射线
        this.raycaster.setFromCamera(this.mouse, this.camera)

        // 计算物体和射线的焦点
        const intersects = this.raycaster.intersectObjects(this.group.children)
        this.group.children.forEach((mesh) => {
            mesh.material.color.set('#005fc3')
        })

        for (let i = 0, j = intersects.length; i < j; i++) {
            intersects[i].object.material.color.set(0xff0000)
        }
    }

    // 显示名称
    mapShowName(name, x, y) {
        //创建canvas对象用来绘制文字
        let position = { x: 0, y: 0, z: 0 }
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
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([x, y, 0], 3))
        let sprite = new THREE.Points(geometry, spriteMaterial)
        sprite.position.set(position.x, position.y, position.z)
        this.scene.add(sprite)
    }

    // 销毁
    destroyed() {}
}
