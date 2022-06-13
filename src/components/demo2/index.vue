<script setup>
import threejsMap from './threejsMap.js'
import { ref, onMounted, onUnmounted } from 'vue'

const map = ref(null)

onMounted(() => {
    map.value = new threejsMap()

    fetch('/map/china.json').then((res) => res.json()).then((res) => {
        console.log('%c [ res ]-11', 'font-size:14px; background:#41b883; color:#ffffff;', res)
    })
})

onUnmounted(() => {
    map.value.destroyedWebGL()
    map.value = null
})
</script>

<template>
    <div>demo2</div>
</template>