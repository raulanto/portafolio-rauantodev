<template>
    <div class="md:sticky md:top-[calc(var(--headline-height)+1rem)]">
        <div v-if="mounted" class="fixed top-0 left-0 h-[4px] bg-primary rounded-md z-[20001]!"
             :style="{ width: `${scrollPercentage}%` }"></div>
        <div class="flex-col w-[18rem] hidden lg:flex items-stretch gap-2">
            <div class="flex flex-col gap-2 border border-default w-full rounded-lg p-4">
                <label class="flex flex-row items-center gap-2">
                    <icon name="lucide:table-of-contents" class="bg-primary text-primary"></icon>
                    <p class="font-semibold">En esta página</p>
                </label>
                <TocNavigationMenu :toc="toc"></TocNavigationMenu>
            </div>
            <UFieldGroup     class="w-full">
                <u-button @click="scrollTop" label="Ir al inicio" class="grow"
                          icon="material-symbols:keyboard-arrow-up-rounded" variant="subtle" color="neutral"></u-button>
            </UFieldGroup >

        </div>

    </div>
</template>

<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core';
import { onMounted, ref, computed } from 'vue';
import type { Toc } from '@nuxt/content';

const { y } = useWindowScroll();
const props = defineProps<{ toc: Toc; links?: any[] }>();
const route = useRoute();
const mounted = ref(false);

onMounted(() => {
    mounted.value = true;
});

const scrollPercentage = computed(() => {
    if (process.client) {
        return (100 * y.value) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    }
    return 0;
});

async function share() {
    await navigator.share({ url: route.fullPath });
}

function scrollTop() {
    document.documentElement.scrollTo({ top: 0 });
    navigateTo(route.path, { replace: true });
}
</script>