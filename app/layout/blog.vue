<script setup lang="ts">

</script>

<template>

    <div class="relative w-full flex flex-col min-h-screen items-center justify-start gap-4  " >
        <main class="w-full flex-1 px-4 pb-[1rem] flex flex-col items-stretch max-w-[var(--content-width)] fondo">
            <slot></slot>
        </main>
    </div>
</template>

<style scoped>
.fondo {
    background: radial-gradient(ellipse 85% 90% at 50% 0%, rgba(62, 146, 250, 0.59), transparent 70%);
}
</style>