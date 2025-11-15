<script setup lang="ts">

import Skibg from "~/components/ui/Skibg.vue";
import list from "~/utils/proyectos";
import PostCard from "~/components/global/card/postCard.vue";
</script>

<template>
    <div class="min-h-screen xl:grid xl:grid-cols-2">
        <UPageSection
            title="Proyectos"
            description="Proyectos creados con la finalidad de aprender,mejorar y tener productos los cuales se pueden ajustar a una necesidad "
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

            </template>

            <template #default />
        </UPageSection>

        <section class="px-4 sm:px-6 xl:px-0 xl:-ms-30 xl:flex xl:justify-center xl:items-center xl:ml-10">
            <div class="flex flex-col mt-26 justify-center items-center w-full">
                <PostCard
                    v-for="post in list"
                    :key="post.id"
                    :post="post"
                />
            </div>


        </section>
    </div>
</template>

<style scoped>

</style>