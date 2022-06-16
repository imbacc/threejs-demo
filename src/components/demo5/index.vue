<script setup>
    import threejsMap from './threejsMap'
    const map = new threejsMap()
    fetch('china.json')
        .then((res) => res.json())
        .then((res) => {
            console.log('%c [ res ]-11', 'font-size:14px; background:#41b883; color:#ffffff;', res)
            map.initMap(res)
        })
</script>

<template>
    <div>demo5</div>
</template>
