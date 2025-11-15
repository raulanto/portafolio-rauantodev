<script setup lang="ts">
import RotatingText from "~/components/ui/RotatingText.vue";
import CardTilt from "~/components/ui/CardTilt.vue";
import list from '~/utils/proyectos';
import PostCard from "~/components/global/card/postCard.vue";

const tecnop = [
    "git", "js", "html", "css", "kubernetes", "python", "docker", "c", "vue",
    "git", "java", "nuxt", "django", "mysql", "figma", "npm", "pinia",
    "mongodb", "angular", "postgresql",
];

const floatingIcons = ref([
    // --- Grupo Izquierdo ---
    { icon: 'django', top: '15%', left: '10%', rotate: -8 },
    { icon: 'js', top: '35%', left: '5%', rotate: 5 },
    { icon: 'html', top: '55%', left: '12%', rotate: -10 },
    { icon: 'css', top: '75%', left: '8%', rotate: 3 },
    { icon: 'angular', top: '20%', left: '22%', rotate: -5 },

    // --- Grupo Derecho ---
    { icon: 'python', top: '20%', right: '8%', rotate: 10 },
    { icon: 'postgresql', top: '40%', right: '12%', rotate: -5 },
    { icon: 'vue', top: '60%', right: '5%', rotate: 8 },
    { icon: 'nuxt', top: '50%', right: '20%', rotate: -3 },
    { icon: 'ts', top: '15%', right: '20%', rotate: 15 },
]);

const post = {
    id: 18,
    title: 'Herramientas de Coordenadas',
    description: 'Sistema con diferentes herramientas.',
    tag: [
        {id: 1, name: 'Nuxt', color: 'primary'},
        {id: 2, name: 'Vue', color: 'success'},
        {id: 3, name: 'API', color: 'success'}
    ],
    imageUrl: [
        './coordenadasFrontend.png',
        './grad.png',
        './coordenadasFrontend.png',
        './coordenadasFrontend.png',
        './coordenadasFrontend.png',
        './coordenadasFrontend.png'
    ],
    link: 'https://fro-corden.vercel.app/'
};
</script>

<template>
    <div class="relative overflow-hidden dark:bg-neutral-950 mb-32 min-h-screen">
        <!-- Contenido principal -->
        <div id="proyectos" class="relative px-4">
            <!-- Contenedor del texto con carruseles de fondo -->
            <div class="relative mb-16 h-auto md:h-screen overflow-hidden">
                <div class="absolute inset-0 z-0 midnight-mist-bg"/>

                <!-- Iconos flotantes (Desktop) -->
                <img
                    v-for="item in floatingIcons"
                    :key="item.icon"
                    :src="`https://skillicons.dev/icons?i=${item.icon}`"
                    :alt="`${item.icon} icon`"
                    class="absolute z-10 h-14 w-14 object-contain border border-gray-200 bg-white rounded-lg dark:!border-neutral-800 dark:shadow-lg dark:bg-neutral-900 hidden md:block"
                    :style="{
            top: item.top,
            left: item.left,
            right: item.right,
            transform: `rotate(${item.rotate}deg)`
          }"
                />

                <!-- Contenido central -->
                <div class="relative z-40 text-center py-12 pt-32 smooth-move">
          <span
              class="inline-flex h-full animate-background-shine cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-xs font-medium text-neutral-300"
          >
            Proyectos
          </span>

                    <div
                        class="flex flex-col justify-center items-center mt-3 gap-2 transition-all duration-1000 ease-in-out">
                        <CardTilt/>

                        <h3 class="font-black text-4xl transform-stroke">
                            Full Stack Developer
                        </h3>

                        <RotatingText
                            :texts="['Vue', 'Angular', 'Django', 'Laravel', 'Nuxt', 'Flask', 'NodeJS', 'Go']"
                            mainClassName="px-2 sm:px-2 md:px-3 bg-neutral-900 text-4xl text-neutral-50 font-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-md"
                            staggerFrom="last"
                            :initial="{ y: '100%' }"
                            :animate="{ y: 0 }"
                            :exit="{ y: '-120%' }"
                            :staggerDuration="0.025"
                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                            :transition="{ type: 'spring', damping: 30, stiffness: 400 }"
                            :rotationInterval="2000"
                        />
                    </div>

                    <!-- Iconos tecnológicos (Mobile) -->
                    <div class="md:hidden flex flex-wrap justify-center items-center gap-3 px-4 pt-16">
                        <img
                            v-for="icon in tecnop"
                            :key="`mobile-${icon}`"
                            :src="`https://skillicons.dev/icons?i=${icon}`"
                            :alt="`${icon} icon`"
                            class="h-10 w-10 object-contain border border-gray-200 bg-white rounded-lg dark:!border-neutral-800 dark:shadow-lg dark:bg-neutral-900"
                        />
                    </div>
                </div>
            </div>

            <!-- Sección de Proyectos -->
            <div class="xl:-mt-96 sm:-mt-20">
                <div class="flex flex-col space-y-8 justify-center items-center gap-3 px-4 pt-16">
                    <PostCard
                        :post="list[0]"
                    />

                    <UButton to="/proyectos/" class="w-fit">
                        Ver todos los proyectos
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.midnight-mist-bg {
    background-image: radial-gradient(circle at 50% 100%, rgba(84, 101, 131, 0.5) 0%, transparent 60%),
    radial-gradient(circle at 50% 100%, rgb(96, 165, 250) 0%, transparent 70%),
    radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%);
}

.smooth-move {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.smooth-move h3 {
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>