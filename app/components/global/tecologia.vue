<script setup lang="ts">
import { ref } from 'vue';
import RotatingText from "~/components/ui/RotatingText.vue";
import CardTilt from "~/components/ui/CardTilt.vue";
import list from '~/utils/proyectos';
import PostCard from "~/components/global/card/postCard.vue";

const tecnop = [
    "git", "js", "html", "css", "kubernetes", "python", "docker", "c", "vue",
    "java", "nuxt", "django", "mysql", "figma", "npm", "pinia",
    "mongodb", "angular", "postgresql", "ts"
];
</script>

<template>
    <section class="w-full bg-[#0a0a0a] text-white border-t border-white/5 relative z-10 selection:bg-purple-500 selection:text-white overflow-hidden py-24 sm:py-32 midnight-mist-bg">

        <div class="max-w-screen-2xl mx-auto p-8 lg:p-12 xl:p-16">
            
            <div class="flex flex-col md:flex-row items-center justify-between gap-12 text-left w-full mb-24 relative z-20">
                
                <!-- Columna Izquierda: Textos -->
                <div class="flex flex-col gap-6 md:w-1/2">
                    <div class="flex flex-col gap-2">
                        <span class="text-sm font-medium text-gray-500 tracking-widest uppercase">Portafolio</span>
                        <h2 class="serif-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                            Proyectos.
                        </h2>
                    </div>
                    
                    <div class="flex items-center gap-2 flex-wrap bg-white/5 border border-white/10 px-6 py-3 rounded-full w-fit backdrop-blur-sm shadow-xl">
                        <span class="text-lg text-gray-400 font-light">Especializado en</span>
                        <RotatingText
                            :texts="['Vue', 'Angular', 'Django', 'Laravel', 'Nuxt', 'Flask', 'NodeJS', 'Go']"
                            mainClassName="text-lg text-white font-semibold"
                            staggerFrom="last"
                            :initial="{ y: '100%', opacity: 0 }"
                            :animate="{ y: 0, opacity: 1 }"
                            :exit="{ y: '-120%', opacity: 0 }"
                            :staggerDuration="0.025"
                            :transition="{ type: 'spring', damping: 25, stiffness: 300 }"
                            :rotationInterval="2500"
                        />
                    </div>
                </div>
                
                <!-- Columna Derecha: CardTilt -->
                <div class="md:w-1/2 flex justify-center md:justify-end">
                    <div class="relative group">
                        <!-- Glow decorativo que reacciona al hover -->
                        <div class="absolute -inset-8 bg-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <div class="relative z-10 transform hover:scale-105 transition-transform duration-500">
                            <CardTilt />
                        </div>
                    </div>
                </div>
                
            </div>

            <!-- Grilla de tecnologías formal y minimalista -->
            <div class="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-24 opacity-70 hover:opacity-100 transition-opacity duration-500 max-w-4xl mx-auto px-4">
                <img
                    v-for="icon in tecnop"
                    :key="`tech-${icon}`"
                    :src="`https://skillicons.dev/icons?i=${icon}`"
                    :alt="`${icon} icon`"
                    class="h-10 w-10 md:h-12 md:w-12 object-contain grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300"
                />
            </div>

            <!-- SECCIÓN PROYECTOS -->
            <div class="relative z-30 w-full max-w-5xl mx-auto">
                <div class="flex flex-col items-center gap-12">
                    
                    <!-- Contenedor premium para la PostCard -->

                            <PostCard :post="list[0]" />
    
                    <div class="pt-8">
                        <UButton
                            to="/proyectos/"
                            size="xl"
                            color="white"
                            variant="solid"
                            class="flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-full text-sm sm:text-base font-bold hover:bg-gray-200 transition-all w-fit group"
                        >
                            Ver todos los proyectos
                            <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </UButton>
                    </div>

                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
.midnight-mist-bg {
    background: radial-gradient(circle at 50% 100%,
        rgba(109, 40, 217, 0.25) 0%,
        rgba(76, 29, 149, 0.15) 30%,
        rgba(10, 10, 10, 0.9) 60%,
        rgb(10, 10, 10) 100%
    );
    background-attachment: fixed;
    background-size: cover;
}
</style>