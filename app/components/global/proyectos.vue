<script setup lang="ts">
import { ref, computed } from 'vue';
import { Motion } from 'motion-v';
import list from '~/utils/proyectos';

interface ProjectCardRefs {
    [key: string]: HTMLElement | null;
}

const cardRefs = ref<ProjectCardRefs>({});
const mouseData = ref<{[key: string]: {
        x: number;
        y: number;
        rotateX: number;
        rotateY: number;
        scale: number;
        opacity: number;
        rotateFigcaption: number;
        lastY: number;
    }}>({});

// Inicializar datos de mouse para cada proyecto
list.forEach(proyecto => {
    mouseData.value[proyecto.id] = {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        opacity: 0,
        rotateFigcaption: 0,
        lastY: 0
    };
});

const springTransition = computed(() => ({
    type: 'spring' as const,
    damping: 30,
    stiffness: 100,
    mass: 2
}));

const tooltipTransition = computed(() => ({
    type: 'spring' as const,
    damping: 30,
    stiffness: 350,
    mass: 1
}));

function handleMouse(e: MouseEvent, proyectoId: string) {
    const cardElement = cardRefs.value[proyectoId];
    if (!cardElement) return;

    const rect = cardElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotateAmplitude = 14;
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    mouseData.value[proyectoId].rotateX = rotationX;
    mouseData.value[proyectoId].rotateY = rotationY;
    mouseData.value[proyectoId].x = e.clientX - rect.left;
    mouseData.value[proyectoId].y = e.clientY - rect.top;

    const velocityY = offsetY - mouseData.value[proyectoId].lastY;
    mouseData.value[proyectoId].rotateFigcaption = -velocityY * 0.6;
    mouseData.value[proyectoId].lastY = offsetY;
}

function handleMouseEnter(proyectoId: string) {
    mouseData.value[proyectoId].scale = 1.05;
    mouseData.value[proyectoId].opacity = 1;
}

function handleMouseLeave(proyectoId: string) {
    mouseData.value[proyectoId].opacity = 0;
    mouseData.value[proyectoId].scale = 1;
    mouseData.value[proyectoId].rotateX = 0;
    mouseData.value[proyectoId].rotateY = 0;
    mouseData.value[proyectoId].rotateFigcaption = 0;
}
</script>

<template>
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 place-items-center justify-items-center-safe p-4 md:-mt-56">
        <figure
            v-for="proyecto in list"
            :key="proyecto.id"
            :ref="(el) => cardRefs[proyecto.id] = el as HTMLElement"
            class="relative w-full h-[300px] [perspective:800px] flex flex-col items-center justify-center cursor-pointer"
            @mousemove="(e) => handleMouse(e, proyecto.id)"
            @mouseenter="() => handleMouseEnter(proyecto.id)"
            @mouseleave="() => handleMouseLeave(proyecto.id)"
        >
            <Motion
                tag="div"
                class="relative [transform-style:preserve-3d] w-full h-full"
                :animate="{
          rotateX: mouseData[proyecto.id]?.rotateX || 0,
          rotateY: mouseData[proyecto.id]?.rotateY || 0,
          scale: mouseData[proyecto.id]?.scale || 1
        }"
                :transition="springTransition"
            >
                <!-- Imagen del proyecto -->
                <img
                    :src="proyecto.imageUrl"
                    :alt="proyecto.title"
                    class="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg will-change-transform [transform:translateZ(0)]"
                />

                <!-- Overlay con información del proyecto -->
                <Motion
                    tag="div"
                    class="absolute inset-0 flex items-end bg-gradient-to-t from-neutral-900 to-transparent p-6 rounded-lg will-change-transform [transform:translateZ(30px)]"
                    :animate="{
            opacity: mouseData[proyecto.id]?.opacity || 0
          }"
                    :transition="{ type: 'spring', damping: 20, stiffness: 300 }"
                >
                    <div class="w-full">
                        <h3 class="text-2xl font-bold text-white text-center">{{ proyecto.title }}</h3>
                        <p class="mt-2 text-neutral-300 text-center">{{ proyecto.description }}</p>
                        <div class="mt-4 flex flex-wrap gap-2 justify-center">
                            <UBadge
                                v-for="tag in proyecto.tag"
                                size="md"
                                :key="tag.id"
                                :color="tag.color"
                                variant="outline"
                            >
                                {{ tag.name }}
                            </UBadge>
                        </div>
                        <a
                            :href="proyecto.link"
                            class="mt-4 inline-flex items-center justify-center w-full text-white transition-colors hover:text-blue-300"
                            @click.stop
                        >
                            Mirar
                            <i class="fas fa-arrow-right ml-2"></i>
                        </a>
                    </div>
                </Motion>
            </Motion>

            <!-- Tooltip que sigue al cursor -->
            <Motion
                tag="figcaption"
                class="pointer-events-none absolute left-0 top-0 rounded-md bg-white px-3 py-2 text-sm text-neutral-800 font-medium shadow-lg z-10 hidden sm:block"
                :animate="{
          x: mouseData[proyecto.id]?.x || 0,
          y: mouseData[proyecto.id]?.y || 0,
          opacity: mouseData[proyecto.id]?.opacity || 0,
          rotate: mouseData[proyecto.id]?.rotateFigcaption || 0
        }"
                :transition="tooltipTransition"
            >
                rauantodev
            </Motion>
        </figure>
    </div>
</template>

<style scoped>
/* Optimización para mobile */
@media (max-width: 640px) {
    figure {
        perspective: none !important;
    }
}
</style>