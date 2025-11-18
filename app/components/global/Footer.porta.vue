<script setup lang="ts">

import PixelBlast from "~/components/ui/PixelBlast.vue";
import CarruselCardSt from "~/components/ui/carruselCardSt.vue";

</script>

<template>
    <footer class="relative text-white pt-16 pb-8 px-6 md:px-8 z-50 bg-neutral-950">
        <div class="max-w-7xl mx-auto z-40">
            <div class="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-y-12 md:gap-x-8">
                <div class="md:col-span-4 lg:col-span-6 max-w-md">
                    <h3 class="text-2xl font-bold mb-6">
                        Estoy listo Para colaborar contigo.
                    </h3>
                    <div class="mt-4 space-y-4">
                        <carrusel-card-st
                            class="sticky"
                        />
                    </div>
                </div>
                <div class="hidden md:block md:col-span-1 lg:hidden"></div>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 col-span-1 md:col-span-7 lg:col-span-6 gap-y-12 sm:gap-x-8 md:gap-x-8 lg:gap-x-10">
                    <div class="sm:col-span-2 md:col-span-1 lg:col-span-1">
                        <h3 class="text-sm font-normal uppercase tracking-wide text-neutral-400 mb-5">Mis redes sociales</h3>
                        <ul class="space-y-3">
                            <li><a href="https://www.instagram.com/_rr_.aa/" class="text-sm hover:text-neutral-300 transition-colors">Instagram</a></li>
                            <li><a href="https://www.linkedin.com/in/raulanto" class="text-sm hover:text-neutral-300 transition-colors">LinkedIn</a></li>
                            <li><a href="https://x.com/raulantodev" class="text-sm hover:text-neutral-300 transition-colors">Twitter</a></li>
                            <li><a href="https://github.com/raulanto" class="text-sm hover:text-neutral-300 transition-colors">Github</a></li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </footer>
    <section class="relative z-40 overflow-hidden bg-neutral-950 py-16 px-8">
        <div class="container">
            <div class="absolute h-full w-full">
                <div class="absolute ">
                </div>

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
                />
            </div>

            <div class="-mx-4 flex flex-wrap items-center">
                <div class="w-full px-4 lg:w-1/2">
                    <div class="text-center lg:text-left ">
                        <div class="mb-10 lg:mb-0 ">
                            <img src="/icon.svg" width="44">
                            <h1
                                class="mt-0 mb-3 text-3xl font-bold leading-tight sm:text-4xl sm:leading-tight md:text-[40px] md:leading-tight text-white ">
                                rauantodev
                            </h1>

                        </div>
                    </div>
                </div>

            </div>
        </div>

    </section>
</template>

<style scoped>
</style>