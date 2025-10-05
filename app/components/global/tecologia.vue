<script setup lang="ts">
import Carrusel from "~/components/global/carrusel.vue";
import Proyectos from "~/components/global/proyectos.vue";
import RotatingText from "~/components/ui/RotatingText.vue";

const tecnop = [
    "git", "js", "html", "css", "kubernetes", "python", "docker", "c", "vue", "git", "java", "nuxt", "django", "mysql", "figma", "npm", "pinia", "mongodb", "angular", "postgresql",
]
</script>

<template>
    <div class="relative overflow-hidden dark:bg-neutral-950 mb-32 min-h-screen">

        <!-- Blur gradient -->
        <div class="absolute m-auto blur-[160px] max-w-s h-[13rem] top-12 inset-x-0 z-10"
             style="background:linear-gradient(180deg, rgba(62,146,250,0.26) 0%, rgba(62,146,250,0.11) 0.01%, rgba(62,146,250,0.45) 100%)">
        </div>

        <!-- Contenido principal -->
        <div id="proyectos" class="relative pt-20 px-4">

            <!-- Contenedor del texto con carruseles de fondo -->
            <div class="relative mb-16">
                <!-- Carruseles de fondo detrás del texto -->
                <div class="absolute inset-0 flex flex-col justify-center gap-2 opacity-10 z-0">
                    <carrusel :icons="tecnop"/>
                    <carrusel :icons="tecnop" direction="right"/>
                    <carrusel :icons="tecnop"/>
                </div>

                <!-- Texto del encabezado -->
                <div class="relative z-10 text-center py-12">
                    <span
                        class="inline-block px-3 py-1 text-sm font-semibold dark:text-neutral-900 bg-primary-100 rounded-full mb-4">Proyectos</span>
                    <h2 class="text-4xl font-bold serif-text sm:text-5xl">Diferentes Proyectos con diferentes
                        tecnologías</h2>
                    <div class="flex justify-center items-center mt-3 gap-2 transition-all duration-1000 ease-in-out">


                        <h3 class="font-black text-4xl transform-stroke ">
                            Creatividad con
                        </h3>
                        <RotatingText
                            :texts="['Vue', 'Angular', 'Django', 'Flutter', 'Nuxt', 'Flask', 'NodeJS']"
                            mainClassName="px-2 sm:px-2 md:px-3 bg-primary-600 text-4xl text-neutral-50 font-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-md"
                            staggerFrom="last"
                            :initial="{ y: '100%' }"
                            :animate="{ y: 0 }"
                            :exit="{ y: '-120%' }"
                            :staggerDuration="0.025"
                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                            :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
                            :rotationInterval="2000"
                        />
                    </div>
                </div>
            </div>

            <!-- Proyectos -->
            <UContainer>
                <proyectos/>
            </UContainer>

        </div>

    </div>
</template>

<style scoped>
.smooth-move {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.smooth-move h3 {
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>