<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";
import GradientBlinds from "~/components/ui/GradientBlinds.vue";
import list from "~/utils/proyectos";
import PostCard from "~/components/global/card/postCard.vue";


const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Cv',
        to: '/perfil/cv',

    },
    {
        label: 'Proyectos',
        to: '/proyectos',

    },
    {
        label: 'Linkedin',
        to: 'https://www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185/',
        target: '_blank'
    }
])


useSeoMeta({
    title: 'Desarrollador Freelance | Sitios Web Ultra-rápidos y Sistemas a Medida',
    description: 'Desarrollo aplicaciones web estáticas ultrarrápidas, ERP a medida, CRM personalizados y sistemas de gestión de proyectos. Tecnología moderna, rendimiento extremo y soluciones escalables para tu empresa.',

    // Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
    ogTitle: 'Desarrollador Freelance – Sitios Web Modernos y Sistemas ERP/CRM a Medida',
    ogDescription: 'Sitios web con carga instantánea + sistemas empresariales hechos a tu medida.  Nuxt, Vue, Node.js, Tailwind y más.',
    ogImage: '/img_5.png',        // ← pon aquí tu imagen OG (1200x630 recomendado)

    ogType: 'website',
    ogLocale: 'es_ES',

    // Twitter Card
    twitterCard: 'summary_large_image',

    twitterTitle: 'Desarrollador Freelance | Web Ultra-rápida + ERP y CRM a Medida',
    twitterDescription: 'Sitios web que cargan en <1s y sistemas empresariales 100% personalizados. Portfolio y servicios.',
    twitterImage: '/img_5.png',   // misma imagen que OG suele funcionar perfecto
})

const toast = useToast()



onMounted(async () => {
    const cookie = useCookie("cookie-consent");
    if (cookie.value === "accepted") {
        return;
    }

    toast.add({
        id: 'contact-info',
        title: '¡Hola! 👋 Soy rauantodev',
        description: 'Desarrollador Full-Stack especializado en Nuxt, Vue, Django y sistemas a medida.',
        icon: 'i-heroicons-hand-wave',
        color: 'primary',
        closeButton: {
            icon: 'i-heroicons-x-mark-20-solid',
            color: 'white',
            variant: 'link',
            padded: false
        },
        actions: [
            {
                label: 'WhatsApp',
                icon: 'i-simple-icons-whatsapp',
                color: 'success',
                onClick: (e) => window.open('https://wa.me/9336719807', '_blank')
            },
            {
                label: 'Email',
                icon: 'i-heroicons-envelope',
                onClick: (e) => window.location.href = 'mailto:raulantodev@gmail.com'
            },
            {
                label: 'LinkedIn',
                icon: 'i-simple-icons-linkedin',
                onClick: (e) => window.open('www.linkedin.com/in/raulanto', '_blank')
            }
        ]
    })
});

</script>

