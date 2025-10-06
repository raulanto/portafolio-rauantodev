<template>

    <UApp>
        <NuxtPage />

    </UApp>

    <Analytics/>
</template>
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'


useSeoMeta({
    ogImage: '/porta.png',
});




</script>