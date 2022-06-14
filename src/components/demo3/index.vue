<script setup>
    import threejsMap from './threejsMap.js'
    import threejsBox from './threejsBox.js'
    import threejsLightBar from './threejsLightBar.js'
    import { ref, onMounted, onUnmounted } from 'vue'

    const lightBarData = [
        { name: '北京市', value: 100 },
        { name: '山东省', value: 80 },
        { name: '海南省', value: 100 },
        { name: '四川省', value: 100 },
        { name: '台湾', value: 70 },
        { name: '黑龙江省', value: 80 },
        { name: '湖北省', value: 70 },
        { name: '内蒙古自治区', value: 50 },
        { name: '西藏自治区', value: 50 },
        { name: '新疆维吾尔自治区', value: 63 },
        { name: '甘肃省', value: 63 },
        { name: '山西省', value: 83 },
        { name: '上海市', value: 73 },
        { name: '福建省', value: 63 },
        { name: '广东省', value: 53 },
        { name: '云南省', value: 43 },
        { name: '辽宁省', value: 63 },
        { name: '青海省', value: 90 }
    ]

    const flyDatas = [
        { source: { name: '海南省' }, target: { name: '四川省' } },
        { source: { name: '北京市' }, target: { name: '四川省' } },
        { source: { name: '山东省' }, target: { name: '四川省' } },
        { source: { name: '台湾' }, target: { name: '四川省' } },
        { source: { name: '黑龙江省' }, target: { name: '四川省' } },
        { source: { name: '湖北省' }, target: { name: '四川省' } },
        { source: { name: '内蒙古自治区' }, target: { name: '四川省' } },
        { source: { name: '西藏自治区' }, target: { name: '四川省' } },
        { source: { name: '新疆维吾尔自治区' }, target: { name: '四川省' } },
        { source: { name: '青海省' }, target: { name: '四川省' } }
    ]

    const map = new threejsMap()
    // const box = new threejsBox()
    // const light = new threejsLightBar()

    onMounted(() => {
        fetch('/china.json')
            .then((res) => res.json())
            .then((res) => {
                map.initMap(res)
                // light.setVector3Json(map.vector3Json)
                // light.drawLightBar(lightBarData)
                // light.drawFlyLine(flyDatas)
            })
    })

    onUnmounted(() => {
        // webg.destroyed()
    })
</script>

<template>
    <div>demo3</div>
</template>
