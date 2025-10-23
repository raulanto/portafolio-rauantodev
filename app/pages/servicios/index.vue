<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";
import GradientBlinds from "~/components/ui/GradientBlinds.vue";
useSeoMeta({
    ogImage: '/img_2.png',
});
const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Cv',
        to: '/perfil/cv',

    },
    {
        label: 'Linkedin',
        to: 'https://www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185/',
        target: '_blank'
    }
])

</script>

<template>
    <Navar :items="items"></Navar>
    <div  class="relative w-full min-h-screen overflow-hidden grid-background fondo">

        <!-- Grid Background -->
        <div class="absolute max-h-screen w-full">
            <GradientBlinds
                :gradient-colors="['#054cf5', '#182FFF']"
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

    <main class="bg-gradient-to-br from-neutral-900 to-black">
        <div class="text-neutral-300 container mx-auto p-8 overflow-hidden md:rounded-lg md:p-10 lg:p-12">
            <div class="grid gap-8 md:grid-cols-2">
                <div class="flex flex-col justify-center">
                    <p
                        class="self-start inline font-sans text-xl font-medium text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">
                        Sitios Web Modernos
                    </p>
                    <h2 class="text-4xl font-bold">Aplicaciones Web Estáticas</h2>
                    <div class="h-6"></div>
                    <p class="font-serif text-xl text-neutral-400 md:pr-10">
                        ¿Necesitas una presencia web ultrarrápida, segura y confiable? Desarrollo sitios web ligeros y escalables, ideales para portafolios, landing pages y sitios corporativos. Obtén velocidad extrema, máxima seguridad y costos de hosting mínimos.
                    </p>
                    <div class="h-8"></div>
                    <div class="grid grid-cols-2 gap-4 pt-8 border-t border-neutral-800">
                        <div>
                            <p class="font-semibold text-neutral-400">Sistemas Modernos</p>
                            <div class="h-4"></div>
                            <p class="font-serif text-neutral-400">
                                Atrae a tus clientes con una experiencia de carga inmediata.
                            </p>
                        </div>
                        <div>
                            <p class="font-semibold text-neutral-400">SEO</p>
                            <div class="h-4"></div>
                            <p class="font-serif text-neutral-400">
                                Presencia online corporativa, siempre disponible y de bajo mantenimiento.
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        class="-mr-24 rounded-lg md:rounded-l-full bg-gradient-to-br from-neutral-900 to-black h-96">

                    </div>
                </div>
            </div>

            <div class="h-40"></div>
            <p class="font-serif text-4xl">
                <span class="text-neutral-400">Consigue una presencia web impecable, sin lo complicado.</span>


            </p>

            <div class="h-40"></div>

            <div class="grid gap-8 md:grid-cols-3">
                <div class="flex flex-col justify-center md:col-span-2">
                    <p
                        class="self-start inline font-sans text-xl font-medium text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-teal-600">
                        Software a Medida
                    </p>
                    <h2 class="text-4xl font-bold">Sistemas ERP a Medidar</h2>
                    <div class="h-6"></div>
                    <p class="font-serif text-xl text-neutral-400 md:pr-10">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam
                        autem, a recusandae vero praesentium qui impedit doloremque
                        molestias.
                    </p>
                    <div class="h-8"></div>
                    <div class="grid gap-6 pt-8 border-t border-neutral-800 lg:grid-cols-3">
                        <div>
                            <p class="font-semibold text-neutral-400">Producción</p>
                            <div class="h-4"></div>
                            <p class="font-serif text-neutral-400">
                                Fabrica con eficiencia: Planificación de la producción (MRP), control de calidad y mantenimiento.
                            </p>
                        </div>
                        <div>
                            <p class="font-semibold text-neutral-400">Recursos Humanos</p>
                            <div class="h-4"></div>
                            <p class="font-serif text-neutral-400">
                                Gestiona tu equipo: Nóminas, reclutamiento, control de asistencia y evaluación del talento.
                            </p>
                        </div>
                        <div>
                            <p class="font-semibold text-neutral-400">Analítica & BI</p>
                            <div class="h-4"></div>
                            <p class="font-serif text-neutral-400">
                                Decide con datos: Dashboards interactivos y reportes personalizados para dirigir tu negocio con inteligencia.
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        class="-mr-24 rounded-lg md:rounded-l-full bg-gradient-to-br from-neutral-900 to-black h-96"></div>
                </div>
            </div>

            <div class="h-10 md:h-40"></div>

            <div class="grid gap-8 md:grid-cols-2">
                <div class="flex flex-col justify-center">
                    <p
                        class="self-start inline font-sans text-xl font-medium text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">

                    </p>
                    <h2 class="text-4xl font-bold">Sistemas CRM a Medida</h2>
                    <div class="h-6"></div>
                    <p class="font-serif text-xl text-neutral-400 md:pr-10">
                        ¿Pierdes oportunidades de venta? Un Sistema CRM es el centro de operaciones que tu equipo necesita para automatizar el seguimiento, personalizar la comunicación y cultivar relaciones rentables. Obtén una visión 360° de cada cliente y un embudo de ventas visual.
                    </p>
                    <div class="h-8"></div>
                    <div class="grid grid-cols-2 gap-4 pt-8 border-t border-neutral-800">
                        <div>
                            <p class="font-semibold text-neutral-400">Dashboards en Tiempo Real</p>
                            <div class="h-4"></div>

                        </div>
                        <div>
                            <p class="font-semibold text-neutral-400">Pipeline de Ventas Visual</p>
                            <div class="h-4"></div>

                        </div>
                    </div>
                </div>
                <div>
                    <div
                        class="-mr-24 rounded-lg md:rounded-l-full bg-gradient-to-br from-neutral-900 to-black h-96">

                    </div>
                </div>
            </div>
            <div class="h-10 md:h-40"></div>

            <div class="grid gap-8 md:grid-cols-3">
                <div class="flex flex-col justify-center md:col-span-2">
                    <p
                        class="self-start inline font-sans text-xl font-medium text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-600">
                        Sistemas de Gestión de Proyectos
                    </p>
                    <h2 class="text-4xl font-bold">Del caos al control: gestiona tus proyectos con precisión.</h2>
                    <div class="h-6"></div>
                    <p class="font-serif text-xl text-neutral-400 md:pr-10">
                        ¿Los plazos se te escapan? Desarrollamos el centro de mando que necesitas para mantener cada iniciativa organizada, visible y bajo control. Planifica recursos, asigna tareas y sigue el progreso en tiempo real para garantizar entregas exitosas.
                    </p>
                    <div class="h-8"></div>
                    <div class="grid gap-6 pt-8 border-t border-neutral-800 lg:grid-cols-3">
                        <div>
                            <p class="font-semibold text-neutral-400">Diagramas de Gantt y Tableros Kanban</p>
                            <div class="h-4"></div>

                        </div>
                        <div>
                            <p class="font-semibold text-neutral-400">Gestión de Tareas y Tiempo</p>
                            <div class="h-4"></div>

                        </div>
                        <div>
                            <p class="font-semibold text-neutral-400">Dashboards en Tiempo Real</p>
                            <div class="h-4"></div>

                        </div>
                    </div>
                </div>
                <div>
                    <div
                        class="-mr-24 rounded-lg md:rounded-l-full bg-gradient-to-br from-neutral-900 to-black h-96"></div>
                </div>
            </div>
        </div>
    </main>
    <contacto/>
    <footer-porta></footer-porta>
</template>

