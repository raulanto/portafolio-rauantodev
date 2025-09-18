<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const dotX = ref(0);
const dotY = ref(0);
const circleX = ref(0);
const circleY = ref(0);
const isVisible = ref(false);

const updateCursor = (event) => {
    // Cursor principal sigue el mouse inmediatamente
    dotX.value = event.clientX;
    dotY.value = event.clientY;
    isVisible.value = true;

    // GSAP suaviza el movimiento del círculo grande
    gsap.to(circleX, { value: event.clientX, duration: 0.4, ease: "power2.out" });
    gsap.to(circleY, { value: event.clientY, duration: 0.4, ease: "power2.out" });
};

// Animación de clic
const handleClick = () => {
    gsap.to(".cursor-circle", {
        scale: 1.5,  // Aumenta el tamaño del círculo
        opacity: 0.5, // Hace que se vea un poco más transparente
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
            gsap.to(".cursor-circle", {
                scale: 1,   // Regresa al tamaño original
                opacity: 1, // Restaura la opacidad
                duration: 0.2,
                ease: "power2.out"
            });
        }
    });
};

onMounted(() => {
    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("click", handleClick);
});

onUnmounted(() => {
    document.removeEventListener("mousemove", updateCursor);
    document.removeEventListener("click", handleClick);
});
</script>

<template>
    <div v-if="isVisible">
        <!-- Círculo grande con efecto de suavidad y clic -->
        <div
            class="cursor-circle backdrop-invert bg-white/30"
            :style="{ left: `${circleX}px`, top: `${circleY}px` }"
        ></div>

        <!-- Punto negro principal -->
        <div
            class="cursor-dot bg-blue-600"
            :style="{ left: `${dotX}px`, top: `${dotY}px` }"
        ></div>
    </div>
</template>

<style >
/* Punto negro (cursor principal) */
.cursor-dot {
    width: 6px;
    height: 6px;
    background-color: rgb(65, 127, 255);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9999;
}

/* Círculo grande con animación de suavidad */
.cursor-circle {
    width: 30px;
    height: 30px;
    background-color: rgba(245, 245, 245, 0.57);
    border-radius: 50%;

    position: fixed;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease-out;
    z-index: 9998;
}

body {
    cursor: none; /* Oculta el cursor predeterminado */
}
</style>
