import * as THREE from 'three'
import * as d3 from 'd3-geo'
import pic1 from '@/assets/img/lightray.jpg'
import pic2 from '@/assets/img/lightray_yellow.jpg'

export default class threejsLightBar {
    constructor(scene, vector3Json) {
        this.scene = scene
        this.vector3Json = vector3Json
        this.projection = null
        this.textures = [new THREE.TextureLoader().load(pic1), new THREE.TextureLoader().load(pic2)]
        this.colors = ['#fff', '#ffeb3b']
    }

    setVector3Json(data) {
        this.vector3Json = data
    }

    drawLightBar(data) {
        const group = new THREE.Group()
        const texture = new THREE.TextureLoader().load(pic1)
        //texture.rotation.x = Math.PI;
        for (let i = 0, j = data.length; i < j; i++) {
            const d = data[i]
            const name = d.name.replace('市', '')
            const findIndex = this.vector3Json.findIndex((f) => ~f.name.indexOf(name))
            const find = this.vector3Json[findIndex]
            const cp = find?.cp || find?.center || null
            if (!cp) continue
            const [x, y, z] = this.lnglatToVector(cp)
            this.vector3Json[findIndex].vector3 = [x, y, z]
            const geometry = new THREE.PlaneGeometry(1, d.value / 5)
            const material = new THREE.MeshBasicMaterial({
                //map: texture,
                map: this.textures[i % 2], ////颜色贴图
                color: '#ffff00',
                transparent: true,
                opacity: 0.7,
                depthTest: false, //深度测试属性
                blending: THREE.AdditiveBlending, //滤镜选择
                side: THREE.DoubleSide
            })
            const plane = new THREE.Mesh(geometry, material)
            plane.position.set(x, y, -(z + d.value / 5 / 2))
            plane.rotation.x = Math.PI / 2
            group.add(plane)
            const plane2 = plane.clone()
            plane2.rotation.y = Math.PI / 2
            group.add(plane2)
            group.add(this.addButtomPlate([x, y, z], i))
        }
        group.rotation.y = Math.PI
        this.scene.add(group)
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

    addButtomPlate(point, i) {
        const geometry = new THREE.CircleGeometry(0.4, 6)
        const material = new THREE.MeshBasicMaterial({
            color: this.colors[i % 2],
            side: THREE.DoubleSide
        })
        const circle = new THREE.Mesh(geometry, material)
        const [x, y, z] = point
        circle.position.set(x, y, z)
        return circle
    }

    drawFlyLine(data) {
        const group = new THREE.Group()
        data.forEach((d) => {
            const { source, target } = d
            const sourceName = source.name.replace('市', '')
            const targetName = target.name.replace('市', '')
            const sourceFind = this.vector3Json.find((f) => ~f.name.indexOf(sourceName))
            const targetFind = this.vector3Json.find((f) => ~f.name.indexOf(targetName))
            const [x0, y0, z0] = sourceFind?.vector3 || sourceFind?.center || []
            console.log('%c [ z0 ]-94', 'font-size:14px; background:#41b883; color:#ffffff;', z0)
            console.log('%c [ y0 ]-94', 'font-size:14px; background:#41b883; color:#ffffff;', y0)
            console.log('%c [ x0 ]-94', 'font-size:14px; background:#41b883; color:#ffffff;', x0)
            const [x1, y1, z1] = targetFind?.vector3 || targetFind?.center || []

            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(x0, y0, z0),
                new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, -10),
                new THREE.Vector3(x1, y1, z1)
            )

            const points = curve.getPoints(10)
            const geometry = new THREE.BufferGeometry()

            // geometry.setFromPoints(...points)
            geometry.vertices = points
            const material = new THREE.LineBasicMaterial({
                color: THREE.vertexColors
                // color: '#ff0000',
                // transparent: true,
                // opacity: 0.6,
                // side: THREE.DoubleSide
            })
            const line = new THREE.Line(geometry, material)
            group.add(line)
        })
        group.rotation.y = Math.PI
        this.scene.add(group)
    }
}
