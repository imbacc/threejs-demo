import * as THREE from 'three'
import * as d3 from 'd3-geo'
import threejsWebGL from './threejsWebGL.js'

import pic1 from '@/assets/img/lightray.jpg'
import pic2 from '@/assets/img/lightray_yellow.jpg'

export default class threejsLightBar {
    constructor(map) {
        this.map = map
        this.mapData = []
        this.lightBarList = []
        this.projection = null
        this.textures = [new THREE.TextureLoader().load(pic1), new THREE.TextureLoader().load(pic2)]
        this.colors = ['#fff', '#ffeb3b']
    }

    setMapData(data) {
        this.mapData = Array.isArray(data) ? data : data?.features || []
        console.log('%c [ this.mapData ]-24', 'font-size:14px; background:#41b883; color:#ffffff;', this.mapData)
    }

    initDrawLightBar(data) {
        this.lightBarList = data
        const group = new THREE.Group()
        for (let i = 0, j = data.length; i < j; i++) {
            const { name, value } = data[i]
            const findIndex = this.mapData.findIndex((f) => ~f.properties.name.indexOf(name))
            const find = this.mapData[findIndex]?.properties
            const cp = find?.center || null
            if (!cp) continue
            const [x, y, z] = this.lnglatToVector(cp)
            this.lightBarList[i].vector3 = [x, y, z]
            const geometry = new THREE.PlaneGeometry(1, value / 5)
            const material = new THREE.MeshBasicMaterial({
                map: this.textures[i % 2], ////颜色贴图
                color: '#ffff00',
                transparent: true,
                opacity: 0.7,
                depthTest: false, //深度测试属性
                blending: THREE.AdditiveBlending, //滤镜选择
                side: THREE.DoubleSide
            })
            const plane = new THREE.Mesh(geometry, material)
            plane.position.set(x, y, -(z + value / 5 / 2))
            plane.rotation.x = Math.PI / 2
            group.add(plane)
            const plane2 = plane.clone()
            plane2.rotation.y = Math.PI / 2
            group.add(plane2)
            group.add(this.addButtomPlate([x, y, z], i))
        }
        group.rotation.y = Math.PI
        this.map.scene.add(group)
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

    initDrawFlyLine(data) {
        const group = new THREE.Group()
        data.forEach((d) => {
            const { source, target } = d
            const sourceName = source.name
            const targetName = target.name
            const sourceFind = this.lightBarList.find((f) => ~f.name.indexOf(sourceName))
            const targetFind = this.lightBarList.find((f) => ~f.name.indexOf(targetName))
            const [x0, y0, z0] = sourceFind?.vector3 || [...sourceFind?.center, 0]
            const [x1, y1, z1] = targetFind?.vector3 || [...targetFind?.center, 0]

            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(x0, y0, z0),
                new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, -10),
                new THREE.Vector3(x1, y1, z1)
            )

            const points = curve.getPoints(10)
            const geometry = new THREE.BufferGeometry()

            geometry.setFromPoints(points)
            // geometry.vertices = points
            const material = new THREE.LineBasicMaterial({
                // color: THREE.vertexColors,
                color: '#ff0000',
                transparent: true,
                linewidth: 10,
                opacity: 1,
                side: THREE.DoubleSide
            })
            const line = new THREE.Line(geometry, material)
            group.add(line)
        })
        group.rotation.y = Math.PI
        this.map.scene.add(group)
    }
}
