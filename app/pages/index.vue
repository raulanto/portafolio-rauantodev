<script setup lang="ts">


import ListaBlog from "~/components/global/listaBlog.vue";
import About from "~/components/auth/about.vue";

</script>

<template>
    <UBanner icon="i-lucide-info" title="Esta Pagina aun sigue en construccion." />
    <lazy-navar/>
    <LazyHeader/>
    <about/>
    <Tecologia/>

    <lista-blog/>
    <LazyContacto/>
    <LazyInfo/>
    <LazyFooter/>
</template>

<style scoped>


</style>

