<script setup lang="ts">

import Particulas from "~/components/ui/animate/particulas.vue";
</script>

<template>
    <div class=" w-full h-screen grid-background fondo">
        <div class="absolute h-full w-full ">
            <div class="absolute bottom-0 left-0 right-0 top-0
            bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]
            [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">

            </div>
        </div>
        <!-- Capa de fondo -->
        <div class="absolute z-0 fondo">
            <particulas/>
        </div>
        <UContainer>
            <div class="relative z-10 w-full h-full ">
                <section class="w-full h-full">
                    <div
                        class="py-8 px-4 mx-auto min-h-screen text-center lg:py-16 lg:px-12 flex flex-col flex-grow justify-center items-center">
                        <a href="#proyectos"
                           class="animated-gradient-border inline-flex justify-between dark:border-white bg-neutral-50  items-center py-1 px-1 pr-4 mb-7 text-sm rounded-full text-white dark:text-neutral-950"
                           role="alert">
                            <span class="text-xs bg-primary dark:text-neutral-950 rounded-full text-white px-4 py-1.5 mr-3">Nuevo</span>
                            <span class="text-sm text-neutral-950 font-medium">Creando Proyectos y Soluciones.</span>
                            <svg class="ml-2 w-5 h-5 fill-neutral-950" fill="" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </a>
                        <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-white serif-text">
                            Creando el futuro web, una línea de código a la vez</h1>
                        <p class="mb-8 text-lg font-normal  lg:text-xl sm:px-16 xl:px-48 ">Transformo conceptos en
                            aplicaciones web completas.</p>
                        <div class=" w-full h-px max-w-6xl mx-auto mb-4"
                             style="background-image: linear-gradient(90deg, rgba(149, 131, 198, 0) 1.46%, rgba(5,76,245,0.26) 40.83%, rgba(75,149,255,0.46) 65.57%, rgba(149, 131, 198, 0) 107.92%);">
                        </div>

                        <div
                            class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                            <a  class="group inline-flex items-center
                            justify-center rounded-full py-2 px-4 text-sm font-semibold
                            focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2
                            bg-neutral-900 text-white hover:bg-neutral-700 hover:text-slate-100
                            active:bg-neutral-800 active:text-neutral-300 focus-visible:outline-neutral-900 animate-fade-in-left
                            dark:bg-primary dark:text-neutral-950 dark:hover:bg-primary-400"
                               href="#contacto">
                                <span class="">Contacto</span>
                            </a>
                            <div class="relative flex flex-1 flex-col items-stretch sm:flex-none" data-headlessui-state="">
                                <button class="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none ring-slate-200 text-slate-700 dark:text-white hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300 animate-fade-in-right" id="headlessui-menu-button-:r4:" aria-haspopup="true" aria-expanded="false" data-headlessui-state="" type="button">
                                   <span class="">Sobre mi</span>
                                </button>
                            </div>
                        </div>

                    </div>

                </section>

            </div>

        </UContainer>
    </div>
</template>

<style scoped>
.fondo {
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(62, 146, 250, 0.59), transparent 70%);
}
/* Clase para el borde gradiente animado */
.animated-gradient-border {
    position: relative;
    overflow: hidden;
}

.animated-gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: linear-gradient(90deg,
    #1e3a8a 0%,
    #3b82f6 25%,
    #60a5fa 50%,
    #93c5fd 75%,
    #1e3a8a 100%
    );
    background-size: 200% 100%;
    border-radius: inherit;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    animation: gradient-border-move 2s linear infinite;
    z-index: -1;
}

@keyframes gradient-border-move {
    0% {
        background-position: 100% 0;
    }
    100% {
        background-position: -100% 0;
    }
}

/* Efecto hover opcional */
.animated-gradient-border {
    animation-duration: 1s;
}

.animated-gradient-border {
    transform: translateY(-1px);
    transition: transform 0.2s ease;
}
</style>


