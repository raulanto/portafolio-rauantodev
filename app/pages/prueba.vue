<script setup lang="ts">

import AllKey from "~/components/ui/allKey.vue";
</script>

<template>
    <main class="h-screen w-full relative flex flex-col justify-center items-center gap-2">
        <section class="py-8 z-10 ">
            <div class="flex flex-col md:flex-row items-center max-w-6xl px-6 py-8 mx-auto">
                <div class="w-full md:w-1/2 py-8">
                    <h1 class=" text-3xl font-semibold leading-none tracking-tighter serif-text">
                        Bienvenido a <br><span class="text-blue-500">Mi Portafolio, <br></span> Soy Desarrollador
                        Web.<br/>

                    </h1>
                    <p> python | django | vue | nuxt | flask | fastapi | nodejs | go | angular | laravel | sql</p>
                    <UButton class="mt-3">
                        Entrar
                    </UButton>
                </div>
                <div class="w-full md:w-1/2 py-8">
                    <all-key class="0"/>
                </div>
            </div>
        </section>
    </main>


</template>

<style scoped>

</style>