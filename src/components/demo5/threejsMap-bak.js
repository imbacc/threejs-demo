import * as THREE from 'three'
import * as d3 from 'd3-geo'
import threejsWebGL from './threejsWebGL.js'
import { CSM } from 'three/examples/jsm/csm/CSM.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class threejsMap extends threejsWebGL {
    constructor(scene, camera, webGL, webGLDOM) {
        super()
        this.scene = super.getValue('scene')
        this.camera = super.getValue('camera')
        this.webGL = super.getValue('webGL')
        this.webGLDOM = super.getValue('webGLDOM')

        this.group = null
        this.projection = null
        this.raycaster = null
        this.mouse = null
        this.csm = null
        this.csmHelper = null

        // data
        this.vector3Json = []
        this.mapData = []
        // this.initCsm()
        this.setLight()
        // this.mapAnimation()
        super.initRender()
    }

    initMap(mapData) {
        this.mapData = mapData
        console.log('%c [ mapData ]-33', 'font-size:14px; background:#41b883; color:#ffffff;', mapData)
        this.drawGeometry()
        document.body.addEventListener('click', this.mouseEvent.bind(this))
    }

    initCsm() {
        this.csm = new CSM({
            maxFar: 1000,
            cascades: 4,
            mode: 'practical',
            parent: this.scene,
            shadowMapSize: 1024,
            lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
            camera: this.camera
        })

        this.csmHelper = new CSMHelper(this.csm)
        this.csmHelper.visible = false
        this.scene.add(this.csmHelper)
    }

    setLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2) // 环境光
        const balanceLight = new THREE.DirectionalLight(0xffffff, 0.5) // 平行光
        balanceLight.position.set(20, -50, 20)
        balanceLight.castShadow = true
        balanceLight.shadow.mapSize.width = 1024
        balanceLight.shadow.mapSize.height = 1024

        // 半球光
        const hemiLight = new THREE.HemisphereLight('#80edff', '#75baff', 0.3)
        // 这个也是默认位置
        hemiLight.position.set(20, -50, 0)

        const pointLight = new THREE.PointLight(0xffffff, 0.5)
        pointLight.position.set(20, -50, 50)
        pointLight.castShadow = true
        pointLight.shadow.mapSize.width = 1024
        pointLight.shadow.mapSize.height = 1024

        const pointLight2 = new THREE.PointLight(0xffffff, 0.5)
        pointLight2.position.set(50, -50, 20)
        pointLight2.castShadow = true
        pointLight2.shadow.mapSize.width = 1024
        pointLight2.shadow.mapSize.height = 1024

        const pointLight3 = new THREE.PointLight(0xffffff, 0.5)
        pointLight3.position.set(-50, -50, 20)
        pointLight3.castShadow = true
        pointLight3.shadow.mapSize.width = 1024
        pointLight3.shadow.mapSize.height = 1024

        this.scene.add(ambientLight)
        this.scene.add(balanceLight)
        this.scene.add(hemiLight)
        this.scene.add(pointLight)
        this.scene.add(pointLight2)
        this.scene.add(pointLight3)
    }

    // 地图模块框生成
    drawGeometry() {
        //console.log(this.mapData)
        //console.log(this.mapData);
        this.vector3Json = []
        let vector3Json = []
        this.mapData.features.forEach((element) => {
            const areas = element.geometry.coordinates[0]
            //es6解构 ...data
            //var a = { name: '张三', age: 25 }  var b = {job: 'web前端',...a}
            // 相当于 var c = {job: 'web前端',name: '张三',age: 25}
            const areaData = { ...element.properties, coordinates: [] }
            //通过循环，区分坐标或数组
            areas.forEach((area, i) => {
                //如果是数组
                if (area[0] instanceof Array) {
                    areaData.coordinates[i] = []
                    area.forEach((areaInner) => {
                        //console.log(pointInner);
                        areaData.coordinates[i].push(this.lnglatToVector(areaInner))
                    })
                } else {
                    areaData.coordinates.push(this.lnglatToVector(area))
                }
            })
            // if (element.properties.name) vector3Json[element.properties.name] = areaData
            vector3Json.push(areaData)
        })
        this.vector3Json = vector3Json
        //console.log('vector3json', this.vector3Json)
        //绘制模块
        const group = new THREE.Group()
        const lineGroup = new THREE.Line()
        this.vector3Json.forEach((provinces) => {
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
        this.group = group
        group.rotation.y = Math.PI
        lineGroup.rotation.y = Math.PI
        this.scene.add(group)
        this.scene.add(lineGroup)
    }

    //经纬度转三维坐标
    lnglatToVector(lnglat) {
        if (!this.projection) {
            this.projection = d3
                .geoMercator() //获取墨卡托坐标方法
                .center([112.946332, 28.236672])
                .scale(60)
                //.rotate(Math.PI / 4)
                .translate([0, 0])
        }
        //const projection = d3.geoMercator().center([108.904496, 32.668849]).scale(80);
        const [y, x] = this.projection([...lnglat])
        let z = 0
        return [y, x, z]
    }

    //绘制网格
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

    mapAnimation() {
        requestAnimationFrame(this.mapAnimation.bind(this))
        if (this.raycaster) {
            this.raycaster.setFromCamera(this.mouse, this.camera)

            // calculate objects intersecting the picking ray
            var intersects = this.raycaster.intersectObjects(this.scene.children, true)
            if (this.activeInstersect && this.activeInstersect.length > 0) {
                // 将上一次选中的恢复颜色
                this.activeInstersect.forEach((element) => {
                    const { object } = element
                    const { _color, material } = object
                    material[0].color.set(_color)
                    material[1].color.set(_color)
                })
            }

            this.activeInstersect = [] // 设置为空
            // console.log('select', intersects)
            for (let i = 0, j = intersects.length; i < j; i++) {
                // debugger;
                if (intersects[i].object.material && intersects[i].object.material.length === 2) {
                    this.activeInstersect.push(intersects[i])
                    intersects[i].object.material[0].color.set(HIGHT_COLOR)
                    intersects[i].object.material[1].color.set(HIGHT_COLOR)
                    break // 只取第一个
                }
            }
        }
        this.createProvinceInfo()
        this.camera.updateMatrixWorld()
        this.csm.update()
        this.controls.update()
        // csmHelper.update();
        super.initRender()
    }

    createProvinceInfo() {
        // 显示省份的信息
        if (this.activeInstersect.length !== 0 && this.activeInstersect[0].object.parent.properties.name) {
            var properties = this.activeInstersect[0].object.parent.properties

            this.provinceInfo.textContent = properties.name
            this.provinceInfo.style.visibility = 'visible'
        } else {
            this.provinceInfo.style.visibility = 'hidden'
        }
    }

    // 销毁
    destroyed() {}
}
