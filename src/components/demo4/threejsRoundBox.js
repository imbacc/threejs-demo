import * as THREE from 'three'
import threejsWebGL from './threejsWebGL.js'

export default class threejsMap extends threejsWebGL {
    constructor() {
        super()
        this.scene = super.getValue('scene')
        this.camera = super.getValue('camera')
        this.webGL = super.getValue('webGL')
        this.webGLDOM = super.getValue('webGLDOM')

        this.animation = {}
        this.mesh = {}
        this.initBoxMaterialUseMesh()
        this.initHelper()
        this.initLight()
        this.testLightPutin()
        this.testTreeGroup()
    }

    // 初始化 几何体,材质然后加入到网格模型对象 最后添加到场景
    initBoxMaterialUseMesh() {
        const testBox = new THREE.BoxGeometry(100, 100, 100)
        const testMaterial = new THREE.MeshLambertMaterial({
            color: 0xff0000,
            opacity: 0.7,
            transparent: true
        })
        const testMesh = new THREE.Mesh(testBox, testMaterial)
        testMesh.translateZ(100)
        testMesh.translateY(200)
        this.scene.add(testMesh)
        this.animationMeshBox('testMesh', () => {
            testMesh.rotateY(0.01)
        })
        testMesh.castShadow = true
        this.mesh.testMesh = testMesh
        setTimeout(() => {
            testMesh.material = new THREE.MeshPhongMaterial({
                color: 0x0000ff,
                opacity: 0.7,
                transparent: true,
                specular: 0x4488ee,
                shininess: 12
            })
        }, 500)

        // 立方体网格模型
        const geometry1 = new THREE.BoxGeometry(100, 100, 100)
        const material1 = new THREE.MeshLambertMaterial({
            color: 0x0000ff
        }) //材质对象Material
        const mesh1 = new THREE.Mesh(geometry1, material1) //网格模型对象Mesh
        mesh1.translateX(-110)
        this.scene.add(mesh1) //网格模型添加到场景中
        // 记录每次合成的 网格模型对象
        this.mesh.mesh1 = mesh1

        // 球体网格模型
        const geometry2 = new THREE.SphereGeometry(60, 40, 40)
        const material2 = new THREE.MeshLambertMaterial({
            color: 0xff00ff
        })
        const mesh2 = new THREE.Mesh(geometry2, material2) //网格模型对象Mesh
        mesh2.translateZ(220) //球体网格模型沿Y轴正方向平移120
        this.scene.add(mesh2)
        this.mesh.mesh2 = mesh2

        // 圆柱网格模型
        const geometry3 = new THREE.CylinderGeometry(50, 50, 100, 25)
        const material3 = new THREE.MeshLambertMaterial({
            color: 0xffff00
        })
        const mesh3 = new THREE.Mesh(geometry3, material3) //网格模型对象Mesh
        // mesh3.translateX(120); //球体网格模型沿Y轴正方向平移120
        mesh3.position.set(120, 0, 0) //设置mesh3模型对象的xyz坐标为120,0,0
        this.scene.add(mesh3)
        this.mesh.mesh3 = mesh3

        //创建一个Buffer类型几何体对象
        const geometry4 = new THREE.BufferGeometry()
        //类型数组创建顶点数据
        const vertices = new Float32Array([
            ...[0, 0, 0], //顶点1坐标
            ...[50, 0, 0], //顶点2坐标
            ...[0, 100, 0], //顶点3坐标
            ...[0, 0, 10], //顶点4坐标
            ...[0, 0, 100], //顶点5坐标
            ...[50, 0, 10] //顶点6坐标
        ])
        const colors = new Float32Array([
            ...[1, 0, 0], //顶点1颜色
            ...[0, 1, 0], //顶点2颜色
            ...[0, 0, 1], //顶点3颜色
            ...[1, 1, 0], //顶点4颜色
            ...[0, 1, 1], //顶点5颜色
            ...[1, 0, 1] //顶点6颜色
        ])
        const normals = new Float32Array([
            ...[0, 0, 1], //顶点1法向量
            ...[0, 0, 1], //顶点2法向量
            ...[0, 0, 1], //顶点3法向量
            ...[0, 1, 0], //顶点4法向量
            ...[0, 1, 0], //顶点5法向量
            ...[0, 1, 0] //顶点6法向量
        ])
        // Uint16Array类型数组创建顶点索引数据
        const indexes = new Uint16Array([
            // 0对应第1个顶点位置数据、第1个顶点法向量数据
            // 1对应第2个顶点位置数据、第2个顶点法向量数据
            // 索引值3个为一组，表示一个三角形的3个顶点
            0, 1, 2, 0, 2, 3
        ])
        // 设置几何体attributes属性的位置属性
        geometry4.attributes.position = new THREE.BufferAttribute(vertices, 3)
        geometry4.attributes.color = new THREE.BufferAttribute(colors, 3)
        geometry4.attributes.normal = new THREE.BufferAttribute(normals, 3)
        // 索引数据赋值给几何体的index属性
        geometry4.index = new THREE.BufferAttribute(indexes, 1) //1个为一组
        const material4 = new THREE.MeshPhongMaterial({
            // color: 0x0000ff,
            opacity: 0.7,
            transparent: true,
            specular: 0x4488ee,
            shininess: 12,
            side: THREE.DoubleSide //两面可见
        })
        // 几何体xyz三个方向都放大2倍
        geometry4.scale(2, 2, 2)
        // 几何体沿着x轴平移50
        geometry4.translate(50, 0, 0)
        // 几何体绕着x轴旋转45度
        geometry4.rotateX(Math.PI / 4)
        // 居中：偏移的几何体居中
        geometry4.center()
        material4.vertexColors = THREE.VertexColors
        const mesh4 = new THREE.Mesh(geometry4, material4)
        this.scene.add(mesh4)

        // 点渲染模式
        const pointMaterial = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 10.0 //点对象像素尺寸
        }) //材质对象

        const point1 = new THREE.Points(mesh4.geometry, pointMaterial) //点模型对象
        this.scene.add(point1) //点对象添加到场景中

        // 线条渲染模式
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000 //线条颜色
        }) //材质对象
        const line1 = new THREE.Line(mesh4.geometry, lineMaterial) //线条模型对象
        this.scene.add(line1) //线条对象添加到场景中

        //PointsMaterial
        const geometry5 = new THREE.SphereGeometry(100, 25, 25) //创建一个球体几何对象
        // 创建一个点材质对象
        const material5 = new THREE.PointsMaterial({
            color: 0x0000ff, //颜色
            size: 3 //点渲染尺寸
        })
        //点模型对象  参数：几何体  点材质
        const point = new THREE.Points(geometry5, material5)
        point.translateX(222)
        this.scene.add(point) //网格模型添加到场景中

        // LineBasicMaterial
        const geometry6 = new THREE.SphereGeometry(100, 25, 25) //球体
        // 直线基础材质对象
        const material6 = new THREE.LineBasicMaterial({
            color: 0x0000ff
        })
        const line2 = new THREE.Line(geometry6, material6) //线模型对象
        line2.translateX(222)
        line2.translateY(222)
        this.scene.add(line2) //点模型添加到场景中

        const geometry7 = new THREE.SphereGeometry(100, 25, 25) //球体
        // 虚线材质对象：产生虚线效果
        const material7 = new THREE.LineDashedMaterial({
            color: 0x0000ff,
            dashSize: 10, //显示线段的大小。默认为3。
            gapSize: 5 //间隙的大小。默认为1
        })
        material7.opacity = 0.7
        material7.transparent = true
        const line3 = new THREE.Line(geometry7, material7) //线模型对象
        //  computeLineDistances方法  计算LineDashedMaterial所需的距离数组
        // line3.computeLineDistances()
        line3.translateX(222)
        line3.translateY(-222)
        this.scene.add(line3)

        // 点模型Points
        const geometry8 = new THREE.BoxGeometry(100, 100, 100) //创建一个立方体几何对象Geometry
        // 点渲染模式
        const material8 = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 5.0 //点对象像素尺寸
        }) //材质对象
        const point3 = new THREE.Points(geometry8, material8) //点模型对象
        point3.translateX(-250)
        this.scene.add(point3)

        // 线模型Line
        const geometry9 = new THREE.BoxGeometry(100, 100, 100) //创建一个立方体几何对象Geometry
        // 线条渲染模式
        const material9 = new THREE.LineBasicMaterial({
            color: 0xff0000 //线条颜色
        }) //材质对象
        // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
        const line4 = new THREE.Line(geometry9, material9) //线条模型对象
        line4.translateZ(-200)
        this.scene.add(line4)

        //创建两个网格模型mesh1、mesh2
        const geometry10 = new THREE.BoxGeometry(20, 20, 20)
        const material10 = new THREE.MeshLambertMaterial({ color: 0x0000ff })
        const group1 = new THREE.Group()
        const childMesh1 = new THREE.Mesh(geometry10, material10)
        const childMesh2 = new THREE.Mesh(geometry10, material10)
        mesh2.translateY(25)
        //把mesh1型插入到组group中，mesh1作为group的子对象
        group1.add(childMesh1)
        //把mesh2型插入到组group中，mesh2作为group的子对象
        group1.add(childMesh2)
        group1.translateY(300)
        //把group插入到场景中作为场景子对象
        this.scene.add(group1)
    }

    // 光源投射
    testLightPutin() {
        //创建一个平面几何体作为投影面
        const planeGeometry = new THREE.PlaneGeometry(800, 800)
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x999999
        })
        // 平面网格模型作为投影面
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
        this.scene.add(planeMesh) //网格模型添加到场景中
        planeMesh.rotateX(-Math.PI / 2) //旋转网格模型
        planeMesh.position.y = -50 //设置网格模型y坐标
        // 设置接收阴影的投影面
        planeMesh.receiveShadow = true
        planeMesh.castShadow = true

        // 方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        // 设置光源位置
        directionalLight.position.set(60, 100, 40)
        this.scene.add(directionalLight)
        // 设置用于计算阴影的光源对象
        directionalLight.castShadow = true
        // 设置计算阴影的区域，最好刚好紧密包围在对象周围
        // 计算阴影的区域过大：模糊  过小：看不到或显示不完整
        directionalLight.shadow.camera.near = 0.5
        directionalLight.shadow.camera.far = 300
        directionalLight.shadow.camera.left = -50
        directionalLight.shadow.camera.right = 50
        directionalLight.shadow.camera.top = 200
        directionalLight.shadow.camera.bottom = -100
        // 设置mapSize属性可以使阴影更清晰，不那么模糊
        // directionalLight.shadow.mapSize.set(1024,1024)
        console.log(directionalLight.shadow.camera)

        // 聚光光源
        const spotLight = new THREE.SpotLight(0xffffff)
        // 设置聚光光源位置
        spotLight.position.set(50, 90, 50)
        // 设置聚光光源发散角度
        spotLight.angle = Math.PI / 6
        this.scene.add(spotLight) //光对象添加到scene场景中
        // 设置用于计算阴影的光源对象
        spotLight.castShadow = true
        // 设置计算阴影的区域，注意包裹对象的周围
        spotLight.shadow.camera.near = 1
        spotLight.shadow.camera.far = 300
        spotLight.shadow.camera.fov = 20
    }

    testTreeGroup() {
        // 头部网格模型和组
        var headMesh = sphereMesh(10, 0, 0, 0)
        headMesh.name = '脑壳'
        var leftEyeMesh = sphereMesh(1, 8, 5, 4)
        leftEyeMesh.name = '左眼'
        var rightEyeMesh = sphereMesh(1, 8, 5, -4)
        rightEyeMesh.name = '右眼'
        var headGroup = new THREE.Group()
        headGroup.name = '头部'
        headGroup.add(headMesh, leftEyeMesh, rightEyeMesh)
        // 身体网格模型和组
        var neckMesh = cylinderMesh(3, 10, 0, -15, 0)
        neckMesh.name = '脖子'
        var bodyMesh = cylinderMesh(14, 30, 0, -35, 0)
        bodyMesh.name = '腹部'
        var leftLegMesh = cylinderMesh(4, 60, 0, -80, -7)
        leftLegMesh.name = '左腿'
        var rightLegMesh = cylinderMesh(4, 60, 0, -80, 7)
        rightLegMesh.name = '右腿'
        var legGroup = new THREE.Group()
        legGroup.name = '腿'
        legGroup.add(leftLegMesh, rightLegMesh)
        var bodyGroup = new THREE.Group()
        bodyGroup.name = '身体'
        bodyGroup.add(neckMesh, bodyMesh, legGroup)
        // 人Group
        var personGroup = new THREE.Group()
        personGroup.name = '人'
        personGroup.add(headGroup, bodyGroup)
        personGroup.translateY(50)
        this.scene.add(personGroup)

        // 球体网格模型创建函数
        function sphereMesh(R, x, y, z) {
            var geometry = new THREE.SphereGeometry(R, 25, 25) //球体几何体
            var material = new THREE.MeshPhongMaterial({
                color: 0x0000ff
            }) //材质对象Material
            var mesh = new THREE.Mesh(geometry, material) // 创建网格模型对象
            mesh.position.set(x, y, z)
            return mesh
        }
        // 圆柱体网格模型创建函数
        function cylinderMesh(R, h, x, y, z) {
            var geometry = new THREE.CylinderGeometry(R, R, h, 25, 25) //球体几何体
            var material = new THREE.MeshPhongMaterial({
                color: 0x0000ff
            }) //材质对象Material
            var mesh = new THREE.Mesh(geometry, material) // 创建网格模型对象
            mesh.position.set(x, y, z)
            return mesh
        }

        // 遍历查找对象的子对象，返回name对应的对象（name是可以重名的，返回第一个）
        const nameNodeLeft = this.scene.getObjectByName('左眼')
        const nameNodeRight = this.scene.getObjectByName('右眼')
        nameNodeLeft.material.color.set(0xff0000)
        nameNodeRight.material.color.set(0xff0000)
    }

    // 初始化坐标轴帮助线
    initHelper() {
        const helper = new THREE.AxesHelper(300)
        this.scene.add(helper)
    }

    // 初始化光源
    initLight() {
        // //点光源
        const pointLight = new THREE.PointLight(0xffffff)
        pointLight.position.set(400, 200, 300) //点光源位置
        this.scene.add(pointLight) //点光源添加到场景中
        // //环境光
        const ambientLight = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambientLight)

        // 点光源2  位置和point关于原点对称
        const point2Light = new THREE.PointLight(0xffffff)
        point2Light.position.set(-400, -200, -300) //点光源位置
        this.scene.add(point2Light) //点光源添加到场景中
    }

    // 网格上的物体进行动画
    animationMeshBox(name, fun) {
        if (!name || !fun) return
        fun()
        this.webGL.render(this.scene, this.camera)
        this.animation[name] = requestAnimationFrame(this.animationMeshBox.bind(this, name, fun))
    }

    // 销毁
    destroyed() {}
}
