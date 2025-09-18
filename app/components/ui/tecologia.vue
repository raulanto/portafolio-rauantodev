<script setup lang="ts">

import Carrusel from "~/components/global/carrusel.vue";
const tecnop = [
    "git", "js", "html", "css", "kubernetes", "python", "docker", "c", "vue", "git", "java", "nuxt", "django", "mysql", "figma", "npm", "pinia", "mongodb", "angular", "postgresql",
]
</script>

<template>
    <div id="proyectos" class="relative overflow-hidden dark:bg-neutral-950 mb-32 min-h-screen">

        <!-- Imagen de fondo -->
        <img src="https://i.ibb.co/8D7rcYv/download.webp" width="2880" height="1358" decoding="async" data-nimg="1" class="w-full h-full object-cover m-auto absolute inset-0 pointer-events-none z-0" loading="lazy" style="color:transparent">

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
        <div  class="relative z-30 flex flex-col justify-center items-center h-full text-center px-4 mt-50">
            <div class="text-center mb-16">
                <span class="inline-block px-3 py-1 text-sm font-semibold dark:text-neutral-900 bg-primary-100 rounded-full mb-4">Proyectos</span>
                <h2 class="text-4xl font-bold serif-text sm:text-5xl">Diferentes Proyecctos con diferentes tecnologias</h2>
<!--                <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-600 serif">-->
<!--                    Powerful features to boost your productivity and workflow.-->
<!--                </p>-->
            </div>
            <UContainer>
                <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 place-items-center justify-items-center-safe">
                    <!-- Project 1 -->
                    <div class="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ">
                        <div class="h-64 overflow-hidden">
                            <img src="@/assets/img/grad2.png" alt="UI Design Project" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div class="absolute inset-0 flex items-end bg-gradient-to-t from-gray-900 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-90">
                            <div class="translate-y-8 transform transition-transform duration-300 group-hover:translate-y-0">
                                <h3 class="text-2xl font-bold text-white">Modern UI Design</h3>
                                <p class="mt-2 text-gray-300">Clean, minimalist interface design for a SaaS application.</p>
                                <div class="mt-4 flex space-x-2">
                                    <span class="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">UI/UX</span>
                                    <span class="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">Figma</span>
                                </div>
                                <a href="#" class="mt-4 inline-flex items-center text-white transition-colors hover:text-blue-300">
                                    View Project
                                    <i class="fas fa-arrow-right ml-2"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </UContainer>

        </div>

    </div>
</template>


<style scoped>

</style>