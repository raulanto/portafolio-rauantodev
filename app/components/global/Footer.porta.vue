<script setup lang="ts">
import PixelBlast from "~/components/ui/PixelBlast.vue";
import CarruselCardSt from "~/components/ui/carruselCardSt.vue";
</script>

<template>
  <footer class="relative bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white z-50 overflow-hidden border-t border-neutral-200 dark:border-neutral-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-12 relative z-40">
      
      <!-- Top Section (Grid) -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 mb-20">
        <!-- Col 1 & 2: Links (Navegación & Social) -->
        <div class="md:col-span-8 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-6">Navegación</h4>
            <ul class="space-y-4">
              <li><NuxtLink to="/" class="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm">Inicio</NuxtLink></li>
              <li><NuxtLink to="/sobre-mi" class="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm">Sobre mí</NuxtLink></li>
              <li><NuxtLink to="/proyectos" class="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm">Proyectos</NuxtLink></li>
              <li><NuxtLink to="/experiencia" class="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm">Experiencia</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-6">Social</h4>
            <ul class="space-y-4">
              <li><a href="https://github.com/raulanto" target="_blank" class="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/raulanto" target="_blank" class="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm">LinkedIn</a></li>
              <li><a href="https://x.com/raulantodev" target="_blank" class="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm">Twitter</a></li>
              <li><a href="https://www.instagram.com/_rr_.aa/" target="_blank" class="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors text-sm">Instagram</a></li>
            </ul>
          </div>
        </div>

        <!-- Col 4: Right side (Carrusel) -->
        <div class="md:col-span-4 lg:col-span-4 flex flex-col gap-6 items-start lg:items-end">
          <h3 class="text-xl font-medium text-neutral-800 dark:text-neutral-200">
            Estoy listo para colaborar contigo.
          </h3>
          <carrusel-card-st class="max-w-xs" position-class="relative" />
        </div>
      </div>

      <!-- Middle Section (Reach out at) -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center py-8 border-t border-neutral-200 dark:border-neutral-900 gap-6 transition-colors duration-300">
        <div>
          <p class="text-neutral-600 dark:text-neutral-400 text-lg mb-2">Ponte en contacto en:</p>
          <a href="mailto:raulantodev@gmail.com" class="text-2xl md:text-3xl font-medium text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center gap-2 group">
            raulantodev@gmail.com
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"><path d="M7 17L17 7"></path><path d="M7 7h10v10"></path></svg>
          </a>
        </div>


      </div>
    </div>

    <!-- Bottom Section: Giant Text + PixelBlast -->
    <div class="relative w-full h-[250px] md:h-[350px] lg:h-[450px] flex items-end justify-center overflow-hidden border-t border-neutral-200 dark:border-neutral-900/50 transition-colors duration-300">
      <!-- Background PixelBlast -->
      <div class="absolute inset-0 z-0 opacity-50 dark:opacity-50 opacity-20">
        <PixelBlast
          variant="circle"
          :pixel-size="6"
          color="#C27AFF" 
          
          :pattern-scale="3"
          :pattern-density="1.2"
          :pixel-size-jitter="0.5"
          :enable-ripples="true"
          :ripple-speed="0.4"
          :ripple-thickness="0.12"
          :ripple-intensity-scale="1.5"
          :liquid="false"
          :speed="0.6"
          :edge-fade="0.25"
          :transparent="true"
        />
      </div>
      
      <div class="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white dark:from-neutral-950/80 dark:via-transparent dark:to-neutral-950 z-10 transition-colors duration-300"></div>
      
      <!-- Giant Text -->
      <h1 class="relative z-20 text-[14vw] leading-none font-extrabold text-neutral-900/10 dark:text-white/20 select-none tracking-tighter mb-[-2vw] transition-colors duration-300">
        RAUANTODEV
      </h1>
    </div>
  </footer>
</template>

<style scoped>
</style>