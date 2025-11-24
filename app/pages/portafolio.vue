<script setup lang="ts">
import ListaBlog from "~/components/global/listaBlog.vue";
import About from "~/components/auth/about.vue";

import type {NavigationMenuItem} from "@nuxt/ui";
import Header_bg_img from "~/components/global/header_bg_img.vue";



</script>

<template>
    <main class="relative max-w-screen">



        <section>

            <header_bg_img/>
            <about/>

            <Tecologia/>

            <lista-blog/>
            <LazyContacto/>

            <LazyFooterPorta/>
        </section>


    </main>
</template>

<style>
/* El 'html' aquí afectará a toda la página */
html {
    scroll-behavior: smooth;
}
/* Asegura que el body no tenga h-screen o overflow oculto si no lo deseas */
body {
    min-height: 100vh;
}
</style>