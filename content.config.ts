import { defineContentConfig, defineCollection,z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: 'blog/*.md',
            schema: z.object({
                date: z.string(),
                title: z.string(),
                description: z.string(),
                tags: z.array(z.string()).optional(),
                name: z.string(),
            }),
        })
    }
})
