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

<!--                    <div class="  mt-1 mb-1 space-x-3">-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#93c5fd_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        Python-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        django-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        vue-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        nuxt-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        flask-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        flask-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        fastapi-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        nodejs-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        go-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        angular-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        laravel-->
<!--                      </div>-->
<!--                    </span>-->
<!--                                            <span class='relative inline-block overflow-hidden rounded-full p-[1px]'>-->
<!--                      <span-->
<!--                          class='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#93c5fd_0%,#393BB2_50%,#93c5fd_100%)]'/>-->
<!--                      <div-->
<!--                          class='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-50 backdrop-blur-3xl'>-->
<!--                        sql-->
<!--                      </div>-->
<!--                    </span>-->
<!--                    </div>-->
<!--                    <p> python | django | vue | nuxt | flask | fastapi | nodejs | go | angular | laravel | sql</p>-->

                    <span
                        class='inline-flex h-full animate-background-shine cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-gray-300'>
                              +52 993 671 9807
                    </span>
                    <span
                        class='inline-flex h-full animate-background-shine cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-gray-300'>
                              raulantodev@gmail.com
                    </span>
                    <UButton
                        to="/portafolio"
                        class="cursor-pointer mt-3 p-3 group w-fit relative isolation-auto z-10 mx-auto flex items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-white/30 dark:border-white/20 px-3 py-1  shadow-2xl backdrop-blur-xl bg-white/20 dark:bg-black/20 before:absolute before:-left-full before:-z-10 before:aspect-square before:w-full before:rounded-full before:bg-primary-400 dark:before:bg-primary-400 before:transition-all before:duration-700 text-neutral-800 dark:text-neutral-100 hover:text-white dark:hover:text-white hover:before:left-0 hover:before:w-full hover:before:scale-150 hover:before:duration-700 lg:font-semibold transition-all duration-300 hover:bg-white/10 dark:hover:bg-black/10"
                    >
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            class="rotate-45 justify-end rounded-full p-1 duration-300 ease-linear group-hover:rotate-90 group-hover:border-none"
                            height="40"
                            width="40"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zm80.09 224L272 208.42V358h-32V208.42L175.91 272l-22.54-22.7L256 147.46 358.63 249.3z"
                            ></path>
                        </svg>
                        Portafolio
                    </UButton>
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