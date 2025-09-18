<template>
    <canvas ref="cosmosCanvas" class="z-0 cosmos-canvas "></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const cosmosCanvas = ref(null);

onMounted(() => {
    const canvas = cosmosCanvas.value;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const numParticles = 100;

    class Particle {
        constructor(x, y, radius, speed) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.speed = speed;
            this.angle = Math.random() * Math.PI * 2;
            this.opacity = 0; // empieza invisible
            this.maxOpacity = 0.8;
            this.spawnDelay = Math.random() * 2000; // ms de retraso antes de aparecer
            this.spawnTime = performance.now();
        }

        update() {
            // Movimiento
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            // Rebote
            if (this.x < 0 || this.x > canvas.width) this.angle = Math.PI - this.angle;
            if (this.y < 0 || this.y > canvas.height) this.angle = -this.angle;

            // Aparición gradual (fade-in con delay)
            const elapsed = performance.now() - this.spawnTime;
            if (elapsed > this.spawnDelay && this.opacity < this.maxOpacity) {
                this.opacity += 0.01; // velocidad del fade
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Inicializar partículas
    for (let i = 0; i < numParticles; i++) {
        particles.push(
            new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 4 + 1,
                Math.random() * 0.5 + 0.2
            )
        );
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dist = Math.hypot(
                    particles[a].x - particles[b].x,
                    particles[a].y - particles[b].y
                );

                if (dist < 120) {
                    const opacity =
                        Math.min(particles[a].opacity, particles[b].opacity) *
                        (1 - dist / 120);
                    if (opacity > 0) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    let animationId;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    animate();

    // cleanup
    onUnmounted(() => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", resizeCanvas);
    });
});
</script>

<style scoped>
.cosmos-canvas {
    position: absolute;
    width: 100%; /* ocupa todo el ancho */
    height: 100%; /* ocupa todo el alto */
    filter: sepia(70%) brightness(1.2) contrast(1.1);
}
</style>
