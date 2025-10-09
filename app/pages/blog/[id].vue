<script setup lang="ts">
import dayjs from "dayjs";
import appMeta from "~/app.meta";
import l from "lodash";
import type {NavigationMenuItem} from "@nuxt/ui";

const {path} = useRoute();
const {data: post} = await useAsyncData(path, () => queryCollection("blog").path(path).first());

const {data: links} = await useAsyncData(`linked-${path}`, async () => {
    const res = await queryCollection("blog").where("path", "NOT LIKE", post.value?.path).all();
    return l.orderBy(res, (a) => l.intersection(a.tags, post.value?.tags).length, "desc").slice(0, 5);
});

useSeoMeta({
    ogImage: post.value?.thumbnail,
});

updateMeta();

function updateMeta() {
    useSchemaOrg([
        defineArticle({
            headline: post.value?.title,
            description: post.value?.description,
            image: post.value?.thumbnail,
            datePublished: dayjs(post.value?.date, "YYYY-MM-DD").toDate().toString(),
            keywords: post.value?.tags,
            author: {
                name: post.value?.author,
                description: post.value?.author_description,
                image: post.value?.author_avatar,
            },
            publisher: definePerson({
                name: appMeta.author.name,
                description: appMeta.author.description,
                image: appMeta.author.image,
                url: appMeta.author.url,
            }),
        }),
    ]);

    useSeoMeta({
        title: post.value?.title,
        description: post.value?.description,
    });

    defineOgImageComponent("blog", {
        thumbnail: post.value?.thumbnail,
        title: post.value?.title,
        author: {
            name: post.value?.author,
            image: post.value?.author_avatar,
        },
    });
}


const authorEl = ref<HTMLElement | null>();
const readingTimeText = computed(() => (post.value?.meta as any).readingTime?.text);

onMounted(() => {
    const contentEl = document.getElementById("content");
    authorEl.value = contentEl?.querySelector("#author-about");
});
onBeforeMount(() => {
    const contentEl = document.getElementById("content");
    authorEl.value = contentEl?.querySelector("#author-about");
});
definePageMeta({
    layout: 'blog',
})
const route = useRoute()
const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Cv',
        to: '/perfil/cv',

    },
    {
        label: 'Linkedin',
        to: 'https://www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185/',
        target: '_blank'
    }
])

</script>

<template>
    <LazyNavar :items="items"/>
    <article v-if="post"
             class="relative mx-auto flex flex-col items-stretch mt-4 mb-16 gap-6 md:gap-12 max-w-5xl self-center">
        <header clas="flex flex-col">
            <UCard class="relative shadow-xl overflow-hidden min-h-[20rem] flex flex-col" variant="subtle"
                   :ui="{ body: 'flex flex-col flex-1' }">
                <img class="z-[0] absolute inset-0 object-cover opacity-25 w-full h-full" :src="post?.thumbnail"
                     :alt="post?.title"/>
                <div class="z-[1] flex-1 flex flex-col gap-2">
                    <h1 class="typ-subtitle">{{ post?.title }}</h1>
                    <p class="hidden md:block text-sm md:text-base">{{ post?.description }}</p>
                    <div class="flex-1 flex flex-wrap flex-row items-end justify-between gap-2">
                        <div class="gap-4 flex flex-col items-start">
                            <div class="flex flex-row items-center gap-4">
                                <UAvatar :src="post.author_avatar" alt="article author avatar"
                                         icon="material-symbols:person-rounded" size="3xl"></UAvatar>
                                <div class="flex flex-col items-start">
                                    <p class="font-bold">{{ post.author }}</p>
                                    <p v-if="post.author_description" class="typ-label">{{
                                            post.author_description
                                        }}</p>
                                    <ULink v-if="authorEl" @click="() => authorEl?.scrollIntoView()" color="neutral"
                                           class="text-sm">About the author
                                    </ULink>
                                </div>
                            </div>
                            <div class="flex flex-row gap-2 items-center flex-wrap">
                                <UBadge v-for="k in post?.tags" color="primary" variant="soft">{{ k }}</UBadge>
                            </div>
                        </div>
                        <div class="flex flex-row items-center gap-4">
                            <p class="flex flex-row items-center gap-1 typ-label">
                                <icon name="material-symbols:calendar-today-rounded" class="text-primary"></icon>
                                {{ dayjs(post?.date).format("DD MMM YYYY") }}
                            </p>
                            <p class="flex flex-row items-center gap-1 typ-label">
                                <icon name="material-symbols:alarm-rounded" class="text-primary"></icon>
                                {{ readingTimeText }}
                            </p>
                        </div>
                    </div>
                </div>
            </UCard>
        </header>
        <div ref="articleEl" class="relative w-full flex flex-row items-start gap-4">
            <ContentRenderer id="content" :value="post" class="markdown-content flex-1"/>
            <ArticleMenu v-if="post?.body?.toc" :toc="post?.body.toc" :links="links"/>
        </div>

    </article>

</template>

