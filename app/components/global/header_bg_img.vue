<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const route = useRoute()
const items = computed<NavigationMenuItem[]>(() => [
    { label: 'Proyectos', to: '#proyectos' },
    { label: 'Contacto', to: '#contacto' },
    { label: 'Blog', to: '#blog' },
    { label: 'Cv', to: '/perfil/cv' },
    { label: 'Servicios Freelancer', to: '/servicios' },
    { label: '+52 993 671 9807' },
    {
        label: 'Linkedin',
        to: 'https://www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185/',
        target: '_blank'
    }
])
</script>

<template>
    <div class="relative w-full min-h-screen overflow-hidden fondo font-sans text-white selection:bg-purple-500 selection:text-white">

        <!-- NAVBAR -->
        <LazyNavar :items="items" class="relative z-50" />

        <!-- FONDO ORIGINAL (Restaurado) -->
        <div class="absolute inset-0 pointer-events-none">
            <img src="../../assets/img/G6cOUTsaAAATWlY.jpeg"
                 alt="Fondo Abstracto"
                 class="absolute inset-0 h-full w-full object-cover opacity-50 transition-opacity duration-500"
                 height="2304"
                 width="4096"
            />
            <div class="absolute inset-0
            bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]
            [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
            </div>
            <div class="absolute inset-0 bg-black/30"></div>
        </div>

        <!-- CONTENIDO PRINCIPAL (Estilo Moderno Minimalista) -->
        <UContainer class="relative z-20 h-full flex flex-col justify-center min-h-screen">
            <div class="w-full flex flex-col items-center justify-center py-12 md:py-24 lg:py-32">

                <section class="w-full max-w-5xl text-center flex flex-col items-center">

                    <!-- BADGE: Pill Glassmorphism -->
                    <a href="#proyectos"
                       class="group relative inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-md cursor-pointer overflow-hidden shadow-lg"
                       role="alert">

                        <!-- Efecto de brillo al pasar el mouse -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

                        <span class="relative flex h-2 w-2">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>

                        <span class="text-gray-100 font-medium tracking-wide shadow-black drop-shadow-sm">
                            <span class="font-semibold text-white mr-1">Nuevo:</span> Creando Proyectos y Soluciones
                        </span>

                        <svg class="w-4 h-4 text-gray-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>

                    <!-- HEADING: Moderno, Grande y Limpio -->
                    <h1 class=" serif-text mb-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-lg">
                        Creando el
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-violet-400 to-purple-800 animate-gradient">
                            futuro web
                        </span>
                        <br class="hidden md:block" />
                        <span class="text-gray-300 font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2 block">
                            una línea a la vez.
                        </span>
                    </h1>

                    <!-- DESCRIPCIÓN -->
                    <p class="max-w-2xl text-lg text-gray-200 mb-10 leading-relaxed font-light drop-shadow-md">
                        Desarrollo experiencias digitales inmersivas, escalables y centradas en el usuario utilizando las tecnologías más modernas del ecosistema.
                    </p>

                    <!-- BOTONES: Minimalistas -->
                    <div class="flex flex-col sm:flex-row w-full justify-center items-center gap-4 sm:gap-6">
                        <UButton
                            to="#contacto"

                            class="rounded-full px-8 py-4 font-semibold bg-white text-black hover:bg-gray-200 transition-all w-full sm:w-auto justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] border-none"
                        >
                            Contáctame
                        </UButton>

                        <UButton
                            to="#about"
                            variant="ghost"
                            class="rounded-full px-8 py-4 font-semibold text-white hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all w-full sm:w-auto justify-center backdrop-blur-sm"
                            icon="i-heroicons-arrow-down-circle"
                        >
                            Sobre mí
                        </UButton>
                    </div>
                </section>
            </div>
        </UContainer>
    </div>
</template>

<style scoped>
/* ESTILO DEL FONDO ORIGINAL */
.fondo {
    background: radial-gradient(ellipse 85% 90% at 50% 0%, rgba(129, 25, 255, 0.57), transparent 70%);
}

/* Animación suave para el gradiente del texto */
@keyframes gradient-x {
    0%, 100% {
        background-size: 200% 200%;
        background-position: left center;
    }
    50% {
        background-size: 200% 200%;
        background-position: right center;
    }
}

.animate-gradient {
    animation: gradient-x 3s ease infinite;
}

/* Ajustes finos de tipografía para móviles */
h1 {
    font-feature-settings: "ss01", "ss02", "cv01", "cv02";
}
</style>