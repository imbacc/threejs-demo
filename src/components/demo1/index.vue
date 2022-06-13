<script setup>
    import threejsMap from './threejsMap.js'
    import { ref, onMounted, onUnmounted } from 'vue'

    const map = ref(null)

    onMounted(() => {
        map.value = new threejsMap()
    })

    onUnmounted(() => {
        map.value.destroyedWebGL()
        map.value = null
    })
</script>

<template>
    <div>demo1</div>
</template>
