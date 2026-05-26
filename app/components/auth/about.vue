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
        size: Math.random() * 1.5 + 0.5,
        opacity: 0,
        fadeSpeed: Math.random() * 0.01 + 0.005,
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
        if (particle.opacity >= 0.6) {
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

    const particleCount = 50
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
    <section id="about" class="w-full bg-[#0a0a0a] text-white border-t border-white/5 relative z-10 selection:bg-purple-500 selection:text-white overflow-hidden">
        
        <!-- CANVAS PARTÍCULAS -->
        <canvas
            ref="canvasRef"
            class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-70"
        ></canvas>

        <div class="relative z-10 max-w-screen-2xl mx-auto p-8 lg:p-12 xl:p-16 py-24 sm:py-32">
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                
                <!-- TEXT COLUMN -->
                <div class="flex flex-col gap-8 order-2 lg:order-1">
                    
                    <div class="flex flex-col gap-4">
                        <span class="text-sm font-medium text-gray-500 tracking-widest uppercase">Sobre mí</span>
                        <h1 class="serif-text text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.9] tracking-tight">
                            Raúl Antonio.
                        </h1>
                        <h2 class="text-xl lg:text-2xl font-medium text-gray-400 mt-2">
                            Full Stack Developer
                        </h2>
                    </div>

                    <!-- Contact Details / Quick Info -->
                    <div class="flex flex-wrap gap-6 my-2">
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <span class="w-2 h-2 rounded-full bg-green-500"></span>
                            Disponible
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                            México
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                            raulantodev@gmail.com
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <UIcon name="i-heroicons-phone" class="w-4 h-4" />
                            +52 993 671 9807
                        </div>
                    </div>

                    <p class="text-base sm:text-lg text-gray-300 leading-relaxed font-light max-w-xl">
                        Apasionado desarrollador web con más de <span class="text-white font-medium">2 años de experiencia</span> creando soluciones digitales escalables. Especializado en el ecosistema <span class="text-white font-medium">Nuxt, Vue y Django</span>. Me enfoco en escribir código limpio y construir interfaces que conviertan problemas complejos en experiencias fluidas y eficientes.
                    </p>

                    <div class="pt-4">
                        <UButton 
                            to="/perfil/cv"
                            class="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm sm:text-base font-bold hover:bg-gray-200 transition-all w-fit"
                            variant="solid"
                            color="white"
                            size="xl"
                        >
                            Ver mi currículum
                            <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
                        </UButton>
                    </div>

                </div>

                <!-- IMAGE COLUMN -->
                <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <div class="relative w-full max-w-[440px] aspect-square rounded-[2.5rem] overflow-hidden bg-[#111111] border border-white/5 p-4 sm:p-6 transition-all hover:border-white/10">
                        <div class="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-[#1a1a1a]">
                            <img src="https://avatars.githubusercontent.com/u/74162376?v=4"
                                 alt="Raul Antonio"
                                 class="w-full h-full object-cover grayscale opacity-90 hover:opacity-100 hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out">
                            <!-- Overlay de contraste -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<style scoped>
/* Mantenemos el archivo limpio, las utilidades de Tailwind manejan la estructura y el estilo */
</style>