<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const route = useRoute()
const items = computed<NavigationMenuItem[]>(() => [
    { label: 'Proyectos', to: '#proyectos' },
    { label: 'Contacto', to: '#contacto' },
    { label: 'Blog', to: '#blog' },
    { label: 'Cv', to: '/perfil/cv' },
    { label: 'Servicios Free lancer', to: '/servicios' },
    { label: '+52 993 671 9807' },
    {
        label: 'Linkedin',
        to: 'https://www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185/',
        target: '_blank'
    }
])


</script>

<template>
    <LazyNavar :items="items" />
    <div class="relative w-full min-h-screen overflow-hidden fondo">

        <div class="absolute inset-0">
            <img src="../../assets/img/G6cOUTsaAAATWlY.jpeg"
                 alt="Fondo Abstracto"
                 class="absolute inset-0 h-full w-full object-cover opacity-50 transition-opacity duration-500"
                 height="2304"
                 width="4096"
            />
            <div class="absolute inset-0
            bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]
            [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
            </div>
            <div class="absolute inset-0 bg-black/30"></div>
        </div>

        <UContainer class="relative z-10 h-full">
            <div class="w-full min-h-screen flex items-center justify-center py-12 md:py-24 lg:py-32">
                <section class="w-full max-w-4xl text-center">
                    <div class="mx-auto flex flex-col items-center">
                        <a href="#proyectos"
                           class="animated-gradient-border inline-flex items-center py-1 px-1 pr-3 sm:pr-4 mb-6 sm:mb-7 text-xs sm:text-sm rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all hover:ring-2 hover:ring-primary/50"
                           role="alert">
                            <span
                                class="text-xs bg-primary text-white dark:text-neutral-950 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mr-2 sm:mr-3 whitespace-nowrap font-semibold">
                                Nuevo
                            </span>
                            <span class="text-xs sm:text-sm text-neutral-800 dark:text-white font-medium truncate">
                                Creando Proyectos y Soluciones.
                            </span>
                            <svg class="ml-2 w-4 h-4 sm:w-5 sm:h-5 fill-neutral-800 dark:fill-neutral-200 flex-shrink-0" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </a>

                        <h1 class="mb-4 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-snug dark:text-white text-neutral-950 serif-text">
                            Creando el <span class="text-primary">futuro web</span>, una línea de código a la vez
                        </h1>


                        <div class="flex w-full justify-center items-center gap-3">
                            <UButton  to="#contacto" color="primary">Contacto</UButton>
                            <UButton  to="#about" color="neutral" variant="soft" icon="i-heroicons-information-circle">Sobre mí</UButton>
                        </div>
                    </div>
                </section>
            </div>
        </UContainer>
    </div>
</template>

<style scoped>
/* Estilo del fondo (el gradiente de color morado/azul) */
.fondo {
    background: radial-gradient(ellipse 85% 90% at 50% 0%, rgba(129, 25, 255, 0.57), transparent 70%);
}

/* --- Estilos de Borde Animado (sin cambios mayores, son efectivos) --- */
.animated-gradient-border {
    position: relative;
    overflow: hidden;
    /* Estilo fresco: Sombra sutil para el badge en modo claro */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Pseudo-elemento para el borde animado */
.animated-gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: linear-gradient(90deg,
    #771dd8 0%,
    #8635de 25%,
    #5709a9 50%,
    #c08df3 75%,
    #9240ea 100%
    );
    background-size: 200% 100%;
    border-radius: inherit;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    animation: gradient-border-move 2s linear infinite;
    z-index: -1;
}

@keyframes gradient-border-move {
    0% {
        background-position: 100% 0;
    }
    100% {
        background-position: -100% 0;
    }
}

.animated-gradient-border:hover {
    transform: translateY(-2px); /* Aumento el efecto hover */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

/* Las transiciones globales no son recomendadas; es mejor aplicarlas por elemento.
   He dejado la transición solo en el 'animated-gradient-border'.
   Mantuve 'serif-text' para el control de línea en móviles.
*/
@media (max-width: 640px) {
    .serif-text {
        line-height: 1.2;
    }
}

@media (min-width: 641px) and (max-width: 768px) {
    .serif-text {
        line-height: 1.3;
    }
}
</style>