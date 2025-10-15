<script setup lang="ts">


import ListaBlog from "~/components/global/listaBlog.vue";
import About from "~/components/auth/about.vue";

import GradualBlur from "~/components/ui/GradualBlur.vue";
import type {NavigationMenuItem} from "@nuxt/ui";
import CarruselCardSt from "~/components/ui/carruselCardSt.vue";

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
        label: 'Linkedin',
        to: 'https://www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185/',
        target: '_blank'
    }
])

</script>

<template>

    <main class="relative h-screen max-w-screen overflow-hidden">

        <section class="overflow-y-auto h-screen">
            <UBanner icon="i-lucide-info" title="Esta Pagina aun sigue en construccion." />

            <lazy-navar :items="items"/>
            <LazyHeader/>
            <about/>

            <Tecologia/>

            <lista-blog/>
            <LazyContacto/>


            <LazyFooter/>
        </section>

        <GradualBlur
            target="parent"
            position="bottom"
            height="6rem"
            :strength="2"
            :divCount="5"
            curve="bezier"
            :exponential="true"
            :opacity="2"
        />
    </main>


</template>

<style scoped>
html {
    scroll-behavior: smooth;

}


</style>

