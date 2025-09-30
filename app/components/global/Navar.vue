<script lang="ts" setup>
import {useRoute} from 'vue-router';

const route = useRoute();

</script>

<template>

    <header
        class="fixed inset-x-0 top-0 z-500 mx-auto w-full
         max-w-screen-md border border-neutral-100 dark:border-neutral-900 dark:bg-neutral-950/80 dark:backdrop-blur-lg bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
        <div class="px-4">
            <div class="flex items-center justify-between">
                <div class="flex shrink-0">
                    <NuxtLink class="flex items-center" to="/">
                        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">rauanto</span>
                        <p class="self-center text-xl font-semibold whitespace-nowrap bg-gradient-to-br from-violet-200 via-blue-700 to-blue-50 bg-clip-text text-transparent">
                            dev
                        </p>
                    </NuxtLink>
                </div>
                <div class="hidden md:flex md:items-center md:justify-center justify-center items-center md:gap-5">

                    <NuxtLink class="btn-blan">Portafolio</NuxtLink>
                    <NuxtLink to="/perfil/" class="btn-blan">Quien soy?</NuxtLink>
                    <a class="btn-blan" href="#blog">Blog</a>
                    <NuxtLink class="btn-blan">Zona de juego</NuxtLink>

                </div>
                <div class="flex items-center justify-end gap-3">

                    <ColorModeButton/>
                </div>
            </div>
        </div>
    </header>
</template>



<style scoped>

</style>