<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";
import GradientBlinds from "~/components/ui/GradientBlinds.vue";


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
    ogDescription: 'Sitios web con carga instantánea + sistemas empresariales hechos a tu medida. Next.js, Nuxt, Vue, Node.js, Tailwind y más.',
    ogImage: '/img_2.png',        // ← pon aquí tu imagen OG (1200x630 recomendado)
    ogUrl: 'https://tu-dominio.com',
    ogType: 'website',
    ogLocale: 'es_ES',

    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterSite: '@tu-usuario-twitter',                    // opcional, si tienes
    twitterCreator: '@tu-usuario-twitter',                 // opcional
    twitterTitle: 'Desarrollador Freelance | Web Ultra-rápida + ERP y CRM a Medida',
    twitterDescription: 'Sitios web que cargan en <1s y sistemas empresariales 100% personalizados. Portfolio y servicios.',
    twitterImage: '/img_2.png',   // misma imagen que OG suele funcionar perfecto
})
</script>

<template>
    <Navar :items="items"></Navar>
    <div  class="relative w-full min-h-screen overflow-hidden grid-background fondo">

        <!-- Grid Background -->
        <div class="absolute max-h-screen w-full">
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
        </div>

        <UContainer class="h-full">
            <div class="relative z-10 w-full min-h-screen flex items-center py-12 md:py-16 lg:py-20">
                <section>
                    <p class="font-sans text-4xl font-bold text-neutral-200 max-w-5xl lg:text-7xl lg:pr-24 md:text-6xl">
                        Simplifico tu mundo digital, en cualquier dispositivo.
                    </p>
                    <div class="h-10"></div>
                    <p class="max-w-2xl serif-text text-xl text-neutral-400 md:text-2xl">
                        Tienes una idea que necesita una solución digital? Ya sea una potente aplicación de escritorio o una página web moderna y funcional, yo la hago realidad.
                    </p>

                </section>
            </div>
        </UContainer>
    </div>

    <main class="bg-neutral-950 text-white min-h-screen">
        <div class="container mx-auto px-6 py-16 lg:px-12 lg:py-24">

            <!-- Hero: Sitios Web Estáticos -->
            <section class="grid lg:grid-cols-2 gap-12 items-center mb-32">
                <div class="space-y-8">
        <span
            class="inline-block text-2xl font-medium bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
          Sitios Web Modernos
        </span>
                    <h1 class="text-5xl lg:text-6xl font-bold leading-tight">
                        Aplicaciones Web Estáticas<br/>
                        <span class="text-emerald-400">Ultrarrápidas y Seguras</span>
                    </h1>
                    <p class="text-xl text-neutral-400 leading-relaxed max-w-xl">
                        ¿Necesitas una presencia web que cargue en milisegundos, sea imposible de hackear y cueste casi
                        nada mantener?
                        Desarrollo sitios estáticos con las tecnologías más modernas: Next.js, Astro, Tailwind y
                        despliegues en Vercel/Netlify.
                    </p>

                    <div class="grid sm:grid-cols-2 gap-8 pt-8 border-t border-neutral-800">
                        <div class="group">
                            <h3 class="font-semibold text-emerald-400 mb-2">Velocidad Extrema</h3>
                            <p class="text-neutral-400">Carga inmediata que enamora a Google y a tus visitantes</p>
                        </div>
                        <div class="group">
                            <h3 class="font-semibold text-emerald-400 mb-2">SEO Imbatible</h3>
                            <p class="text-neutral-400">Posicionamiento natural desde el primer día</p>
                        </div>
                    </div>
                </div>

                <div class="relative">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-3xl blur-3xl"></div>
                    <img
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&crop=center"
                        alt="Desarrollo web moderno"
                        class="relative rounded-2xl shadow-2xl border border-neutral-800 hover:scale-105 transition-transform duration-500"/>
                </div>
            </section>

            <!-- ERP a Medida -->
            <section class="grid lg:grid-cols-3 gap-12 items-center mb-32">
                <div class="lg:col-span-2 space-y-8 order-2 lg:order-1">
                    <div>
          <span
              class="inline-block text-2xl font-medium bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            Software a Medida
          </span>
                        <h2 class="text-4xl lg:text-5xl font-bold mt-2">Sistemas ERP a Medida</h2>
                    </div>
                    <p class="text-xl text-neutral-300">
                        Deja de pagar licencias abusivas. Te construyo un ERP 100% adaptado a tus procesos reales:
                        fabricación, inventarios, contabilidad, RRHH, compras y ventas.
                    </p>

                    <div class="grid md:grid-cols-3 gap-6 pt-8 border-t border-neutral-800">
                        <div
                            class="bg-neutral-900/50 backdrop-blur p-6 rounded-xl border border-neutral-800 hover:border-cyan-500 transition-colors">
                            <h4 class="font-semibold text-cyan-400 mb-3">Producción</h4>
                            <p class="text-sm text-neutral-400">MRP, control de calidad, mantenimiento preventivo</p>
                        </div>
                        <div
                            class="bg-neutral-900/50 backdrop-blur p-6 rounded-xl border border-neutral-800 hover:border-cyan-500 transition-colors">
                            <h4 class="font-semibold text-cyan-400 mb-3">Recursos Humanos</h4>
                            <p class="text-sm text-neutral-400">Nóminas, reclutamiento, control horario,
                                evaluaciones</p>
                        </div>
                        <div
                            class="bg-neutral-900/50 backdrop-blur p-6 rounded-xl border border-neutral-800 hover:border-cyan-500 transition-colors">
                            <h4 class="font-semibold text-cyan-400 mb-3">Analítica & BI</h4>
                            <p class="text-sm text-neutral-400">Dashboards interactivos y reportes en tiempo real</p>
                        </div>
                    </div>
                </div>

                <div class="relative order-1 lg:order-2">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                         alt="ERP a medida"
                         class="rounded-2xl shadow-2xl border border-neutral-800"/>
                </div>
            </section>

            <!-- CRM a Medida -->
            <section class="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <div class="space-y-8">
                    <h2 class="text-4xl lg:text-5xl font-bold">
                        Sistemas CRM <span class="text-green-400">a Medida</span>
                    </h2>
                    <p class="text-xl text-neutral-300">
                        No más oportunidades perdidas. Un CRM hecho exactamente para tu forma de vender: seguimiento
                        automático, scoring de leads, pipeline visual y notificaciones inteligentes.
                    </p>

                    <div class="grid grid-cols-2 gap-6 pt-8 border-t border-neutral-800">
                        <div
                            class="bg-neutral-900/70 backdrop-blur-sm p-6 rounded-xl border border-neutral-800 hover:border-green-500 transition-all hover:-translate-y-1">
                            <h4 class="font-semibold text-green-400">Dashboard en Tiempo Real</h4>
                        </div>
                        <div
                            class="bg-neutral-900/70 backdrop-blur-sm p-6 rounded-xl border border-neutral-800 hover:border-green-500 transition-all hover:-translate-y-1">
                            <h4 class="font-semibold text-green-400">Pipeline Visual Drag & Drop</h4>
                        </div>
                    </div>
                </div>

                <div class="relative">
                    <img src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&h=600&fit=crop"
                         alt="CRM dashboard"
                         class="rounded-2xl shadow-2xl border border-neutral-800"/>
                </div>
            </section>

            <!-- Gestión de Proyectos -->
            <section class="grid lg:grid-cols-3 gap-12 items-center">
                <div class="lg:col-span-2 space-y-8">
                    <div>
          <span
              class="inline-block text-2xl font-medium bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Gestión de Proyectos
          </span>
                        <h2 class="text-4xl lg:text-5xl font-bold mt-2">
                            Del caos al control total
                        </h2>
                    </div>
                    <p class="text-xl text-neutral-300">
                        Planifica recursos, asigna tareas y visualiza el progreso en tiempo real. Gantt, Kanban,
                        burndown charts y alertas automáticas.
                    </p>

                    <div class="grid md:grid-cols-3 gap-6 pt-8">
                        <div
                            class="bg-gradient-to-br from-blue-500/10 to-transparent p-6 rounded-xl border border-blue-500/30">
                            <h4 class="font-semibold text-blue-400">Gantt + Kanban</h4>
                        </div>
                        <div
                            class="bg-gradient-to-br from-blue-500/10 to-transparent p-6 rounded-xl border border-blue-500/30">
                            <h4 class="font-semibold text-blue-400">Control de Tiempo</h4>
                        </div>
                        <div
                            class="bg-gradient-to-br from-blue-500/10 to-transparent p-6 rounded-xl border border-blue-500/30">
                            <h4 class="font-semibold text-blue-400">Dashboards en Vivo</h4>
                        </div>
                    </div>
                </div>

                <div>
                    <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
                         alt="Gestión de proyectos"
                         class="rounded-2xl shadow-2xl border border-neutral-800 w-full"/>
                </div>
            </section>

            <!-- CTA Final (opcional) -->
            <div class="text-center mt-32">
                <h2 class="text-4xl lg:text-5xl font-bold mb-8">
                    ¿Listo para llevar tu negocio al siguiente nivel?
                </h2>
                <a href="#contacto"
                   class="inline-block px-12 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-lg rounded-full hover:scale-105 transition-transform">
                    Hablemos de tu proyecto →
                </a>
            </div>

        </div>
    </main>
    <contacto/>
    <footer-porta></footer-porta>
</template>

