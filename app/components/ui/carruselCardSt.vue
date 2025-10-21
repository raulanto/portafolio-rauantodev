<template>
    <div
        ref="containerRef"
        class="absolute bottom-8 right-8 "
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
        <div
            class="relative overflow-hidden rounded-[24px] border border-neutral-800 bg-neutral-950/95 backdrop-blur-sm shadow-2xl p-2 flex items-center justify-center"
            :style="{
        width: `${baseWidth}px`,
        height: `${carouselHeight}px`
      }"
        >
            <Motion
                tag="div"
                class="flex items-center"
                drag="x"
                :dragConstraints="dragConstraints"
                :style="{
          width: cardWidth + 'px',
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + cardWidth / 2}px 50%`,
          x: motionX
        }"
                @dragEnd="handleDragEnd"
                :animate="{ x: -(currentIndex * trackItemOffset) }"
                :transition="effectiveTransition"
                @animationComplete="handleAnimationComplete"
            >
                <Motion
                    v-for="(proyecto, index) in carouselProjects"
                    :key="index"
                    tag="div"
                    class="relative shrink-0 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing rounded-[16px] border border-neutral-800 [perspective:800px]"
                    :style="{
            width: cardWidth + 'px',
            height: cardHeight + 'px',
            rotateY: getRotateY(index)
          }"
                    :transition="effectiveTransition"
                    @mouseenter="() => handleCardHover(index, true)"
                    @mouseleave="() => handleCardHover(index, false)"
                    @mousemove="(e) => handleMouseMove(e, index)"
                >
                    <!-- Contenedor 3D -->
                    <Motion
                        tag="div"
                        class="relative [transform-style:preserve-3d] w-full h-full"
                        :animate="{
              rotateX: cardStates[index]?.rotateX || 0,
              rotateY: cardStates[index]?.rotateY || 0,
              scale: cardStates[index]?.scale || 1
            }"
                        :transition="{ type: 'spring', damping: 30, stiffness: 100, mass: 2 }"
                    >
                        <!-- Imagen de fondo completa -->
                        <div class="absolute inset-0 z-0 will-change-transform [transform:translateZ(0)]">
                            <img
                                :src="proyecto.imageUrl"
                                :alt="proyecto.title"
                                class="w-full h-full object-cover"
                            />
                            <!-- Overlay oscuro para legibilidad -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
                        </div>

                        <!-- Contenido sobre la imagen -->
                        <div class="relative z-10 p-6 flex flex-col h-full justify-between will-change-transform [transform:translateZ(20px)]">
                            <!-- Icono superior -->
                            <div class="flex justify-start">
                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <i :class="proyecto.icon || 'fas fa-image'" class="text-white text-lg"></i>
                </span>
                            </div>

                            <!-- Información en la parte inferior -->
                            <div>
                                <h3 class="font-bold text-white text-xl mb-2 line-clamp-2 leading-tight">
                                    {{ proyecto.title }}
                                </h3>
                                <p class="text-neutral-300 text-sm line-clamp-2 leading-relaxed mb-4">
                                    {{ proyecto.description }}
                                </p>

                                <!-- Tags -->
                                <div class="flex flex-wrap gap-2 mb-3">
                                    <UBadge
                                        v-for="tag in proyecto.tag.slice(0, 3)"
                                        size="xs"
                                        :key="tag.id"
                                        :color="tag.color"
                                        variant="solid"
                                        class="text-xs bg-white/20 backdrop-blur-sm"
                                    >
                                        {{ tag.name }}
                                    </UBadge>
                                </div>
                            </div>
                        </div>
                    </Motion>

                    <!-- Tooltip que sigue al cursor -->
                    <Motion
                        v-if="cardStates[index]?.showTooltip"
                        tag="div"
                        class="pointer-events-none absolute rounded-md bg-white px-3 py-1.5 text-xs text-neutral-800 font-medium shadow-lg z-20"
                        :animate="{
              x: cardStates[index]?.tooltipX || 0,
              y: cardStates[index]?.tooltipY || 0,
              opacity: cardStates[index]?.tooltipOpacity || 0,
              rotate: cardStates[index]?.tooltipRotate || 0
            }"
                        :transition="{ type: 'spring', damping: 30, stiffness: 350, mass: 1 }"
                    >
                        rauantodev
                    </Motion>
                </Motion>
            </Motion>

            <!-- Indicadores de navegación -->
            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-30">
                <div class="flex gap-1.5 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                    <Motion
                        v-for="(_, index) in list"
                        :key="index"
                        tag="div"
                        :class="[
              'h-1.5 w-1.5 rounded-full cursor-pointer transition-colors duration-200',
              currentIndex % list.length === index
                ? 'bg-white'
                : 'bg-neutral-500'
            ]"
                        :animate="{
              scale: currentIndex % list.length === index ? 1.2 : 1
            }"
                        @click="() => setCurrentIndex(index)"
                        :transition="{ duration: 0.2 }"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, useTemplateRef } from 'vue';
import { Motion, useMotionValue, useTransform } from 'motion-v';
import list from '~/utils/proyectos';

interface CardState {
    rotateX: number;
    rotateY: number;
    scale: number;
    showTooltip: boolean;
    tooltipX: number;
    tooltipY: number;
    tooltipOpacity: number;
    tooltipRotate: number;
    lastY: number;
}

interface CarouselProps {
    baseWidth?: number;
    carouselHeight?: number;
    cardWidth?: number;
    cardHeight?: number;
    autoplay?: boolean;
    autoplayDelay?: number;
    pauseOnHover?: boolean;
    loop?: boolean;
}

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

const props = withDefaults(defineProps<CarouselProps>(), {
    baseWidth: 380,
    carouselHeight: 230,
    cardWidth: 360,
    cardHeight: 200,
    autoplay: true,
    autoplayDelay: 4000,
    pauseOnHover: true,
    loop: true
});

const containerPadding = 0;
const itemWidth = computed(() => props.cardWidth);
const trackItemOffset = computed(() => props.cardWidth + GAP);

const carouselProjects = computed(() => (props.loop ? [...list, list[0]] : list));
const currentIndex = ref<number>(0);
const motionX = useMotionValue(0);
const isHovered = ref<boolean>(false);
const isResetting = ref<boolean>(false);

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
let autoplayTimer: number | null = null;

// Estados de las tarjetas para el efecto 3D
const cardStates = ref<Record<number, CardState>>({});

// Inicializar estados de tarjetas
carouselProjects.value.forEach((_, index) => {
    cardStates.value[index] = {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        showTooltip: false,
        tooltipX: 0,
        tooltipY: 0,
        tooltipOpacity: 0,
        tooltipRotate: 0,
        lastY: 0
    };
});

const dragConstraints = computed(() => {
    return props.loop
        ? {}
        : {
            left: -trackItemOffset.value * (carouselProjects.value.length - 1),
            right: 0
        };
});

const effectiveTransition = computed(() => (isResetting.value ? { duration: 0 } : SPRING_OPTIONS));

const maxItems = Math.max(list.length + 1, 10);
const rotateYTransforms = Array.from({ length: maxItems }, (_, index) => {
    const range = computed(() => [
        -(index + 1) * trackItemOffset.value,
        -index * trackItemOffset.value,
        -(index - 1) * trackItemOffset.value
    ]);
    const outputRange = [35, 0, -35];
    return useTransform(motionX, range, outputRange, { clamp: false });
});

const getRotateY = (index: number) => {
    return rotateYTransforms[index] || rotateYTransforms[0];
};

const setCurrentIndex = (index: number) => {
    currentIndex.value = index;
};

// Manejo del efecto 3D en las tarjetas
const handleMouseMove = (e: MouseEvent, index: number) => {
    const card = e.currentTarget as HTMLElement;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotateAmplitude = 8;
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    cardStates.value[index].rotateX = rotationX;
    cardStates.value[index].rotateY = rotationY;
    cardStates.value[index].tooltipX = e.clientX - rect.left;
    cardStates.value[index].tooltipY = e.clientY - rect.top;

    const velocityY = offsetY - cardStates.value[index].lastY;
    cardStates.value[index].tooltipRotate = -velocityY * 0.3;
    cardStates.value[index].lastY = offsetY;
};

const handleCardHover = (index: number, isEntering: boolean) => {
    if (isEntering) {
        cardStates.value[index].scale = 1.02;
        cardStates.value[index].showTooltip = true;
        cardStates.value[index].tooltipOpacity = 1;
    } else {
        cardStates.value[index].scale = 1;
        cardStates.value[index].showTooltip = false;
        cardStates.value[index].tooltipOpacity = 0;
        cardStates.value[index].rotateX = 0;
        cardStates.value[index].rotateY = 0;
        cardStates.value[index].tooltipRotate = 0;
    }
};

const handleAnimationComplete = () => {
    if (props.loop && currentIndex.value === carouselProjects.value.length - 1) {
        isResetting.value = true;
        motionX.set(0);
        currentIndex.value = 0;
        setTimeout(() => {
            isResetting.value = false;
        }, 50);
    }
};

interface DragInfo {
    offset: { x: number; y: number };
    velocity: { x: number; y: number };
}

const handleDragEnd = (event: Event, info: DragInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
        if (props.loop && currentIndex.value === list.length - 1) {
            currentIndex.value = currentIndex.value + 1;
        } else {
            currentIndex.value = Math.min(currentIndex.value + 1, carouselProjects.value.length - 1);
        }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
        if (props.loop && currentIndex.value === 0) {
            currentIndex.value = list.length - 1;
        } else {
            currentIndex.value = Math.max(currentIndex.value - 1, 0);
        }
    }
};

const startAutoplay = () => {
    if (props.autoplay && (!props.pauseOnHover || !isHovered.value)) {
        autoplayTimer = window.setInterval(() => {
            currentIndex.value = (() => {
                const prev = currentIndex.value;
                if (prev === list.length - 1 && props.loop) {
                    return prev + 1;
                }
                if (prev === carouselProjects.value.length - 1) {
                    return props.loop ? 0 : prev;
                }
                return prev + 1;
            })();
        }, props.autoplayDelay);
    }
};

const stopAutoplay = () => {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
};

const handleMouseEnter = () => {
    isHovered.value = true;
    if (props.pauseOnHover) {
        stopAutoplay();
    }
};

const handleMouseLeave = () => {
    isHovered.value = false;
    if (props.pauseOnHover) {
        startAutoplay();
    }
};

watch(
    [
        () => props.autoplay,
        () => props.autoplayDelay,
        isHovered,
        () => props.loop,
        () => props.pauseOnHover
    ],
    () => {
        stopAutoplay();
        startAutoplay();
    }
);

onMounted(() => {
    startAutoplay();
});

onUnmounted(() => {
    stopAutoplay();
});
</script>