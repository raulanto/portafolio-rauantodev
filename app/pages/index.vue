<script setup lang="ts">

import AllKey from "~/components/ui/allKey.vue";
import PixelBlast from "~/components/ui/PixelBlast.vue";
</script>

<template>

    <main class="h-screen w-full relative flex flex-col justify-center items-center gap-2 ">
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
        <section class="py-8 z-10 ">
            <div class="flex flex-col md:flex-row items-center max-w-6xl px-6 py-8 mx-auto">
                <div class="w-full md:w-1/2 py-8">
                    <h1 class=" text-5xl font-semibold leading-none tracking-tighter serif-text">
                        Bienvenido a <br><span class="text-purple-400">Mi Portafolio, <br></span> Soy Desarrollador de
                        Software.<br/>

                    </h1>
                    <h2 class="text-5xl font-bold  ">Raul antonio de la cruz hernandez</h2>
                    <h2 class="text-xl serif-text font-bold  ">Ing. En sistemas Computacionales</h2>

                    <div class="mt-2 flex">

                        <span
                            class='inline-flex h-full animate-background-shine cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-neutral-300'>
                                  +52 993 671 9807
                        </span>
                        <span
                            class='inline-flex h-full animate-background-shine cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-neutral-300'>
                                  raulantodev@gmail.com
                        </span>

                    </div>

                    <div class="mt-2 flex justify-center items-center gap-2">
                        <UButton to="/portafolio"
                            class='relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50'>
                            <span
                                class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]'/>
                            <span
                                class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 px-8 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl'>
                                Inicio
                            </span>
                        </UButton>
                        <UButton to="/proyectos" class='relative inline-flex h-12 w-fit items-center justify-center rounded-md bg-white px-3 font-medium text-gray-950 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50'>
                            <div class='absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-b from-[#c7d2fe] to-[#8678f9] opacity-75 blur' />
                            Proyectos
                        </UButton>



                    </div>


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