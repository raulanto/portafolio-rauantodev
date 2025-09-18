<template>
    <div class="particle-container">
        <div
            v-for="particle in particles"
            :key="particle.id"
            class="particle"
            :style="{
        left: particle.x + '%',
        top: particle.y + '%',
        width: particle.size + 'px',
        height: particle.size + 'px',
        opacity: particle.opacity,
        transform: `rotate(${particle.rotation}deg)`
      }"
        >
            <div
                class="particle-tail"
                :style="{
          height: (particle.size * 3) + 'px'
        }"
            ></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
    id: number
    x: number
    y: number
    size: number
    speed: number
    opacity: number
    rotation: number
}

const particles = ref<Particle[]>([])
const animationId = ref<number | null>(null)

const PARTICLE_COUNT = 15
const PARTICLE_SIZE = { min: 2, max: 2 }
const FALL_SPEED = { min: 0.5, max: 1 }

const createParticle = (): Particle => {
    return {
        id: Math.random(),
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * (PARTICLE_SIZE.max - PARTICLE_SIZE.min) + PARTICLE_SIZE.min,
        speed: Math.random() * (FALL_SPEED.max - FALL_SPEED.min) + FALL_SPEED.min,
        opacity: Math.random() * 0.8 + 0.2,
        rotation: Math.random() * 260
    }
}

const initParticles = (): void => {
    particles.value = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = createParticle()
        particle.y = Math.random() * 110
        particles.value.push(particle)
    }
}

const animate = (): void => {
    particles.value.forEach((particle, index) => {
        particle.y += particle.speed
        particle.rotation += 2

        if (particle.y > 110) {
            particles.value[index] = createParticle()
        }
    })

    animationId.value = requestAnimationFrame(animate)
}

onMounted(() => {
    initParticles()
    animate()
})

onUnmounted(() => {
    if (animationId.value) {
        cancelAnimationFrame(animationId.value)
    }
})
</script>

<style scoped>
.particle-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;


}

.particle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #60a5fa, #1d4ed8);
    box-shadow:
        0 0 10px rgba(59, 130, 246, 0.6),
        0 0 20px rgba(59, 130, 246, 0.4),
        0 0 30px rgba(59, 130, 246, 0.2);
    animation: twinkle 2s infinite alternate;
    transition: transform 0.1s;
}

.particle-tail {
    position: absolute;
    top: -16px;
    left: 50%;
    width: 2px;
    opacity: 0.6;
    background: linear-gradient(to top, #3b82f6, transparent);
    transform: translateX(-50%);
}

.particle::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%);
    animation: pulse 1.5s infinite;
}

@keyframes twinkle {
    0% {
        filter: brightness(1);
    }
    100% {
        filter: brightness(1.5);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.8;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.4;
    }
}
</style>