<script lang="ts" setup>
import {computed} from 'vue';
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
                        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">  rauanto</span>
                        <spam class="self-center text-xl font-semibold whitespace-nowrap bg-gradient-to-br from-violet-200 via-blue-700 to-blue-50 bg-clip-text text-transparent">
                            dev
                        </spam>
                    </NuxtLink>
                </div>
                <div class="hidden md:flex md:items-center md:justify-center md:gap-5">
<!--                    <a aria-current="page"-->
<!--                       class="inline-block rounded-lg px-2 py-1 text-sm font-medium text-slate-950 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"-->
<!--                       href="#">How it works</a>-->
                    <NuxtLink class="btn-blan"
                       >Portafolio</NuxtLink>
                    <NuxtLink class="btn-blan"
                       >Quien soy?</NuxtLink>

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