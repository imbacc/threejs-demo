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
        // this.initBoxMaterialUseMesh()
        // this.initLight()
        // this.testLightPutin()
        // this.testTreeGroup()
        // this.testArcCurve()
        // this.testExtrude()
        this.testTexture()
        // this.testMaterial()
        this.testAnimation()
        // this.testSprite()
        this.testMeshAnimation()
        super.initRender()
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
        this.animationPlay('testMesh', () => {
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

        console.log('本地坐标', mesh4.position)
        this.scene.updateMatrixWorld(true)
        const worldPosition = new THREE.Vector3()
        mesh4.getWorldPosition(worldPosition)
        console.log('世界坐标', worldPosition)

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
        const headMesh = sphereMesh(10, 0, 0, 0)
        headMesh.name = '脑壳'
        const leftEyeMesh = sphereMesh(1, 8, 5, 4)
        leftEyeMesh.name = '左眼'
        const rightEyeMesh = sphereMesh(1, 8, 5, -4)
        rightEyeMesh.name = '右眼'
        const headGroup = new THREE.Group()
        headGroup.name = '头部'
        headGroup.add(headMesh, leftEyeMesh, rightEyeMesh)
        // 身体网格模型和组
        const neckMesh = cylinderMesh(3, 10, 0, -15, 0)
        neckMesh.name = '脖子'
        const bodyMesh = cylinderMesh(14, 30, 0, -35, 0)
        bodyMesh.name = '腹部'
        const leftLegMesh = cylinderMesh(4, 60, 0, -80, -7)
        leftLegMesh.name = '左腿'
        const rightLegMesh = cylinderMesh(4, 60, 0, -80, 7)
        rightLegMesh.name = '右腿'
        const legGroup = new THREE.Group()
        legGroup.name = '腿'
        legGroup.add(leftLegMesh, rightLegMesh)
        const bodyGroup = new THREE.Group()
        bodyGroup.name = '身体'
        bodyGroup.add(neckMesh, bodyMesh, legGroup)
        // 人Group
        const personGroup = new THREE.Group()
        personGroup.name = '人'
        personGroup.add(headGroup, bodyGroup)
        personGroup.translateY(50)
        this.scene.add(personGroup)

        // 球体网格模型创建函数
        function sphereMesh(R, x, y, z) {
            let geometry = new THREE.SphereGeometry(R, 25, 25) //球体几何体
            let material = new THREE.MeshPhongMaterial({
                color: 0x0000ff
            }) //材质对象Material
            let mesh = new THREE.Mesh(geometry, material) // 创建网格模型对象
            mesh.position.set(x, y, z)
            return mesh
        }
        // 圆柱体网格模型创建函数
        function cylinderMesh(R, h, x, y, z) {
            let geometry = new THREE.CylinderGeometry(R, R, h, 25, 25) //球体几何体
            let material = new THREE.MeshPhongMaterial({
                color: 0x0000ff
            }) //材质对象Material
            let mesh = new THREE.Mesh(geometry, material) // 创建网格模型对象
            mesh.position.set(x, y, z)
            return mesh
        }

        // 遍历查找对象的子对象，返回name对应的对象（name是可以重名的，返回第一个）
        const nameNodeLeft = this.scene.getObjectByName('左眼')
        const nameNodeRight = this.scene.getObjectByName('右眼')
        nameNodeLeft.material.color.set(0xff0000)
        nameNodeRight.material.color.set(0xff0000)
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

    // 模型对象进行动画
    animationPlay(name, fun) {
        if (!name || !fun) return
        fun()
        this.webGL.render(this.scene, this.camera)
        this.animation[name] = requestAnimationFrame(this.animationPlay.bind(this, name, fun))
    }

    testArcCurve() {
        // const geometry = new THREE.BufferGeometry() //声明一个几何体对象Geometry
        // //参数：0, 0圆弧坐标原点x，y  100：圆弧半径    0, 2 * Math.PI：圆弧起始角度
        // const arc = new THREE.ArcCurve(0, 0, 100, 0, 2 * Math.PI)
        // //getPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
        // const points = arc.getPoints(50) //分段数50，返回51个顶点
        // // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
        // geometry.setFromPoints(points)
        // //材质对象
        // const material = new THREE.LineBasicMaterial({
        //     color: 0x000000
        // })
        // //线条模型对象
        // const line = new THREE.Line(geometry, material)
        // this.scene.add(line) //线条对象添加到场景中
        // this.animationPlay('test', () => {
        //     line.rotateY(0.01)
        // })

        // let geometry = new THREE.BufferGeometry() //声明一个几何体对象Geometry
        // let R = 100 //圆弧半径
        // let N = 50 //分段数量

        // let vertices = []
        // // 批量生成圆弧上的顶点数据
        // for (let i = 0; i < N; i++) {
        //     let angle = ((2 * Math.PI) / N) * i
        //     let x = R * Math.sin(angle)
        //     let y = R * Math.cos(angle)
        //     vertices.push(x, y, 0)
        //     // geometry.vertices.push(new THREE.Vector3(x, y, 0))
        //     // geometry.attributes.position.setXYZ(i, x, y, 0)
        // }
        // const verticesList = new Float32Array(vertices)
        // geometry.setAttribute('position', new THREE.BufferAttribute(verticesList, 3))
        // console.log('%c [ geometry ]-408', 'font-size:14px; background:#41b883; color:#ffffff;', geometry)
        // // geometry.attributes.position.needsUpdate = true
        // // 插入最后一个点，line渲染模式下，产生闭合效果
        // // geometry.vertices.push(geometry.vertices[0])
        // //材质对象
        // let material = new THREE.LineBasicMaterial({
        //     color: 0x000000
        // })
        // //线条模型对象
        // let line = new THREE.Line(geometry, material)
        // this.scene.add(line) //线条对象添加到场景中
        // this.animationPlay('test', () => {
        //     line.rotateY(0.01)
        // })

        //创建管道成型的路径(3D样条曲线)
        // const path = new THREE.CatmullRomCurve3([
        //     new THREE.Vector3(-10, -50, -50),
        //     new THREE.Vector3(10, 0, 0),
        //     new THREE.Vector3(8, 50, 50),
        //     new THREE.Vector3(-5, 0, 100)
        // ])
        // // path:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
        // const geometry = new THREE.TubeGeometry(path, 40, 2, 25)
        // const material = new THREE.MeshPhongMaterial()
        // const mesh = new THREE.Mesh(geometry, material)
        // this.scene.add(mesh)
        // this.animationPlay('test', () => {
        //     mesh.rotateY(0.01)
        // })

        // /**
        //  * 创建旋转网格模型
        //  */
        // const points = [
        //     new THREE.Vector2(-50, -50),
        //     new THREE.Vector2(-60, 0),
        //     new THREE.Vector2(0, 50),
        //     new THREE.Vector2(60, 0),
        //     new THREE.Vector2(50, -50),
        //     new THREE.Vector2(-50, -50)
        // ]
        // // 通过顶点定义轮廓
        // const shape = new THREE.Shape(points)
        // const R = 50
        // // 四条直线绘制一个矩形轮廓
        // shape.moveTo(0, 0) //起点
        // shape.lineTo(0, 100) //第2点
        // shape.lineTo(100, 100) //第3点
        // shape.lineTo(100, 0) //第4点
        // shape.lineTo(0, 0) //第5点
        // shape.absarc(0, 0, R, 0, Math.PI)
        // //从圆弧的一个端点(-R, 0)到(-R, -200)绘制一条直线
        // shape.lineTo(-R, -200)
        // // 绘制一个半径为R、圆心坐标(0, -200)的半圆弧
        // shape.absarc(0, -200, R, Math.PI, 2 * Math.PI)
        // shape.lineTo(R, 0)

        // //外轮廓
        // shape.arc(0, 0, 100, 0, 2 * Math.PI)
        // // 内轮廓1
        // const path1 = new THREE.Path()
        // path1.arc(0, 0, 40, 0, 2 * Math.PI)
        // // 内轮廓2
        // const path2 = new THREE.Path()
        // path2.arc(80, 0, 10, 0, 2 * Math.PI)
        // // 内轮廓3
        // const path3 = new THREE.Path()
        // path3.arc(-80, 0, 10, 0, 2 * Math.PI)
        // //三个内轮廓分别插入到holes属性中
        // shape.holes.push(path1, path2, path3)

        // // shape可以理解为一个需要填充轮廓
        // // 所谓填充：ShapeGeometry算法利用顶点计算出三角面face3数据填充轮廓
        // const geometry = new THREE.ShapeGeometry(shape, 30)
        // const material = new THREE.MeshPhongMaterial({
        //     color: 0x0000ff, //三角面颜色
        //     side: THREE.DoubleSide //两面可见
        // }) //材质对象
        // material.wireframe = true //线条模式渲染(查看细分数)
        // const mesh = new THREE.Mesh(geometry, material) //旋转网格模型对象
        // this.scene.add(mesh) //旋转网格模型添加到场景中
        // this.animationPlay('test', () => {
        //     mesh.rotateY(0.01)
        // })

        // 河南边界轮廓坐标
        const arr = [
            [110.3906, 34.585],
            [110.8301, 34.6289],
            [110.6543, 34.1455],
            [110.4785, 34.2334],
            [110.3906, 34.585]
        ]
        const points = []
        // 转化为Vector2构成的顶点数组
        arr.forEach((elem) => {
            points.push(new THREE.Vector2(elem[0], elem[1]))
        })
        // 样条曲线生成更多的点
        const SplineCurve = new THREE.SplineCurve(points)
        const shape = new THREE.Shape(SplineCurve.getPoints(300))
        // const shape = new THREE.Shape(points);
        const geometry = new THREE.ExtrudeGeometry(shape)
        geometry.center() //几何体居中
        geometry.scale(30, 30, 30) //几何体缩放
        const material = new THREE.MeshPhongMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide //两面可见
        }) //材质对象
        const mesh = new THREE.Mesh(geometry, material) //网格模型对象
        this.scene.add(mesh)
        this.camera.position.set(20, 50, 50)
        this.animationPlay('d', () => {
            mesh.rotateY(0.01)
        })
    }

    testExtrude() {
        /**
         * 创建扫描网格模型
         */
        const shape = new THREE.Shape()
        /**四条直线绘制一个矩形轮廓*/
        shape.moveTo(0, 0) //起点
        shape.lineTo(0, 10) //第2点
        shape.lineTo(10, 10) //第3点
        shape.lineTo(10, 0) //第4点
        shape.lineTo(0, 0) //第5点
        /**创建轮廓的扫描轨迹(3D样条曲线)*/
        const curve = new THREE.SplineCurve([
            new THREE.Vector3(-10, -50, -50),
            new THREE.Vector3(10, 0, 0),
            new THREE.Vector3(8, 50, 50),
            new THREE.Vector3(-5, 0, 100)
        ])
        const geometry = new THREE.ExtrudeGeometry( //拉伸造型
            shape, //二维轮廓
            //拉伸参数
            {
                bevelEnabled: false, //无倒角
                extrudePath: curve, //选择扫描轨迹
                steps: 50 //扫描方向细分数
            }
        )
        const material = new THREE.MeshPhongMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide //两面可见
        }) //材质对象
        const mesh = new THREE.Mesh(geometry, material)
        this.scene.add(mesh)
        this.camera.position.set(20, 50, 50)
        this.animationPlay('d', () => {
            mesh.rotateY(0.01)
        })
    }

    testTexture() {
        // 纹理贴图映射到一个矩形平面上
        const geometry1 = new THREE.SphereGeometry(40, 40, 40) //矩形平面
        // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
        const textureLoader = new THREE.TextureLoader()
        // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
        textureLoader.load('logo.png', (texture) => {
            const material1 = new THREE.MeshLambertMaterial({
                // color: 0x0000ff,
                side: THREE.DoubleSide, //两面可见
                // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
                map: texture //设置颜色贴图属性值
            }) //材质对象Material
            const mesh1 = new THREE.Mesh(geometry1, material1) //网格模型对象Mesh
            this.scene.add(mesh1) //网格模型添加到场景中
            this.animationPlay('mesh1', () => {
                mesh1.rotateY(0.01)
            })
        })

        // 图片加载器
        const geometry2 = new THREE.BoxGeometry(54, 52, 52) //矩形平面
        const ImageLoader = new THREE.ImageLoader()
        // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
        ImageLoader.load('logo.png', (img) => {
            // image对象作为参数，创建一个纹理对象Texture
            const texture = new THREE.Texture(img)
            // 下次使用纹理时触发更新
            texture.needsUpdate = true
            const material2 = new THREE.MeshLambertMaterial({
                // color: 0x4488ee,
                map: texture //设置纹理贴图
            })

            // material.map = texture
            const mesh2 = new THREE.Mesh(geometry2, material2) //网格模型对象Mesh
            this.scene.add(mesh2) //网格模型添加到场景中
            // this.camera.position.set(20, 50, 50)
            this.animationPlay('d', () => {
                mesh2.rotateY(0.01)
            })
        })
    }

    testMaterial() {
        var geometry = new THREE.BoxGeometry(100, 100, 100) //立方体
        // var geometry = new THREE.PlaneGeometry(204, 102, 4, 4); //矩形平面
        // var geometry = new THREE.SphereGeometry(60, 25, 25); //球体
        // var geometry = new THREE.CylinderGeometry(60, 60, 25,25); //圆柱
        //
        // 材质对象1
        var material_1 = new THREE.MeshPhongMaterial({
            color: 0xffff3f
        })
        var textureLoader = new THREE.TextureLoader() // 纹理加载器
        var texture = textureLoader.load('logo.png') // 加载图片，返回Texture对象
        // 设置阵列模式   默认ClampToEdgeWrapping  RepeatWrapping：阵列  镜像阵列：MirroredRepeatWrapping
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        // uv两个方向纹理重复数量
        texture.repeat.set(2, 2)
        // 不设置重复  偏移范围-1~1
        texture.offset = new THREE.Vector2(0.3, 0.1)
        // 设置纹理旋转角度
        texture.rotation = Math.PI / 4
        // 设置纹理的旋转中心，默认(0,0)
        texture.center.set(0.5, 0.5)
        // 材质对象2
        var material_2 = new THREE.MeshLambertMaterial({
            map: texture // 设置纹理贴图
            // wireframe:true,
        })
        // 设置材质数组
        var materialArr = [material_2, material_2, material_1, material_1, material_2, material_2]

        // 设置数组材质对象作为网格模型材质参数
        var mesh = new THREE.Mesh(geometry, materialArr) //网格模型对象Mesh
        mesh.translateX(120)
        this.scene.add(mesh) //网格模型添加到场景中
        this.camera.position.set(120, 120, 120)
        // this.animationPlay('d', () => {
        //     mesh.rotateY(0.01)
        // })

        /**
         * 创建一个地面
         */
        var geometry2 = new THREE.PlaneGeometry(1000, 1000) //矩形平面
        // 加载树纹理贴图
        var texture2 = new THREE.TextureLoader().load('logo.png')
        // 设置阵列
        texture2.wrapS = THREE.RepeatWrapping
        texture2.wrapT = THREE.RepeatWrapping
        // uv两个方向纹理重复数量
        texture2.repeat.set(10, 10)
        var material2 = new THREE.MeshPhongMaterial({
            // opacity: 0.7,
            transparent: true,
            map: texture2,
            side: THREE.DoubleSide
        })
        var mesh2 = new THREE.Mesh(geometry2, material2) //网格模型对象Mesh
        this.scene.add(mesh2) //网格模型添加到场景中
        mesh2.rotateX(-Math.PI / 2)
    }

    floor() {
        var geometry2 = new THREE.PlaneGeometry(1000, 1000) //矩形平面
        var material2 = new THREE.MeshPhongMaterial({
            transparent: false,
            color: 0xffffff,
            side: THREE.DoubleSide
        })
        var mesh2 = new THREE.Mesh(geometry2, material2) //网格模型对象Mesh
        mesh2.rotateX(-Math.PI / 2)
        this.scene.add(mesh2) //网格模型添加到场景中
    }

    testAnimation() {
        // 圆柱网格模型
        const geometry1 = new THREE.CylinderGeometry(50, 50, 100, 25)
        const material1 = new THREE.MeshLambertMaterial({
            color: 0xffff00
        })
        const mesh1 = new THREE.Mesh(geometry1, material1) //网格模型对象Mesh
        const mesh2 = mesh1.clone()
        mesh2.translateZ(155)
        mesh1.position.set(120, 0, 0) //设置mesh3模型对象的xyz坐标为120,0,0
        this.scene.add(mesh1)
        this.scene.add(mesh2)
        this.mesh.roundMesh1 = mesh1
        this.mesh.roundMesh2 = mesh2

        // ---
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-80, -40, 0),
            new THREE.Vector3(-70, 40, 0),
            new THREE.Vector3(70, 40, 0),
            new THREE.Vector3(80, -40, 0)
        ])
        var tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.6, 50, false)
        var textureLoader = new THREE.TextureLoader()
        var texture = textureLoader.load('logo.png')
        // 设置阵列模式为 RepeatWrapping
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
        //等价texture.repeat= new THREE.Vector2(20,1)
        texture.repeat.x = 20
        texture.repeat.y = 100
        var tubeMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: false
        })
        const mesh3 = new THREE.Mesh(tubeGeometry, tubeMaterial)
        mesh3.translateZ(15)
        mesh3.translateX(41)
        mesh3.translateY(78)
        this.scene.add(mesh3)

        this.floor()

        //
        //创建一个平面几何体作为投影面
        var planeGeometry = new THREE.PlaneGeometry(300, 200)
        var textureLoader = new THREE.TextureLoader()
        // 加载光照贴图
        var textureLight = textureLoader.load('logo.png')
        var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x999999,
            side: THREE.DoubleSide,
            lightMap: textureLight // 设置光照贴图
            // lightMapIntensity:0.5,//烘培光照的强度. 默认 1.
        })
        var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial) //网格模型对象Mesh
        this.scene.add(planeMesh)
    }

    testSprite() {
        var texture = new THREE.TextureLoader().load('logo.png')
        // 创建精灵材质对象SpriteMaterial
        var spriteMaterial = new THREE.SpriteMaterial({
            color: 0xff00ff, //设置精灵矩形区域颜色
            rotation: Math.PI / 4, //旋转精灵对象45度，弧度值
            map: texture //设置精灵纹理贴图
        })
        // 创建精灵模型对象，不需要几何体geometry参数
        var sprite = new THREE.Sprite(spriteMaterial)
        sprite.scale.set(10, 10, 1) //// 只需要设置x、y两个分量就可以
        this.scene.add(sprite)
        // 控制精灵大小，比如可视化中精灵大小表征数据大小

        /**
         * 精灵创建树林效果
         */
        // 加载树纹理贴图
        var textureTree = new THREE.TextureLoader().load('tree.png')
        // 批量创建表示一个树的精灵模型
        for (let i = 0; i < 100; i++) {
            var spriteMaterial = new THREE.SpriteMaterial({
                map: textureTree //设置精灵纹理贴图
            })
            // 创建精灵模型对象
            var sprite2 = new THREE.Sprite(spriteMaterial)
            // 控制精灵大小,
            sprite2.scale.set(100, 100, 1) //// 只需要设置x、y两个分量就可以
            var k1 = Math.random() - 0.5
            var k2 = Math.random() - 0.5
            // 设置精灵模型位置，在xoz平面上随机分布
            sprite2.position.set(1000 * k1, 50, 1000 * k2)
            this.scene.add(sprite2)
        }

        /**
         * 创建一个草地地面
         */
        var geometry = new THREE.PlaneGeometry(1000, 1000) //矩形平面
        // 加载草地纹理贴图
        var texture = new THREE.TextureLoader().load('logo.png')
        // 设置纹理的重复模式
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        // uv两个方向纹理重复数量
        texture.repeat.set(10, 10)
        var material = new THREE.MeshLambertMaterial({
            color: 0x777700
            // map:texture,
        })
        var mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh
        mesh.rotateX(-Math.PI / 2)
        this.scene.add(mesh) //网格模型添加到场景中

        /**
         * 精灵创建下雨效果
         */
        // 加载雨滴理贴图
        var textureTree = new THREE.TextureLoader().load('rain.png')
        // 创建一个组表示所有的雨滴
        var group = new THREE.Group()
        // 批量创建表示雨滴的精灵模型
        for (let i = 0; i < 200; i++) {
            var spriteMaterial = new THREE.SpriteMaterial({
                map: textureTree //设置精灵纹理贴图
            })
            // 创建精灵模型对象
            var sprite = new THREE.Sprite(spriteMaterial)
            // 控制精灵大小,
            sprite.scale.set(8, 10, 1) //// 只需要设置x、y两个分量就可以
            var k1 = Math.random() - 0.5
            var k2 = Math.random() - 0.5
            var k3 = Math.random() - 0.5
            // 设置精灵模型位置，在整个空间上上随机分布
            sprite.position.set(600 * k1, 400 * k3, 800 * k2)
            group.add(sprite)
            // this.scene.add(sprite)
        }
        this.scene.add(group) //雨滴群组插入场景中
        this.animationPlay('rain', () => {
            group.children.forEach((sprite) => {
                var k1 = Math.random() - 0.5
                var k2 = Math.random() - 0.5
                // 设置精灵模型位置，在空间中随机分布
                sprite.position.set(1000 * k1, 300 * Math.random(), 1000 * k2)
                // // 雨滴的y坐标每次减1
                // sprite.position.y -= 2
                // if (sprite.position.y < 0) {
                //     // 如果雨滴落到地面，重置y，从新下落
                //     sprite.position.y = 200
                // }
            })
        })

        const tGroup = new THREE.Group()
        const tMesh1 = this.mesh.roundMesh1.clone()
        const tMesh2 = this.mesh.roundMesh2.clone()
        tMesh1.name = 'roundMesh1'
        tMesh2.name = 'roundMesh2'
        tMesh1.position.set(100, 200, 100)
        tMesh2.position.set(100, 200, -100)
        tGroup.add(tMesh1) //网格模型添加到组中
        tGroup.add(tMesh2) //网格模型添加到组中
        this.scene.add(tGroup)

        /**
         * 编辑group子对象网格模型mesh1和mesh2的帧动画数据
         */
        // 创建名为Box对象的关键帧数据
        var times = [0, 10] //关键帧时间数组，离散的时间点序列
        var values = [0, 0, 0, -150, 0, 0] //与时间点对应的值组成的数组
        // 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0
        var posTrack = new THREE.KeyframeTrack('roundMesh1.position', times, values)
        // 创建颜色关键帧对象：10时刻对应颜色1, 0, 0   20时刻对应颜色0, 0, 1
        var colorKF = new THREE.KeyframeTrack('roundMesh1.material.color', [10, 20], [1, 0, 0, 0, 0, 1])
        // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
        var scaleTrack = new THREE.KeyframeTrack('roundMesh2.scale', [0, 20], [1, 1, 1, 2, 2, 3])

        // duration决定了默认的播放时间，一般取所有帧动画的最大时间
        // duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
        var duration = 20
        // 多个帧动画作为元素创建一个剪辑clip对象，命名"default"，持续时间20
        var clip = new THREE.AnimationClip('default', duration, [posTrack, colorKF, scaleTrack])

        /**
         * 播放编辑好的关键帧数据
         */
        // group作为混合器的参数，可以播放group中所有子对象的帧动画
        var mixer = new THREE.AnimationMixer(tGroup)
        // 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
        var AnimationAction = mixer.clipAction(clip)
        //通过操作Action设置播放方式
        AnimationAction.timeScale = 20 //默认1，可以调节播放速度
        // AnimationAction.loop = THREE.LoopOnce; //不循环播放
        AnimationAction.play() //开始播放

        // 创建一个时钟对象Clock
        var clock = new THREE.Clock()
        this.animationPlay('clock', () => {
            mixer.update(clock.getDelta())
        })
    }

    testMeshAnimation() {
        /**
         * 创建网格模型，并给模型的几何体设置多个变形目标
         */
        // 创建一个几何体具有8个顶点
        var geometry = new THREE.BufferGeometry() //立方体几何对象
        var box1 = new THREE.BoxGeometry(200, 100, 10) //为变形目标1提供数据
        var box2 = new THREE.BoxGeometry(100, 200, 100) //为变形目标2提供数据
        const vertices = new Float32Array([
            25,
            25,
            25, //0
            25,
            25,
            -25, // 1
            25,
            -25,
            25, //2
            25,
            -25,
            -25, //3
            -25,
            25,
            -25, //4
            -25,
            25,
            25, //5
            -25,
            -25,
            -25, //6
            -25,
            -25,
            25 //7
        ])
        var indexes = new Uint16Array([
            0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5,

            4, 5, 1, 5, 0, 1, 7, 6, 2, 6, 3, 2,

            5, 7, 0, 7, 2, 0, 1, 3, 4, 3, 6, 4
        ])
        geometry.attributes.position = new THREE.BufferAttribute(vertices, 3)
        geometry.index = new THREE.BufferAttribute(indexes, 1)
        const arr1 = [200, 100, 100],
            arr2 = [100, 200, 100]
        geometry.morphAttributes.position = [
            new THREE.BufferAttribute(new Float32Array(arr1), 3),
            new THREE.BufferAttribute(new Float32Array(arr2), 3)
        ]
        var material = new THREE.MeshLambertMaterial({
            color: 0x0000ff
        }) //材质对象
        var mesh = new THREE.Mesh(geometry, material) //网格模型对象
        mesh.translateY(111)
        mesh.morphTargetInfluences[0] = 0.5
        // 设置第二组顶点对几何体形状影响的变形系数
        mesh.morphTargetInfluences[1] = 1
        this.scene.add(mesh) //网格模型添加到场景中
        /**
         * 设置关键帧数据
         */
        // 设置变形目标1对应权重随着时间的变化
        var Track1 = new THREE.KeyframeTrack('.morphTargetInfluences[0]', [0, 10, 20], [0, 1, 0])
        // 设置变形目标2对应权重随着时间的变化
        var Track2 = new THREE.KeyframeTrack('.morphTargetInfluences[1]', [20, 30, 40], [0, 1, 0])
        // 创建一个剪辑clip对象，命名"default"，持续时间40
        var clip = new THREE.AnimationClip('default', 40, [Track1, Track2])
        /**
         * 播放编辑好的关键帧数据
         */
        var mixer = new THREE.AnimationMixer(mesh) //创建混合器
        var AnimationAction = mixer.clipAction(clip) //返回动画操作对象
        AnimationAction.timeScale = 5 //默认1，可以调节播放速度
        // AnimationAction.loop = THREE.LoopOnce; //不循环播放
        // AnimationAction.clampWhenFinished=true;//暂停在最后一帧播放的状态
        AnimationAction.play() //开始播放
        // 创建一个时钟对象Clock
        var clock = new THREE.Clock()
        this.animationPlay('boxa', () => {
            mixer.update(clock.getDelta())
        })
    }

    // 销毁
    destroyed() {}
}
