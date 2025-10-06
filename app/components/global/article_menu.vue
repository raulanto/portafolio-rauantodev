<template>
    <div class="md:sticky md:top-[calc(var(--headline-height)+1rem)]">
        <div v-if="mounted" class="fixed top-0 left-0 h-[4px] bg-primary rounded-md z-[20001]!"
             :style="{ width: `${scrollPercentage}%` }"></div>
        <div class="flex-col w-[18rem] hidden lg:flex items-stretch gap-2">
            <div class="flex flex-col gap-2 border border-default w-full rounded-lg p-4">
                <label class="flex flex-row items-center gap-2">
                    <icon name="lucide:table-of-contents" class="bg-primary text-primary"></icon>
                    <p class="font-semibold">En esta pagina</p>
                </label>
                <TocNavigationMenu :toc="toc"></TocNavigationMenu>
            </div>
            <UFieldGroup class="w-full">
                <u-button @click="scrollTop" label="Ir al inicio" class="grow"
                          icon="material-symbols:keyboard-arrow-up-rounded" variant="subtle" color="neutral"></u-button>
<!--                <u-button to="/" label="raulanto" icon="material-symbols:article-rounded" class="grow"-->
<!--                          variant="subtle" color="neutral"></u-button>-->
                <u-button @click="share" icon="material-symbols:share" variant="subtle" color="neutral"></u-button>
            </UFieldGroup >
            <u-collapsible id="related-articles" v-if="links && links?.length > 0" class="mb-6">
                <u-button
                    label="Mas articulos"
                    trailing-icon="material-symbols:keyboard-arrow-down-rounded"
                    block
                    color="neutral"
                    variant="subtle"
                    :ui="{
                        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
                    }"
                ></u-button>

                <template #content>
                    <div class="pb-8 pt-2">
                        <u-carousel v-slot="{ item }" :items="links" dots
                                    :ui="{ item: '', container: 'items-stretch!' }">
                            <Article_card :article="item" class="h-full"></Article_card>
                        </u-carousel>
                    </div>
                </template>
            </u-collapsible>
        </div>
        <div
            class="fixed flex lg:hidden left-0 right-0 top-[calc(var(--headline-height))] z-[20000]! transition-opacity duration-100"
            :class="{ 'opacity-0': y <= 0 }">
            <u-collapsible class="w-full">
                <div class="flex items-center gap-2 justify-between w-full bg-default/50 backdrop-blur-2xl group p-4">
                    <p class="font-semibold">On this page</p>
                    <icon name="material-symbols:keyboard-arrow-down-rounded"
                          class="group-data-[state=open]:rotate-180 transition-transform duration-200 size-5"></icon>
                </div>

                <template #content>
                    <div
                        class="w-full border border-default bg-default rounded-b-xl p-2 flex flex-col gap-4 items-stretch">
                        <TocNavigationMenu :toc="toc" class="max-h-[50svh]!"></TocNavigationMenu>
                        <UFieldGroup class="w-full">
                            <u-button @click="scrollTop" label="Scroll top" class="grow"
                                      icon="material-symbols:keyboard-arrow-up-rounded" variant="subtle"
                                      color="neutral">
                            </u-button>
                            <u-button to="/articles" label="All articles" icon="material-symbols:article-rounded"
                                      class="grow" variant="subtle" color="neutral"></u-button>
                            <u-button @click="share" icon="material-symbols:share" variant="subtle"
                                      color="neutral"></u-button>
                        </UFieldGroup>
                        <u-separator></u-separator>

                        <u-form-field label="More articles">
                            <u-carousel v-slot="{ item }" :items="links" class="w-full" dots
                                        :ui="{ item: '', container: 'items-stretch!' }">
                                <Article_card :article="item" class="h-full"></Article_card>
                            </u-carousel>
                        </u-form-field>
                    </div>
                </template>
            </u-collapsible>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {useWindowScroll} from '@vueuse/core';
import {computed, onMounted, ref} from 'vue';
import type {Toc} from '@nuxt/content';
import Article_card from "~/components/global/article_card.vue";
const toast = useToast()
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
    await navigator.clipboard.writeText(window.location.href);
    toast.add({
        title:'Link Copiado'
    })
}
function scrollTop() {
    document.documentElement.scrollTo({ top: 0 });
    navigateTo(route.path, { replace: true });
}
</script>