<script setup lang="ts">


import ListaBlog from "~/components/global/listaBlog.vue";
import About from "~/components/auth/about.vue";

import GradualBlur from "~/components/ui/GradualBlur.vue";
import type {NavigationMenuItem} from "@nuxt/ui";

const route = useRoute()
const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Proyectos',
        to: '#proyectos',
        active: route.path.startsWith('/docs/getting-started')
    },
    {
        label: 'Contacto',
        to: '#contacto',
        active: route.path.startsWith('/docs/components')
    },
    {
        label: 'Blog',
        to: '#blog',
        active: route.path.startsWith('/docs/components')
    },
    {
        label: 'Cv',
        to: '/perfil/cv',

    },
    {
        label: 'Servicios Free lancer',
        to: '/servicios',

    },
    {
        label: 'Linkedin',
        to: 'https://www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185/',
        target: '_blank'
    }
])

</script>

<template>

    <main class="relative h-screen max-w-screen overflow-hidden">

        <section class="overflow-y-auto h-screen">

            <lazy-navar :items="items"/>
            <LazyHeader/>
            <about/>

            <Tecologia/>

            <lista-blog/>
            <LazyContacto/>


            <LazyFooterPorta/>
        </section>


    </main>


</template>

<style scoped>
html {
    scroll-behavior: smooth;

}


</style>