<template>
    <Navar :items="items"></Navar>
    <div class="relative w-full min-h-screen flex items-center bg-[#050505] text-white overflow-hidden selection:bg-purple-500 selection:text-white font-sans py-20">

        <!-- FONDO: GradientBlinds (Solicitado por el usuario) -->
        <div class="absolute inset-0 z-0 w-full h-full overflow-hidden">
            <GradientBlinds
                :gradient-colors="['#7905f5', '#7604ef']"
                :angle="0"
                :noise="0.3"
                :blind-count="12"
                :blind-min-width="50"
                :spotlight-radius="0.5"
                :spotlight-softness="1"
                :spotlight-opacity="1"
                :mouse-dampening="0.15"
                :distort-amount="0"
                shine-direction="left"
                mix-blend-mode="lighten"
            />
            <!-- Capa oscura sutil para asegurar legibilidad si el gradiente es muy brillante -->
            <div class="absolute inset-0 bg-black/20 pointer-events-none"></div>
        </div>

        <UContainer class="relative z-20 w-full">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                <!-- COLUMNA IZQUIERDA: Texto Modernizado -->
                <div class="flex flex-col gap-8">
                    <!-- Decoración pequeña -->
                    <div class="flex items-center gap-3">
                        <div class="h-[1px] w-12 bg-purple-500"></div>
                        <span class="text-purple-400 text-sm font-medium tracking-widest uppercase">Soluciones Digitales</span>
                    </div>

                    <h2 class="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                        Simplifico tu <br />
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                            mundo digital.
                        </span>
                    </h2>

                    <p class="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl border-l-2 border-white/10 pl-6">
                        ¿Tienes una idea que necesita una solución digital? Ya sea una potente <span class="text-white font-medium">aplicación de escritorio</span> o una <span class="text-white font-medium">web moderna</span> y funcional, yo la hago realidad.
                    </p>

                    <div class="pt-4">
                        <UButton
                            to="#contacto"
                            size="xl"
                            variant="solid"
                            class="rounded-full px-8 hover:scale-105 transition-transform duration-300  font-semibold"
                            trailing-icon="i-heroicons-arrow-right"
                        >
                            Hablemos de tu idea
                        </UButton>
                    </div>
                </div>

            </div>
        </UContainer>
    </div>
    <div class="relative w-full min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white font-sans overflow-hidden">

        <!-- FONDO: GradientBlinds (Fixed para efecto Parallax/Persistente) -->
        <div class="absolute inset-0 z-0 w-full h-full overflow-hidden">
            <GradientBlinds
                :gradient-colors="['#1a1a1a', '#050505', '#1e1b4b']"
                :angle="45"
                :noise="0.4"
                :blind-count="16"
                :blind-min-width="60"
                :spotlight-radius="0.6"
                :spotlight-softness="0.8"
                :spotlight-opacity="0.6"
                :mouse-dampening="0.1"
                :distort-amount="0.2"
                right
                mix-blend-mode="overlay"
            />
            <!-- Overlay oscuro para asegurar legibilidad del texto sobre el efecto -->
            <div class="absolute inset-0 bg-[#050505]/80 backdrop-blur-[2px]"></div>

            <!-- Textura de ruido global -->
            <div class="absolute inset-0 opacity-[0.05] mix-blend-overlay"
                 style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');">
            </div>
        </div>

        <div class="relative z-10 container mx-auto px-6 py-24 lg:px-12 lg:py-32 space-y-32">

            <!-- SECCIÓN 1: WEB MODERNOS (Emerald Theme) -->
            <section class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center group">
                <div class="space-y-8">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Sitios Web Modernos
                    </div>

                    <h1 class="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                        Webs Estáticas <br />
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                            Ultrarrápidas.
                        </span>
                    </h1>

                    <p class="text-lg text-gray-400 leading-relaxed border-l-2 border-emerald-500/20 pl-6">
                        ¿Necesitas una presencia web que cargue en milisegundos, sea imposible de hackear y cueste casi nada mantener?
                        Desarrollo sitios estáticos con el stack moderno: <span class="text-white">Next.js, Astro, Tailwind</span>.
                    </p>

                    <div class="grid sm:grid-cols-2 gap-6 pt-4">
                        <div class="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors">
                            <h3 class="font-bold text-emerald-400 mb-1 flex items-center gap-2">
                                <span class="i-heroicons-bolt text-lg"></span> Velocidad Extrema
                            </h3>
                            <p class="text-sm text-gray-500">Carga inmediata que enamora a Google.</p>
                        </div>
                        <div class="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors">
                            <h3 class="font-bold text-emerald-400 mb-1 flex items-center gap-2">
                                <span class="i-heroicons-chart-bar text-lg"></span> SEO Imbatible
                            </h3>
                            <p class="text-sm text-gray-500">Posicionamiento natural desde el día 1.</p>
                        </div>
                    </div>
                </div>

                <div class="relative lg:h-[500px] flex items-center justify-center">
                    <!-- Glow Effect -->
                    <div class="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>

                    <!-- Imagen con estilo Glass -->
                    <div class="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none z-10"></div>
                        <NuxtImg
                            format="webp"
                            loading="lazy"
                            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&crop=center"
                            alt="Desarrollo web moderno"
                            class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>
            </section>

            <!-- SECCIÓN 2: ERP A MEDIDA (Cyan Theme) -->
            <section class="grid lg:grid-cols-12 gap-12 items-center group">
                <div class="lg:col-span-7 space-y-8 order-2 lg:order-1">
                    <div>
                        <span class="text-cyan-400 font-medium tracking-wide text-sm mb-2 block uppercase">Software a Medida</span>
                        <h2 class="text-4xl lg:text-6xl font-bold text-white">
                            Sistemas ERP <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">a Medida</span>
                        </h2>
                    </div>

                    <p class="text-xl text-gray-400 max-w-2xl">
                        Deja de pagar licencias abusivas. Te construyo un ERP 100% adaptado a tus procesos reales: fabricación, inventarios, contabilidad y más.
                    </p>

                    <div class="grid md:grid-cols-3 gap-4 pt-6">
                        <div v-for="(item, idx) in ['Producción', 'Recursos Humanos', 'Analítica & BI']" :key="idx"
                             class="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 group/card">
                            <h4 class="font-semibold text-cyan-300 mb-2 group-hover/card:text-cyan-200">{{ item }}</h4>
                            <p class="text-xs text-gray-500 leading-relaxed">Control total y reportes en tiempo real para tu negocio.</p>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-5 relative order-1 lg:order-2">
                    <div class="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full opacity-30"></div>
                    <div class="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rotate-3 hover:rotate-0 transition-all duration-500">
                        <NuxtImg
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                            alt="ERP a medida"
                            format="webp"
                            loading="lazy"
                            class="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                        />
                    </div>
                </div>
            </section>

            <!-- POST CARD INTERMEDIO -->
            <div class="w-full max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">

                        <PostCard :post="list[2]" />

            </div>

            <!-- SECCIÓN 3: CRM & GESTIÓN (Split Layout) -->
            <div class="grid lg:grid-cols-2 gap-8 lg:gap-12">

                <!-- CRM (Green Theme) -->
                <div class="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors p-8 lg:p-12 flex flex-col justify-between h-full">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div class="relative z-10 space-y-6">
                        <h2 class="text-3xl lg:text-4xl font-bold">
                            CRM <span class="text-green-400">Inteligente</span>
                        </h2>
                        <p class="text-gray-400 text-lg">
                            Un CRM hecho para vender: seguimiento automático, pipeline visual y scoring de leads.
                        </p>

                        <ul class="space-y-3 mt-4">
                            <li class="flex items-center text-sm text-gray-300">
                                <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-3"></span> Dashboard en Tiempo Real
                            </li>
                            <li class="flex items-center text-sm text-gray-300">
                                <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-3"></span> Pipeline Visual Drag & Drop
                            </li>
                        </ul>
                    </div>

                    <div class="mt-8 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <NuxtImg
                            src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&h=600&fit=crop"
                            alt="CRM dashboard"
                            format="webp"
                            loading="lazy"
                            class="w-full h-48 object-cover object-top hover:scale-110 transition-transform duration-700"
                        />
                    </div>
                </div>

                <!-- PROJECT MANAGEMENT (Blue Theme) -->
                <div class="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors p-8 lg:p-12 flex flex-col justify-between h-full">
                    <div class="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div class="relative z-10 space-y-6">
                        <h2 class="text-3xl lg:text-4xl font-bold">
                            Gestión de <span class="text-blue-400">Proyectos</span>
                        </h2>
                        <p class="text-gray-400 text-lg">
                            Del caos al control total. Gantt, Kanban y alertas automáticas para tu equipo.
                        </p>
                        <div class="flex gap-2 mt-4">
                            <span class="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">Gantt</span>
                            <span class="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">Kanban</span>
                        </div>
                    </div>

                    <div class="mt-8 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <NuxtImg
                            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
                            alt="Gestión de proyectos"
                            format="webp"
                            loading="lazy"
                            class="w-full h-48 object-cover object-center hover:scale-110 transition-transform duration-700"
                        />
                    </div>
                </div>
            </div>

            <!-- CTA FINAL -->
            <div class="relative py-20 text-center">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-emerald-500 to-cyan-500 blur-[120px] opacity-20 rounded-full"></div>

                <h2 class="relative text-4xl lg:text-5xl font-bold mb-10 text-white">
                    ¿Listo para el siguiente nivel?
                </h2>

                <a href="#contacto"
                   class="relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-black transition-all duration-200 bg-white rounded-full hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black">
                    Hablemos de tu proyecto
                    <svg class="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </a>
            </div>

        </div>
    </div>
    <contacto/>
    <footer-porta></footer-porta>
</template>

<style scoped>
.perspective-1000 {
    perspective: 1000px;
}

@keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.animate-bounce-slow {
    animation: bounce-slow 4s ease-in-out infinite;
}
</style>