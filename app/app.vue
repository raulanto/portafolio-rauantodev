<template>
    <UApp>
        <Cursor/>
        <NuxtPage />
    </UApp>
    <Analytics/>

</template>
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import Cursor from "~/components/ui/cursor.vue";


useSeoMeta({
    ogImage: '/img_1.png',
});




</script>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>