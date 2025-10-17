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

</style>