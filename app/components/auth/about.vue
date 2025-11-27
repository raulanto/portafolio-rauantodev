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
        size: Math.random() * 1.5 + 0.5, // Ligeramente más grandes para el efecto "polvo"
        opacity: 0,
        fadeSpeed: Math.random() * 0.01 + 0.005, // Más lentas y suaves
        fadeIn: true,
        life: Math.random() * 200 + 100,
        age: 0
    }
}

const resetParticle = (particle: Particle): void => {
    particle.x = Math.random() * (canvasRef.value?.width || 0)
    particle.y = Math.random() * (canvasRef.value?.height || 0)
    particle.size = Math.random() * 1.5 + 0.5
    particle.opacity = 0
    particle.fadeSpeed = Math.random() * 0.01 + 0.005
    particle.fadeIn = true
    particle.life = Math.random() * 200 + 100
    particle.age = 0
}

const updateParticle = (particle: Particle): void => {
    particle.age++

    if (particle.fadeIn) {
        particle.opacity += particle.fadeSpeed
        if (particle.opacity >= 0.6) { // Opacidad máxima reducida
            particle.opacity = 0.6
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
    // Color blanco/púrpura muy sutil para fondo oscuro
    ctx.fillStyle = 'rgba(216, 180, 254, 0.6)'
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

    // Crear partículas
    const particleCount = 50 // Menos partículas para más minimalismo
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
    <section id="about" class="relative py-24 sm:py-32 overflow-hidden bg-[#050505] text-white selection:bg-purple-500 selection:text-white border-t border-white/5">

        <!-- CANVAS PARTÍCULAS -->
        <canvas
            ref="canvasRef"
            class="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        ></canvas>

        <!-- CAPAS DE FONDO (Noise + Glow) -->
        <div class="absolute inset-0 pointer-events-none z-0">

            <!-- Glow ambiental derecho -->
            <div class="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full"></div>
        </div>

        <div class="relative z-20 max-w-6xl mx-auto px-6 lg:px-8">
            <div class="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">

                <!-- COLUMNA TEXTO -->
                <div class="lg:w-3/5 text-left">

                    <h1 class="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-2">
                        raulanto
                    </h1>

                    <h2 class="text-2xl lg:text-3xl font-medium mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                        Full Stack Developer
                    </h2>

                    <!-- Badges de Contacto Minimalistas -->
                    <div class="flex flex-wrap gap-3 mb-8">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            +52 993 671 9807
                        </div>
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-colors cursor-copy">
                            <span class="i-heroicons-envelope w-3 h-3"></span>
                            raulantodev@gmail.com
                        </div>
                    </div>

                    <p class="text-lg text-gray-400 leading-relaxed mb-10 max-w-2xl font-light">
                        Apasionado desarrollador full-stack con más de <span class="text-white font-medium">2 años de experiencia</span> en la creación de aplicaciones web escalables. Especializado en
                        <span class="text-purple-300">Nuxt, Vue y Django</span>.
                        Me apasiona convertir problemas complejos en soluciones sencillas, elegantes y de alto rendimiento.
                    </p>

                    <div class="flex flex-wrap gap-4">
                        <NuxtLink to="/perfil/cv" class="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-white/10 border border-white/10 rounded-full hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-[#050505]">
                            <span>Más Sobre Mí</span>
                            <svg class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </NuxtLink>
                    </div>
                </div>

                <!-- COLUMNA IMAGEN (Modernizada) -->
                <div class="lg:w-2/5 flex justify-center lg:justify-end">
                    <div class="relative group w-64 h-64 lg:w-80 lg:h-80">
                        <!-- Glow trasero -->
                        <div class="absolute -inset-1 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-[2rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

                        <!-- Contenedor Imagen -->
                        <div class="relative w-full h-full rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 ring-1 ring-white/5 shadow-2xl">
                            <!-- Overlay al hacer hover (opcional) -->
                            <div class="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-10"></div>

                            <img src="https://avatars.githubusercontent.com/u/74162376?v=4"
                                 alt="Raul Anto"
                                 class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0">
                        </div>

                        <!-- Elemento decorativo flotante -->
                        <div class="absolute -bottom-4 -right-4 w-12 h-12 bg-[#050505] rounded-xl border border-white/10 flex items-center justify-center shadow-lg z-20 group-hover:translate-y-[-5px] transition-transform duration-300">
                            <span class="text-2xl">💻</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<style scoped>
/* Optimizaciones para asegurar contraste y legibilidad */
</style>