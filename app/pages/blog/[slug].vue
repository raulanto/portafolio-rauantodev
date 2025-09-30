<script setup>
const slug = useRoute().params.slug
const {data: post} = await useAsyncData(`blog-${slug}`, () => {
    return queryCollection('blog').path(`/blog/${slug}`).first()
})


</script>

<template>
    <lazy-navar/>
    <div class="relative p-4">
        <div class="max-w-3xl mx-auto">
            <div
                class="mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
                <div class="">

                    <lazy-auth-perfil-card/>
                    <h1  class=" font-bold text-4xl">{{post.title}}</h1>
                    <div class="py-5 text-sm font-regular  flex gap-2">
                        <UBadge>{{post.date}}</UBadge>
                        <div class="flex gap-2 flex-wrap">
                            <UBadge
                                v-for="tag in post.tags"
                                :key="tag"

                                size="md"
                                color="neutral"
                                variant="soft"
                            >
                                {{ tag }}
                            </UBadge>
                        </div>

                    </div>
                    <p class="text-base leading-8">
                        <ContentRenderer :value="post"/>
                    </p>



                </div>

            </div>
        </div>
    </div>

</template>