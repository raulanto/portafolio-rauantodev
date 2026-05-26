<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const route = useRoute()
const items = computed<NavigationMenuItem[]>(() => [
    { label: 'Proyectos', to: '#proyectos' },
    { label: 'Contacto', to: '#contacto' },
    { label: 'Blog', to: '#blog' },
    { label: 'Cv', to: '/perfil/cv' },
    { label: 'Servicios Freelancer', to: '/servicios' },
    { label: '+52 993 671 9807' },
    {
        label: 'Linkedin',
        to: 'https://www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185/',
        target: '_blank'
    }
])
</script>

<template>
    <div class="w-full min-h-screen font-sans text-white selection:bg-purple-500 selection:text-white flex flex-col bg-[#0a0a0a]">

        <!-- HERO WRAPPER (CON IMAGEN) -->
        <div class="relative w-full flex-1 flex flex-col overflow-hidden fondo">
            
            <!-- FONDO ORIGINAL -->
            <div class="absolute inset-0 pointer-events-none z-0">
                <img src="../../assets/img/HI_IksJW8AAJYD_.jpeg"
                     alt="Fondo Abstracto"
                     class="absolute inset-0 h-full w-full object-cover object-top opacity-50 transition-opacity duration-500"
                />
                <div class="absolute inset-0
                bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]
                [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
                </div>
                <div class="absolute inset-0 bg-black/40"></div>
            </div>

            <!-- NAVBAR ORIGINAL -->
            <LazyNavar :items="items" class="relative z-50 w-full" />

            <!-- SECCIÓN PRINCIPAL (COMPOSICIÓN VELIX ADAPTADA) -->
            <section class="relative z-10 flex-1 w-full max-w-screen-2xl mx-auto p-8 lg:p-12 xl:p-16 flex flex-col justify-end pb-20">
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end w-full">
                    
                    <!-- Lado Izquierdo: Título Grande -->
                    <div class="flex flex-col gap-4">
                        <span class="text-lg font-medium opacity-80 text-gray-400">©2026</span>
                        <h1 class="serif-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight">
                            CREANDO<br>
                            EL FUTURO WEB*
                        </h1>
                    </div>

                    <!-- Lado Derecho: Descripción y Botón -->
                    <div class="flex flex-col items-start lg:items-end w-full">
                        <div class="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                            <p class="text-sm sm:text-base text-gray-300 max-w-[300px] leading-relaxed">
                                Desarrollo experiencias digitales inmersivas, escalables y centradas en el usuario utilizando las tecnologías más modernas.
                            </p>
                            
                            <UButton 
                                to="#contacto"
                                class="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm sm:text-base font-bold hover:bg-gray-200 transition-all group"
                                variant="solid"
                                color="white"
                                size="xl"
                            >
                                Hablemos
                                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </UButton>
                        </div>
                    </div>
                </div>
                
            </section>
        </div>

        <!-- SECCIÓN INFERIOR: ESTADÍSTICAS Y ACERCA DE MÍ (COLOR SÓLIDO) -->
        <section class="w-full bg-background relative z-10 border-t border-white/5">
            <div class="max-w-screen-2xl mx-auto p-8 lg:p-12 xl:p-16">
                
                <div class="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
                    <div class="mt-4">
                        <UButton 
                            to="#about"
                            class="flex items-center gap-3 bg-white/5 text-white pl-4 pr-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition border border-white/10"
                            variant="ghost"
                        >
                            Más sobre mí
                            <UIcon name="i-heroicons-arrow-down" class="w-4 h-4 text-white ml-1" />
                        </UButton>
                    </div>

                    <div class="max-w-2xl text-left lg:text-right text-gray-200 relative">
                        <h2 class="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight">
                            Hola 👋, soy un desarrollador y diseñador web, dando vida a experiencias digitales con código limpio, movimiento expresivo e interacción fluida.
                        </h2>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-white/5">
                    <div class="flex flex-col gap-2">
                        <span class="text-5xl font-bold text-white">21+</span>
                        <h3 class="font-semibold text-gray-200 mt-2">Sitios lanzados</h3>
                        <p class="text-sm text-gray-400 leading-relaxed">Ayudando a marcas a elevar su presencia online con confianza.</p>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-5xl font-bold text-white">2M+</span>
                        <h3 class="font-semibold text-gray-200 mt-2">Usuarios alcanzados</h3>
                        <p class="text-sm text-gray-400 leading-relaxed">Soluciones escalables que conectan e inspiran globalmente.</p>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-5xl font-bold text-white">99%</span>
                        <h3 class="font-semibold text-gray-200 mt-2">Satisfacción de clientes</h3>
                        <p class="text-sm text-gray-400 leading-relaxed">Construimos relaciones basadas en confianza y resultados.</p>
                    </div>
                    <div class="flex flex-col gap-2">
                        <span class="text-5xl font-bold text-white">5+</span>
                        <h3 class="font-semibold text-gray-200 mt-2">Años de experiencia</h3>
                        <p class="text-sm text-gray-400 leading-relaxed">Desarrollando soluciones innovadoras en el ecosistema web.</p>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>

<style scoped>
/* ESTILO DEL FONDO ORIGINAL */
.fondo {
    background: radial-gradient(ellipse 85% 90% at 50% 0%, rgba(129, 25, 255, 0.4), transparent 70%), #0a0a0a;
}

/* Ajustes finos de tipografía */
h1 {
    font-feature-settings: "ss01", "ss02", "cv01", "cv02";
}
</style>