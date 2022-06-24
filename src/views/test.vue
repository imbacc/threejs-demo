<script setup>
    const seelp = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('1111111111', 1111111111)
                resolve()
            }, 2000)
        })
    }

    const data = await seelp()
</script>

<template>
    <div>
        <div>11111111111111</div>
    </div>
</template>
