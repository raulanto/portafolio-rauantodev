// https://nuxt.com/docs/api/configuration/nuxt-config
import {definePerson} from "nuxt-schema-org/schema";
import appMeta from "./app/app.meta";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxt/ui', '@nuxt/content', '@nuxtjs/seo', '@nuxt/image'],
    fonts: {
        defaults: {
            weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
        },
    },
    site: {
        image: '/img_4.png',
        name: appMeta.name,
        url: appMeta.url,
        defaultLocale: "es",
    },
    colorMode: {
        fallback: 'dark',
    },

    schemaOrg: {
        identity: definePerson(appMeta.author),
    },
    css: ['~/assets/css/main.css'],
    content: {
        build: {
            markdown: {
                toc: {
                    depth: 3,
                    searchDepth: 2,
                },
                highlight: {
                    langs: [
                        'js',
                        'python',
                        'bash',
                        'json',
                        'yaml',
                        'sql',
                        'css',
                        'mermaid',
                        'html',
                        'go'
                    ]
                },
                remarkPlugins: {
                    "remark-reading-time": {},
                },
            }

        }
    },
    nitro: {
        preset: 'vercel', // or 'netlify', 'static'
    },
    ssr: true,
    target: 'static',
})