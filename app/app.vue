<template>
    <lazy-ui-cursor/>
    <UApp>
        <NuxtPage />
    </UApp>
</template>
<script setup lang="ts">


useHead({
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#3e92fa' },
        { key: 'theme-color', name: 'theme-color' }
    ],
    link: [
        { rel: 'icon', href: '/icon.svg' }
    ],
    htmlAttrs: {
        lang: 'es'
    }
});

const title = 'rauantoDev';
const description = 'portafolio';

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
    // twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
    // twitterCard: 'summary_large_image'
});




</script>