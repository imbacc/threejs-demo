<script setup>
    import { shallowRef, defineAsyncComponent } from 'vue'
    const compList = import.meta.glob('./components/**/*.vue')
    console.log('%c [ compList ]-7', 'font-size:14px; background:#41b883; color:#ffffff;', compList)

    const first = 'demo4'
    const demoResolve = shallowRef({})
    const comp = shallowRef(null)

    const asyncCompList = async () => {
        let keys = Object.keys(compList)
        for (const key of keys) {
            let name = key.replace('./components/', '').replace('/index.vue', '')
            console.log('%c [ name ]-13', 'font-size:14px; background:#41b883; color:#ffffff;', name)
            demoResolve[name] = defineAsyncComponent(() => compList[key]())
            // let value = await compList[key]()
            // demoResolve[name] = value.default
        }

        comp.value = demoResolve[first]
        // comp.value = defineAsyncComponent(() => compList[keys[0]])
        console.log('%c [ comp ]-18', 'font-size:14px; background:#41b883; color:#ffffff;', comp)

        forDemo(keys)
    }

    const forDemo = (keys) => {
        for (let i = 1, j = keys.length; i <= j; i++) {
            const a = document.createElement('a')
            a.setAttribute('href', 'javascript:;')
            a.style.marginRight = '30px'
            a.innerText = `切换demo${i}`
            a.addEventListener('click', () => {
                let name = keys[i].replace('./components/', '').replace('/index.vue', '')
                comp.value = demoResolve[name]
            })
            document.querySelector('#app').appendChild(a)
        }
    }

    asyncCompList()
</script>

<template>
    <suspense>
        <template #default>
            <component :is="comp" />
        </template>
        <template #fallback>
            <div>Loading !...</div>
        </template>
    </suspense>
</template>
