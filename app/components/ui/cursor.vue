<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Usamos un solo objeto para las coordenadas para reducir reactividad
const cursor = ref({
    dot: { x: 0, y: 0 },
    circle: { x: 0, y: 0 }
});
const isVisible = ref(false);

// Variables para optimización
let rafId = null;
let mouseX = 0;
let mouseY = 0;

const updateCursor = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (!rafId) {
        rafId = requestAnimationFrame(animateCursor);
    }
};

const animateCursor = () => {
    // Actualización directa sin GSAP para mejor rendimiento
    cursor.value.dot.x = mouseX;
    cursor.value.dot.y = mouseY;

    // Interpolación lineal simple para el círculo (más eficiente que GSAP)
    const circle = cursor.value.circle;
    const dx = mouseX - circle.x;
    const dy = mouseY - circle.y;

    circle.x += dx * 0.2; // Factor de suavidad ajustable
    circle.y += dy * 0.2;

    rafId = null;

    if (isVisible.value) {
        rafId = requestAnimationFrame(animateCursor);
    }
};

const handleClick = () => {
    const circleEl = document.querySelector('.cursor-circle');
    if (circleEl) {
        circleEl.style.transform = 'translate(-50%, -50%) scale(1.5)';
        circleEl.style.opacity = '0.5';

        setTimeout(() => {
            circleEl.style.transform = 'translate(-50%, -50%) scale(1)';
            circleEl.style.opacity = '1';
        }, 200);
    }
};

const handleMouseEnter = () => isVisible.value = true;
const handleMouseLeave = () => isVisible.value = false;

onMounted(() => {
    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("click", handleClick);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
});

onUnmounted(() => {
    document.removeEventListener("mousemove", updateCursor);
    document.removeEventListener("click", handleClick);
    document.removeEventListener("mouseenter", handleMouseEnter);
    document.removeEventListener("mouseleave", handleMouseLeave);
    if (rafId) cancelAnimationFrame(rafId);
});
</script>

<template>
    <div v-if="isVisible">
        <!-- Círculo grande optimizado -->
        <div
            class="cursor-circle"
            :style="{
        left: `${cursor.circle.x}px`,
        top: `${cursor.circle.y}px`
      }"
        ></div>

        <!-- Punto principal optimizado -->
        <div
            class="cursor-dot"
            :style="{
        left: `${cursor.dot.x}px`,
        top: `${cursor.dot.y}px`
      }"
        ></div>
    </div>
</template>

<style scoped>
.cursor-dot {
    width: 6px;
    height: 6px;
    background-color: rgb(65, 127, 255);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9999;
    will-change: transform; /* Optimización para el navegador */
}

.cursor-circle {
    width: 30px;
    height: 30px;
    background: rgba(255, 255, 255, 0.3); /* Reemplaza backdrop-invert */
    border: 1px solid rgba(65, 127, 255, 0.5);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9998;
    will-change: transform; /* Optimización para el navegador */
    transition: transform 0.1s ease-out;
}

body {
    cursor: none;
}

/* Opcional: deshabilitar en dispositivos táctiles */
@media (hover: none) and (pointer: coarse) {
    .cursor-dot,
    .cursor-circle {
        display: none;
    }
}
</style>