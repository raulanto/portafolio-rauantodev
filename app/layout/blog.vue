<script setup lang="ts">

</script>

<template>

    <div class="relative w-full flex flex-col min-h-screen items-center justify-start gap-4">
        <LazyNavar/>
        <main class="w-full flex-1 px-4 pb-[1rem] flex flex-col items-stretch max-w-[var(--content-width)]">
            <slot></slot>
        </main>
    </div>
</template>

<style scoped>

</style>