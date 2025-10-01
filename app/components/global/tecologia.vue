<script setup lang="ts">

import Carrusel from "~/components/global/carrusel.vue";
import Proyectos from "~/components/global/proyectos.vue";
const tecnop = [
    "git", "js", "html", "css", "kubernetes", "python", "docker", "c", "vue", "git", "java", "nuxt", "django", "mysql", "figma", "npm", "pinia", "mongodb", "angular", "postgresql",
]
</script>

<template>
    <div  class="relative overflow-hidden dark:bg-neutral-950 mb-32 min-h-screen">

        <!-- Imagen de fondo -->


        <!-- Blur gradient -->
        <div class="absolute m-auto blur-[160px] max-w-s h-[13rem] top-12 inset-0 z-10"
             style="background:linear-gradient(180deg, rgba(62,146,250,0.49) 0%, rgba(62,146,250,0.49) 0.01%, rgba(62,146,250,0.45) 100%)">
        </div>

        <!-- Carruseles de fondo -->
        <div class="absolute inset-0 flex flex-col justify-center space-y-8 opacity-10 z-20">
            <carrusel :icons="tecnop"/>
            <carrusel :icons="tecnop" direction="right"/>
            <carrusel :icons="tecnop"/>
        </div>

        <!-- Contenido principal -->
        <div id="proyectos"  class="relative z-30 flex flex-col justify-center items-center h-full text-center px-4 mt-90">
            <div class="text-center mb-16 mt-50">
                <span class="inline-block px-3 py-1 text-sm font-semibold dark:text-neutral-900 bg-primary-100 rounded-full mb-4">Proyectos</span>
                <h2 class="text-4xl font-bold serif-text sm:text-5xl">Diferentes Proyectos con diferentes tecnologías</h2>

            </div>
            <UContainer>
                <proyectos/>
            </UContainer>

        </div>

    </div>
</template>


<style scoped>

</style>