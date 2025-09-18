<template>
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <canvas
            ref="canvasRef"
            class="absolute inset-0 w-full h-full"
            :width="dimensions.width"
            :height="dimensions.height"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

interface Point {
    x: number
    y: number
    originX: number
    originY: number
    vx: number
    vy: number
}

interface Dimensions {
    width: number
    height: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const dimensions = ref<Dimensions>({ width: 0, height: 0 })
const animationId = ref<number>(0)
const points = ref<Point[][]>([])
const mouse = ref({ x: 0, y: 0 })

// Configuración
const config = {
    gridSize: 30, // Tamaño de la cuadrícula
    mouseRadius: 200, // Radio de influencia del mouse
    mouseStrength: 0.3, // Fuerza de atracción/repulsión
    returnSpeed: 0.08,
    noiseScale: 0.001, // Escala del ruido
    timeScale: 0.0008,

    colors: {
        primary: 'rgba(59, 130, 246, 0.15)', // blue-500 con opacidad
        secondary: 'rgba(37, 99, 235, 0.08)', // blue-600 con opacidad
        stroke: 'rgba(96, 165, 250, 0.2)', // blue-400 con opacidad
        glow: 'rgba(147, 197, 253, 0.3)' // blue-300 con opacidad
    }
}

// Función de ruido simple (Perlin-like)
const noise = (x: number, y: number, time: number): number => {
    const nx = x * config.noiseScale + time * config.timeScale
    const ny = y * config.noiseScale + time * config.timeScale
    return Math.sin(nx * 2) * Math.cos(ny * 2) * 0.5 +
        Math.sin(nx * 3.7) * Math.cos(ny * 3.7) * 0.3 +
        Math.sin(nx * 7.3) * Math.cos(ny * 7.3) * 0.2
}

// Inicializar puntos de la malla
const initializePoints = () => {
    const cols = Math.ceil(dimensions.value.width / config.gridSize) + 2
    const rows = Math.ceil(dimensions.value.height / config.gridSize) + 2

    points.value = []

    for (let i = 0; i < rows; i++) {
        points.value[i] = []
        for (let j = 0; j < cols; j++) {
            const x = j * config.gridSize - config.gridSize
            const y = i * config.gridSize - config.gridSize

            points.value[i][j] = {
                x,
                y,
                originX: x,
                originY: y,
                vx: 0,
                vy: 0
            }
        }
    }
}

// Actualizar dimensiones del canvas
const updateDimensions = () => {
    if (!canvasRef.value) return

    dimensions.value = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    initializePoints()
}


// Animar puntos
const animatePoints = (time: number) => {
    points.value.forEach((row, i) => {
        row.forEach((point, j) => {
            // Aplicar ruido para movimiento orgánico
            const noiseValue = noise(point.originX, point.originY, time)
            const targetX = point.originX + noiseValue * 30
            const targetY = point.originY + noiseValue * 30

            // Calcular distancia al mouse
            const dx = mouse.value.x - point.x
            const dy = mouse.value.y - point.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Aplicar fuerza del mouse si está cerca
            if (distance < config.mouseRadius) {
                const force = (1 - distance / config.mouseRadius) * config.mouseStrength
                point.vx += (dx / distance) * force * 10
                point.vy += (dy / distance) * force * 10
            }

            // Aplicar fuerza de retorno
            point.vx += (targetX - point.x) * config.returnSpeed
            point.vy += (targetY - point.y) * config.returnSpeed

            // Aplicar fricción
            point.vx *= 0.95
            point.vy *= 0.95

            // Actualizar posición
            point.x += point.vx
            point.y += point.vy
        })
    })
}

// Dibujar la malla
const drawMesh = (ctx: CanvasRenderingContext2D) => {
    // Limpiar canvas
    ctx.clearRect(0, 0, dimensions.value.width, dimensions.value.height)

    // Crear gradiente radial desde el centro
    const centerX = dimensions.value.width / 2
    const centerY = dimensions.value.height / 2
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.max(dimensions.value.width, dimensions.value.height) * 0.7
    )
    gradient.addColorStop(0, config.colors.glow)
    gradient.addColorStop(0.5, config.colors.primary)
    gradient.addColorStop(1, 'transparent')

    // Dibujar triángulos/polígonos
    ctx.strokeStyle = config.colors.stroke
    ctx.lineWidth = 1

    for (let i = 0; i < points.value.length - 1; i++) {
        for (let j = 0; j < points.value[i].length - 1; j++) {
            const p1 = points.value[i][j]
            const p2 = points.value[i][j + 1]
            const p3 = points.value[i + 1][j]
            const p4 = points.value[i + 1][j + 1]

            // Calcular distancia al centro para fade
            const distToCenter = Math.sqrt(
                Math.pow(p1.x - centerX, 2) + Math.pow(p1.y - centerY, 2)
            )
            const maxDist = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2))
            const opacity = Math.max(0, 1 - (distToCenter / maxDist) * 1.2)

            // Dibujar líneas con opacidad variable
            ctx.globalAlpha = opacity * 0.3
            ctx.fillStyle = gradient

            // Dibujar triángulos
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.lineTo(p3.x, p3.y)
            ctx.closePath()
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(p2.x, p2.y)
            ctx.lineTo(p3.x, p3.y)
            ctx.lineTo(p4.x, p4.y)
            ctx.closePath()
            ctx.fill()

            // Dibujar bordes
            ctx.globalAlpha = opacity * 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.lineTo(p4.x, p4.y)
            ctx.lineTo(p3.x, p3.y)
            ctx.closePath()
            ctx.stroke()
        }
    }

    ctx.globalAlpha = 1
}

// Loop de animación
const animate = () => {
    const ctx = canvasRef.value?.getContext('2d')
    if (!ctx) return

    const time = Date.now()

    animatePoints(time)
    drawMesh(ctx)

    animationId.value = requestAnimationFrame(animate)
}

// Lifecycle hooks
onMounted(() => {
    updateDimensions()


    // Iniciar animación
    animate()

    // Animar entrada inicial
    gsap.from(canvasRef.value, {
        opacity: 0,
        duration: 2,
        ease: 'power2.inOut'
    })
})

onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)

    if (animationId.value) {
        cancelAnimationFrame(animationId.value)
    }
})
</script>

<style scoped>
canvas {

    filter: contrast(1.1) brightness(1.05);
}
</style>