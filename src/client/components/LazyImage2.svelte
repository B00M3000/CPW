<script lang=ts>
    import type { HTMLImgAttributes } from 'svelte/elements';
    import { on } from 'svelte/events';

    let { src, ...props }: HTMLImgAttributes = $props();
    let loaded = $state(false);

     const lazyLoad = (image: HTMLImageElement, src: string | null | undefined) => {
        function onLoaded() {
            loaded = true;
            image.classList.add('loaded')
            image.style.opacity = "1"
        }
        let off: () => void;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                image.src = src || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEaYTaC-q-QWUu2g7QgVvRKkJkqXjXtjBU2w&s"
                if (image.complete) {
                    onLoaded()
                } else {
                    off = on(image, 'load', onLoaded);
                }
            }
        })
        observer.observe(image)

        return { destroy() { if(off) off() } }
    }
</script>

{#key src}
<div class="relative inline-block w-full h-full">
    <div class="placeholder {loaded ? "hidden" : "flex"}">
        <div class="placeholder-shimmer"></div>
    </div>
    <img class="absolute z-10" use:lazyLoad={src} {...props}/>
</div>
{/key}

<style>
    img {
        opacity: 0;
        transition: opacity 0.5s ease-out;
        display: block;
    }

    img.loaded {
        opacity: 1;
    }

    .placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #d0d0d0;
        align-items: center;
        justify-content: center;
        z-index: 1;
        border-radius: 8px;
        overflow: hidden;
    }

    .placeholder-shimmer {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #c1c5cc 25%, #d6d9dc 50%, #c1c5cc 75%);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
</style>
