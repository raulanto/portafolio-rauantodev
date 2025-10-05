<script setup lang="ts">


import ListaBlog from "~/components/global/listaBlog.vue";
import About from "~/components/auth/about.vue";
import AllkeyTec from "~/components/ui/allkeyTec.vue";
import GradualBlur from "~/components/ui/GradualBlur.vue";
const handleCardClick = (index: number) => {
    console.log(`Card ${index} clicked`);
};
</script>

<template>
    <main class="relative h-screen max-w-screen overflow-hidden">
        <section class="overflow-y-auto h-screen">
            <UBanner icon="i-lucide-info" title="Esta Pagina aun sigue en construccion." />
            <lazy-navar/>
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

