<script setup lang="ts">
import AllKey from "~/components/ui/allKey.vue";
import PixelBlast from "~/components/ui/PixelBlast.vue";
</script>

<template>
    <main class="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden">

        <div class="absolute inset-0">
            <PixelBlast
                variant="circle"
                :pixel-size="6"
                color="#770CAC"
                :pattern-scale="3"
                :pattern-density="1.2"
                :pixel-size-jitter="0.5"
                :enable-ripples="true"
                :ripple-speed="0.4"
                :ripple-thickness="0.12"
                :ripple-intensity-scale="1.5"
                :liquid="false"
                :liquid-strength="0.12"
                :liquid-radius="1.2"
                :liquid-wobble-speed="5"
                :speed="0.6"
                :edge-fade="0.25"
                :transparent="true"
                class="absolute inset-0"
            />

        </div>

        <section class="py-16 md:py-24 lg:py-32 z-10 w-full flex-grow flex items-center">
            <UContainer class="h-full">
                <div class="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16">

                    <div class="w-full md:w-7/12 lg:w-3/5 py-8 text-center md:text-left">

                        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-4 serif-text ">
                            Bienvenido a <br class="hidden sm:block"/>
                            <span class="text-primary-400 dark:text-purple-400">
                                Mi Portafolio
                            </span>
                        </h1>

                        <h2 class="text-2xl sm:text-3xl font-semibold text-gray-200 mb-2 ">
                            Soy Desarrollador de Software
                        </h2>
                        <h3 class="text-lg sm:text-xl font-medium text-gray-400 mb-6">
                            Raúl Antonio de la Cruz Hernández, Ing. En Sistemas Computacionales.
                        </h3>

                        <div class="mt-4 mb-8 flex flex-wrap justify-center md:justify-start gap-3">
                            <span class="animated-shine-badge">
                                +52 993 671 9807
                            </span>
                            <span class="animated-shine-badge">
                                raulantodev@gmail.com
                            </span>
                        </div>

                        <div class="mt-6 flex flex-wrap justify-center md:justify-start items-center gap-4">

                            <UButton to="/portafolio"  color="primary" variant="solid" icon="i-heroicons-home-solid">
                                Inicio
                            </UButton>

                            <UButton to="/proyectos"  color="neutral" variant="solid" class="relative group overflow-hidden">
                                <div class='absolute inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-primary-400 to-primary-600 opacity-20 blur-sm group-hover:opacity-40 transition-opacity' />
                                Proyectos
                            </UButton>

                            <UButton to="/servicios"  color="primary" variant="soft">
                                Servicios Free lancer
                            </UButton>

                        </div>

                    </div>

                    <div class="w-full md:w-5/12 lg:w-2/5 py-8 flex justify-center md:justify-end">
                        <all-key class="w-full max-w-sm" />
                    </div>

                </div>
            </UContainer>
        </section>
    </main>
</template>

<style  scoped>
/* Se centraliza el estilo del badge de contacto en una sola clase
    para mantener el template limpio.
*/


.animated-shine-badge:hover {
    transform: translateY(-2px);
}
</style>