<script setup lang="ts">
import { ref } from 'vue';
import RotatingText from "~/components/ui/RotatingText.vue";
import CardTilt from "~/components/ui/CardTilt.vue";
import list from '~/utils/proyectos'; // Asumo que esto existe según tu código
import PostCard from "~/components/global/card/postCard.vue";

// --- Datos Originales ---
const tecnop = [
    "git", "js", "html", "css", "kubernetes", "python", "docker", "c", "vue",
    "git", "java", "nuxt", "django", "mysql", "figma", "npm", "pinia",
    "mongodb", "angular", "postgresql",
];

const floatingIcons = ref([
    // --- Grupo Izquierdo ---
    { icon: 'django', top: '15%', left: '10%', rotate: -8, delay: '0s' },
    { icon: 'js', top: '35%', left: '5%', rotate: 5, delay: '1s' },
    { icon: 'html', top: '55%', left: '12%', rotate: -10, delay: '2s' },
    { icon: 'css', top: '75%', left: '8%', rotate: 3, delay: '0.5s' },
    { icon: 'angular', top: '20%', left: '22%', rotate: -5, delay: '1.5s' },

    // --- Grupo Derecho ---
    { icon: 'python', top: '20%', right: '8%', rotate: 10, delay: '0.8s' },
    { icon: 'postgresql', top: '40%', right: '12%', rotate: -5, delay: '2.2s' },
    { icon: 'vue', top: '60%', right: '5%', rotate: 8, delay: '1.2s' },
    { icon: 'nuxt', top: '50%', right: '20%', rotate: -3, delay: '0.3s' },
    { icon: 'ts', top: '15%', right: '20%', rotate: 15, delay: '1.8s' },
]);
</script>

<template>
    <div class="relative overflow-hidden bg-[#050505] text-white min-h-screen font-sans selection:bg-purple-500 selection:text-white">

        <!-- FONDO: Mist Effect Modernizado -->
        <div class="absolute inset-0 pointer-events-none">
            <!-- Capa de ruido sutil para textura -->
            <div class="absolute inset-0 opacity-[0.03] z-10 mix-blend-overlay"
                 style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');">
            </div>
            <!-- El gradiente Midnight Mist -->
            <div class="absolute inset-0 midnight-mist-bg opacity-80 z-0"></div>
        </div>

        <!-- CONTENIDO PRINCIPAL -->
        <div id="proyectos" class="relative">

            <!-- SECCIÓN HERO (Altura completa) -->
            <div class="relative h-screen flex flex-col items-center justify-center overflow-hidden">

                <!-- Iconos Flotantes (Desktop) con animación -->
                <!-- Usamos v-for con los datos originales pero mejor estilo -->
                <div class="absolute inset-0 w-full h-full max-w-7xl mx-auto pointer-events-none hidden md:block">
                    <div
                        v-for="item in floatingIcons"
                        :key="item.icon"
                        class="absolute flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl animate-float"
                        :style="{
                            top: item.top,
                            left: item.left,
                            right: item.right,
                            transform: `rotate(${item.rotate}deg)`,
                            animationDelay: item.delay || '0s'
                        }"
                    >
                        <img
                            :src="`https://skillicons.dev/icons?i=${item.icon}`"
                            :alt="`${item.icon} icon`"
                            class="h-10 w-10 object-contain opacity-90 hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                </div>

                <!-- Centro: Títulos y CardTilt -->
                <div class="relative z-20 flex flex-col items-center text-center px-4 -mt-20">

                    <!-- Badge -->
                    <span class="mb-6 inline-flex animate-background-shine bg-[linear-gradient(110deg,#1a1a1a,45%,#333,55%,#1a1a1a)] bg-[length:200%_100%] border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium text-gray-300 tracking-wide uppercase">
                        Proyectos Destacados
                    </span>

                    <CardTilt class="mb-6" />

                    <h3 class="font-bold text-5xl md:text-7xl mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 drop-shadow-sm">
                        Full Stack Developer
                    </h3>

                    <div class="mt-4">
                        <RotatingText
                            :texts="['Vue', 'Angular', 'Django', 'Laravel', 'Nuxt', 'Flask', 'NodeJS', 'Go']"
                            mainClassName="px-4 py-2 bg-white/5 border border-white/5 backdrop-blur-md text-3xl md:text-4xl text-purple-200 font-bold rounded-xl shadow-lg"
                            staggerFrom="last"
                            :initial="{ y: '100%', opacity: 0 }"
                            :animate="{ y: 0, opacity: 1 }"
                            :exit="{ y: '-120%', opacity: 0 }"
                            :staggerDuration="0.025"
                            :transition="{ type: 'spring', damping: 25, stiffness: 300 }"
                            :rotationInterval="2500"
                        />
                    </div>

                    <!-- Iconos Móvil (Solo visible en pantallas pequeñas) -->
                    <div class="md:hidden flex flex-wrap justify-center items-center gap-3 mt-12 px-4 opacity-80">
                        <img
                            v-for="icon in tecnop"
                            :key="`mobile-${icon}`"
                            :src="`https://skillicons.dev/icons?i=${icon}`"
                            :alt="`${icon} icon`"
                            class="h-9 w-9 object-contain bg-white/5 p-1.5 rounded-lg border border-white/10"
                        />
                    </div>
                </div>
            </div>

            <!-- SECCIÓN PROYECTOS (Superpuesta con efecto de profundidad) -->
            <!-- Usamos un margen negativo grande para que suba sobre el degradado del hero -->
            <div class="relative z-30 w-full max-w-5xl mx-auto px-4 pb-32 -mt-32 md:-mt-40">

                <!-- Efecto de brillo detrás de la tarjeta -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-purple-600/20 blur-[100px] -z-10 rounded-full"></div>

                <div class="flex flex-col items-center gap-10">
                    <!-- TU COMPONENTE ORIGINAL RESPETADO -->
                    <div class="transform hover:scale-[1.01] transition-transform duration-500 w-full">
                        <PostCard :post="list[0]" />
                    </div>

                    <UButton
                        to="/proyectos/"
                        size="xl"
                        color="white"
                        variant="ghost"
                        class="group text-gray-400 hover:text-white transition-colors"
                    >
                        Ver todos los proyectos
                        <template #trailing>
                            <span class="group-hover:translate-x-1 transition-transform inline-block ml-1">→</span>
                        </template>
                    </UButton>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
/* Gradiente mejorado para ser más profundo y suave */
.midnight-mist-bg {
    background: radial-gradient(circle at 50% 100%,
    rgba(109, 40, 217, 0.4) 0%,
    rgba(76, 29, 149, 0.2) 30%,
    rgba(5, 5, 5, 0.8) 60%,
    rgb(5, 5, 5) 100%
    );
}

/* Animación de flotación suave */
@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
    50% { transform: translateY(-15px) rotate(var(--tw-rotate)); }
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}
</style>