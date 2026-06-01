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
  <section class="w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-900 relative z-10 overflow-hidden py-24 sm:py-32 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6 md:px-8">
      
      <!-- Encabezado de la Sección -->
      <div class="mb-16 md:mb-24 max-w-2xl">
        <span class="text-sm font-semibold tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-4 block">Portafolio</span>
        <h2 class="serif-text text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          Innovación y <br class="hidden md:block"/>
          <span class="text-neutral-400 dark:text-neutral-500">Desarrollo.</span>
        </h2>
        <p class="text-lg text-neutral-600 dark:text-neutral-400">
          Explora los proyectos destacados y el ecosistema de tecnologías con las que construyo soluciones robustas y escalables.
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        <!-- Bento Item 1: Proyecto Destacado (Left Col) -->
        <div class="lg:col-span-7 flex flex-col bg-neutral-100 dark:bg-neutral-900/40 rounded-[2rem] p-6 sm:p-8 md:p-10 border border-neutral-200 dark:border-neutral-800/60 transition-colors duration-300 relative overflow-hidden group">
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 relative z-10">
            <div>
              <h3 class="text-2xl font-semibold mb-1">Proyecto Destacado</h3>
              <p class="text-neutral-500 dark:text-neutral-400 text-sm">El trabajo más reciente del portafolio.</p>
            </div>
            <NuxtLink
                to="/proyectos/"
                class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors group/btn"
            >
                <span class="font-medium text-sm">Ver todos</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </NuxtLink>
          </div>

          <div class="flex-grow flex items-center justify-center relative z-10 w-full mt-4">
            <PostCard :post="list[0]" class="w-full shadow-xl dark:shadow-2xl dark:shadow-black/50 transition-transform duration-500 group-hover:-translate-y-2" />
          </div>
          
          <!-- Decoración sutil de fondo -->
          <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
        </div>

        <!-- Bento Items Right Col -->
        <div class="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
          
          <!-- Bento Item 2: Tecnologías -->
          <div class="flex-1 bg-neutral-100 dark:bg-neutral-900/40 rounded-[2rem] p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800/60 transition-colors duration-300 flex flex-col relative overflow-hidden">
            
            <div class="mb-8 relative z-10">
              <h3 class="text-2xl font-semibold mb-2">Stack Tecnológico</h3>
              
              <div class="flex flex-wrap items-center gap-2 mt-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-full w-fit shadow-sm">
                <span class="text-sm text-neutral-500 dark:text-neutral-400">Especializado en</span>
                <RotatingText
                    :texts="['Vue', 'Angular', 'Django', 'Laravel', 'Nuxt', 'Flask', 'NodeJS', 'Go']"
                    mainClassName="text-sm font-semibold text-neutral-900 dark:text-white"
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

            <!-- Grid de iconos -->
            <div class="flex flex-wrap gap-3 sm:gap-4 justify-start items-center opacity-80 hover:opacity-100 transition-opacity duration-500 mt-auto relative z-10">
              <img
                  v-for="icon in tecnop"
                  :key="`tech-${icon}`"
                  :src="`https://skillicons.dev/icons?i=${icon}`"
                  :alt="`${icon} icon`"
                  class="h-8 w-8 sm:h-10 sm:w-10 object-contain grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 drop-shadow-sm"
              />
            </div>
            
            <!-- Decoración sutil -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/5 blur-3xl rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          </div>

          <!-- Bento Item 3: Card Tilt -->
          <div class="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-[2rem] p-6 sm:p-8 border border-neutral-800 dark:border-neutral-200 transition-colors duration-300 flex items-center justify-center relative overflow-hidden min-h-[250px] group">
             
             <!-- Abstract background elements -->
             <div class="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
               <div class="absolute top-[-50%] left-[-10%] w-[150%] h-[200%] bg-gradient-to-r from-transparent via-white dark:via-black to-transparent transform -skew-x-12 group-hover:translate-x-10 transition-transform duration-700"></div>
             </div>

             <div class="relative z-10 transform group-hover:scale-105 transition-transform duration-500 w-full flex flex-col items-center justify-center gap-6">
                 <p class="text-sm font-medium tracking-widest uppercase opacity-70">Identidad Digital</p>
                 <CardTilt />
             </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
</style>