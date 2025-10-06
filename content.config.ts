import { defineContentConfig, defineCollection,z } from '@nuxt/content'
import { asSitemapCollection } from "@nuxtjs/sitemap/content";

export default defineContentConfig({
    collections: {
        blog: defineCollection(
            asSitemapCollection({
                type: 'page',
                source: 'blog/*.md',
                schema: z.object({
                    date: z.string(),
                    title: z.string(),
                    description: z.string(),
                    tags: z.array(z.string()).optional(),
                    name: z.string(),
                    author: z.string(),
                    author_avatar: z.string(),
                    author_description: z.string(),
                    thumbnail: z.string(),
                    rawbody: z.string(),
                }),
            })
        )
    }
})
