export default defineAppConfig({
    ui: {
        colors: {
            primary: 'purple',
            neutral: 'zinc'
        },
        card: {
            slots: {
                body: "flex flex-col gap-2",
            },
        },
        formField: {
            slots: {
                container: "flex flex-col gap-2",
                help: "m-0",
            },
        },
        toaster: {
            slots: {
                viewport: "z-[10001]",
            },
        },
        alert: {
            slots: {
                root: 'relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5',
                wrapper: 'min-w-0 flex-1 flex flex-col',
                title: 'text-sm font-bold',
                description: 'text-sm opacity-90',
                icon: 'shrink-0 size-5',
                avatar: 'shrink-0',
                avatarSize: '2xl',
                actions: 'flex flex-wrap gap-1.5 shrink-0',
                close: 'p-0'
            },
            variants: {
                color: {
                    primary: '',
                    secondary: '',
                    success: '',
                    info: '',
                    warning: '',
                    error: '',
                    neutral: ''
                },
                variant: {
                    solid: '',
                    outline: '',
                    soft: '',
                    subtle: ''
                },
                orientation: {
                    horizontal: {
                        root: 'items-center',
                        actions: 'items-center'
                    },
                    vertical: {
                        root: 'items-start',
                        actions: 'items-start mt-2.5'
                    }
                },
                title: {
                    true: {
                        description: 'mt-1'
                    }
                }
            },
            compoundVariants: [
                {
                    color: 'primary',
                    variant: 'solid',
                    class: {
                        root: 'bg-gradient-to-r from-primary/70 to-primary text-inverted'
                    }
                },
                {
                    color: 'primary',
                    variant: 'outline',
                    class: {
                        root: 'bg-gradient-to-r from-transparent to-primary/5 text-primary ring ring-inset ring-primary/25'
                    }
                },
                {
                    color: 'primary',
                    variant: 'soft',
                    class: {
                        root: 'bg-gradient-to-r from-primary/5 to-primary/15 text-primary'
                    }
                },
                {
                    color: 'primary',
                    variant: 'subtle',
                    class: {
                        root: 'bg-gradient-to-r from-primary/5 to-primary/15 text-primary ring ring-inset ring-primary/25'
                    }
                },
                {
                    color: 'neutral',
                    variant: 'solid',
                    class: {
                        root: 'bg-gradient-to-r from-inverted/70 to-inverted text-inverted'
                    }
                },
                {
                    color: 'neutral',
                    variant: 'outline',
                    class: {
                        root: 'bg-gradient-to-r from-default/50 to-default text-highlighted ring ring-inset ring-default'
                    }
                },
                {
                    color: 'neutral',
                    variant: 'soft',
                    class: {
                        root: 'bg-gradient-to-r from-elevated/30 to-elevated/70 text-highlighted'
                    }
                },
                {
                    color: 'neutral',
                    variant: 'subtle',
                    class: {
                        root: 'bg-gradient-to-r from-elevated/30 to-elevated/70 text-highlighted ring ring-inset ring-accented'
                    }
                }
            ],
            defaultVariants: {
                color: 'primary',
                variant: 'solid'
            }
        },
        prose: {
            h1: {
                slots: {
                    base: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl serif-text'
                }
            },
            p: {
                base: 'leading-7 [&:not(:first-child)]:mt-6'
            },
            ul: {
                base: 'list-disc ps-6 my-5 marker:text-(--ui-border-accented)'
            },
            li: {
                base: 'my-1.5 ps-1.5 leading-7 [&>ul]:my-0'
            },
            img: {
                slots: {
                    base: 'rounded-md w-full',
                    overlay: 'fixed inset-0 bg-default/75 backdrop-blur-sm will-change-opacity',
                    content: 'fixed inset-0 flex items-center justify-center cursor-zoom-out focus:outline-none p-4 sm:p-8'
                },
                variants: {
                    zoom: {
                        true: 'will-change-transform'
                    },
                    open: {
                        true: ''
                    }
                },
                compoundVariants: [
                    {
                        zoom: true,
                        open: false,
                        class: 'cursor-zoom-in'
                    }
                ]
            }
        }
    }
})
