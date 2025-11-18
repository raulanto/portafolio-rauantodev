<script setup lang="ts">

import Skibg from "~/components/ui/Skibg.vue";
import list from "~/utils/proyectos";
import PostCard from "~/components/global/card/postCard.vue";
import Keypad3D from "~/components/ui/Keypad3D.vue";

const { data: blogs } = await useAsyncData("blog", async () => {
    const allBlogs = await queryCollection("blog").all();
    return allBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
const authors = ref([
    {
        name: 'raulanto',
        description: 'Desarrollador Full Stack',
        avatar: {
            src: 'https://avatars.githubusercontent.com/u/74162376?v=4'
        },
        to: 'https://github.com/raulanto',
        target: '_blank'
    }
])
</script>

<template>
    <div class="min-h-screen xl:grid xl:grid-cols-2">
        <UPageSection
            orientation="vertical"
            :links="[{
          label: 'rauantodev',

          variant: 'ghost',
          size: 'md',
          to: '/',

        }, {
          label: 'GitHub',
          icon: 'i-simple-icons-github',
          variant: 'ghost',
          size: 'md',
          to: 'https://github.com/raulanto',
          target: '_blank'
        }]"
            :ui="{
          root: 'border-b border-default xl:border-b-0 xl:sticky xl:inset-y-0 xl:h-screen overflow-hidden',
          container: 'h-full items-center justify-center',
          wrapper: 'flex flex-col',
          headline: 'mb-6',
          title: 'text-left text-4xl',
          description: 'text-left max-w-lg',
          links: 'gap-1 justify-start -ms-2.5'
        }"
        >
            <template #top>
                <Skibg />

                <div class="absolute -right-1/3 z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-100 transform -translate-y-1/2 top-1/2" />
            </template>

            <template #headline>

                    <div class="  flex-col justify-center items-center  py-8">

                        <h2  class="text-4xl font-bold sm:text-5xl serif-text">Blog</h2>
                        <p class="mt-2 text-lg leading-8">Articulos relacionados con distintas tecnologias.</p>

                        <div class="flex flex-col justify-center items-center mt-4">
                            <keypad3-d/>
                        </div>
                    </div>

            </template>

            <template #default />
        </UPageSection>

        <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex xl:justify-center xl:items-center xl:ml-10">
            <div class="flex flex-col mt-26 justify-center items-center w-full">

                    <UBlogPost
                        v-for="(post, index) in blogs"
                        :key="index"
                        :image="post.thumbnail"
                        v-bind="post"
                        class="mt-3"
                        :to="`${post.path}`"
                        :authors="authors"
                    >

                        <template #badge>
                            <UBadge v-for="tag in post.tags" :key="tag" size="sm" color="primary" variant="soft" class="mr-1">
                                {{ tag }}
                            </UBadge>

                        </template>
                        <template #date>

                        </template>
                    </UBlogPost>

            </div>


        </section>
    </div>
</template>

<style scoped>

</style>