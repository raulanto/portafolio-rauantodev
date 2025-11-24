<script setup lang="ts">
import AllKey from "~/components/ui/allKey.vue";
import Particles from "~/components/ui/Particles.vue";
import ShinyText from "~/components/ui/ShinyText.vue";
import CarruselCardSt from "~/components/ui/carruselCardSt.vue";
</script>

<template>

    <div  class="relative w-full min-h-screen overflow-hidden grid-background fondo">

<!--        <carrusel-card-st-->
<!--            class="hidden md:block sm:block lg:block xl:block"-->
<!--        />-->
        <!-- Grid Background -->
        <div class="absolute h-full w-full">
            <div class="absolute bottom-0 left-0 right-0 top-0
            bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]
            [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
            </div>

            <Particles

                :particle-count="200"
                :particle-spread="10"
                :speed="0.1"
                :particle-colors="['#ffffff']"
                :move-particles-on-hover="false"
                :particle-hover-factor="1"
                :alpha-particles="false"
                :particle-base-size="100"
                :size-randomness="1"
                :camera-distance="20"
                :disable-rotation="false"
                class="w-full h-full "
            />
        </div>

        <UContainer class="h-full">
            <div class="relative z-10 w-full min-h-screen flex items-center py-12 md:py-16 lg:py-20">
                <section class="w-full">
                    <div class="px-4 sm:px-6 lg:px-8 mx-auto w-full text-center flex flex-col items-center">
                        <!-- Badge -->
                        <a href="#proyectos"
                           class="animated-gradient-border inline-flex justify-between dark:border-white bg-neutral-50 items-center py-1 px-1 pr-3 sm:pr-4 mb-6 sm:mb-7 text-xs sm:text-sm rounded-full text-white dark:text-neutral-950 max-w-full"
                           role="alert">
                            <span class="text-xs bg-primary dark:text-neutral-950 rounded-full text-white px-3 sm:px-4 py-1 sm:py-1.5 mr-2 sm:mr-3 whitespace-nowrap">
                                Nuevo
                            </span>
                            <span class="text-xs sm:text-sm text-neutral-950 font-medium truncate">
                                Creando Proyectos y Soluciones.
                            </span>
                            <svg class="ml-2 w-4 h-4 sm:w-5 sm:h-5 fill-neutral-950 flex-shrink-0" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </a>

                        <!-- Heading -->
                        <h1 class="mb-4 sm:mb-6 mix-blend-multiply  text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 font-extrabold tracking-tight leading-tight dark:text-white serif-text px-2 sm:px-4 ">
                            Creando el futuro web, una línea de código a la vez
                        </h1>

                        <!-- Description -->
                        <p class="">
                            <ShinyText
                                text="Transformo conceptos en aplicaciones web completas."
                                :disabled="false"
                                :speed="3"
                                class-name="mb-6 sm:mb-8 mix-blend-multiply  text-base sm:text-lg lg:text-xl font-normal max-w-3xl px-4 sm:px-8 md:px-16 "
                            />

                        </p>
                        <!-- Buttons -->
                        <div class="flex w-full justify-center items-center gap-2">

                            <UButton class="w-fit block" to="#contacto" color="primary">Contacto</UButton>
                            <UButton to="#about" class="w-fit block" color="neutral" variant="outline">Sobre mi</UButton>
                        </div>

                        <!-- AllKey Component -->
                        <div class="w-full flex justify-center items-center mt-4 sm:mt-8 lg:mt-12 overflow-hidden">
                            <all-key class="scale-75 sm:scale-90 md:scale-100" />
                        </div>
                    </div>
                </section>
            </div>
        </UContainer>
    </div>
</template>

<style scoped>
.fondo {
    background: radial-gradient(ellipse 85% 90% at 50% 0%, rgba(129, 25, 255, 0.57), transparent 70%);
}

/* Animated gradient border */
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
    #771dd8 0%,
    #8635de 25%,
    #5709a9 50%,
    #c08df3 75%,
    #9240ea 100%
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

.animated-gradient-border:hover {
    transform: translateY(-1px);
}

.animated-gradient-border {
    transition: transform 0.2s ease;
}

/* Ensure text doesn't break awkwardly */
h1 {
    word-wrap: break-word;
    overflow-wrap: break-word;
}

/* Smooth transitions for responsive changes */
* {
    transition-property: padding, margin, font-size;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
}

/* Additional mobile optimizations */
@media (max-width: 640px) {
    .serif-text {
        line-height: 1.2;
    }
}

@media (min-width: 641px) and (max-width: 768px) {
    .serif-text {
        line-height: 1.3;
    }
}
</style>