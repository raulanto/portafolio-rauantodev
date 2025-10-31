<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'

interface Particle {
    x: number
    y: number
    size: number
    opacity: number
    fadeSpeed: number
    fadeIn: boolean
    life: number
    age: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null
const particles: Particle[] = []

const createParticle = (): Particle => {
    return {
        x: Math.random() * (canvasRef.value?.width || 0),
        y: Math.random() * (canvasRef.value?.height || 0),
        size: Math.random() * 1 + 0.3, // Puntos muy pequeños (0.5 - 1.5px)
        opacity: 0,
        fadeSpeed: Math.random() * 0.02 + 0.01,
        fadeIn: true,
        life: Math.random() * 200 + 100,
        age: 0
    }
}

const resetParticle = (particle: Particle): void => {
    particle.x = Math.random() * (canvasRef.value?.width || 0)
    particle.y = Math.random() * (canvasRef.value?.height || 0)
    particle.size = Math.random() * 1 + 0.3
    particle.opacity = 0
    particle.fadeSpeed = Math.random() * 0.02 + 0.01
    particle.fadeIn = true
    particle.life = Math.random() * 200 + 100
    particle.age = 0
}

const updateParticle = (particle: Particle): void => {
    particle.age++

    if (particle.fadeIn) {
        particle.opacity += particle.fadeSpeed
        if (particle.opacity >= 1) {
            particle.opacity = 1
            particle.fadeIn = false
        }
    } else {
        particle.opacity -= particle.fadeSpeed
        if (particle.opacity <= 0) {
            particle.opacity = 0
            particle.fadeIn = true
        }
    }

    if (particle.age > particle.life) {
        resetParticle(particle)
    }
}

const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle): void => {
    ctx.save()
    ctx.globalAlpha = particle.opacity
    ctx.fillStyle = 'rgba(95,153,245,0.91)'
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
}

const animate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(particle => {
        updateParticle(particle)
        drawParticle(ctx, particle)
    })

    animationFrameId = requestAnimationFrame(() => animate(ctx, canvas))
}

const resizeCanvas = (): void => {
    if (!canvasRef.value) return

    canvasRef.value.width = canvasRef.value.offsetWidth
    canvasRef.value.height = canvasRef.value.offsetHeight
}

onMounted(() => {
    if (!canvasRef.value) return

    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Crear 120 partículas pequeñas
    const particleCount = 60
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle())
    }

    animate(ctx, canvas)
})

onUnmounted(() => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
    }
    window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
    <!-- About Section -->
    <section id="about" class="py-20 relative overflow-hidden dark:bg-neutral-950 bg-white border-t border-b border-b-neutral-200 border-t-neutral-200 dark:border-b-neutral-700 dark:border-t-neutral-700">
        <canvas
            ref="canvasRef"
            class="absolute top-0 left-0 w-full h-full pointer-events-none"
        ></canvas>

        <section id="home" class="pt-20 pb-16 ">
            <div class="max-w-6xl mx-auto px-4">
                <div class="flex flex-col lg:flex-row items-center justify-between">
                    <div class="lg:w-2/3 mb-8 lg:mb-0 animate-fade-in">
                        <h1 class="text-5xl lg:text-6xl font-bold   mb-4 serif-text">
                            raulanto
                        </h1>
                        <h2 class="text-2xl lg:text-3xl text-primary-500 font-semibold mb-6">
                            Full Stack Developer
                        </h2>
                        <p class="text-lg   mb-8 leading-relaxed max-w-2xl">
                            Apasionado desarrollador full-stack con más de 2 años de experiencia en la creación de
                            aplicaciones web escalables. Especializado en Nuxt,vue, Django . Me
                            apasiona convertir problemas complejos en soluciones sencillas y elegantes.


                        </p>
                        <div class="flex flex-wrap gap-4">
                            <NuxtLink to="/perfil/cv" class="group inline-flex items-center
                            justify-center rounded-full py-2 px-4 text-sm font-semibold
                            focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2
                            bg-neutral-900 text-white hover:bg-neutral-700 hover:text-slate-100
                            active:bg-neutral-800 active:text-neutral-300 focus-visible:outline-neutral-900 animate-fade-in-left
                            dark:bg-primary dark:text-neutral-950 dark:hover:bg-primary-400"
                               >
                                <span class="">Mas Sobre mi</span>
                            </NuxtLink>
                        </div>
                    </div>
                    <div class="lg:w-1/3 flex justify-center animate-slide-up">
                        <div class="relative">
                            <div class="w-64 h-64 rounded-full bg-gradient-to-br from-blue-600 to-blue-600 p-1">
                                <img src="https://avatars.githubusercontent.com/u/74162376?v=4"
                                     alt="Alex Johnson" class="w-full h-full rounded-full object-cover">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </section>
</template>

<style scoped>

</style>