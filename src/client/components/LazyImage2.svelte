<script lang=ts>
    import type { HTMLImgAttributes } from 'svelte/elements';
    import { on } from 'svelte/events';

    let { src, ...props }: HTMLImgAttributes = $props();

     const lazyLoad = (image: HTMLImageElement, src: string | null | undefined) => {
        function loaded() {
            image.classList.add('loaded')
            image.style.opacity = "1"
        }
        let off: () => void;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                image.src = src || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEaYTaC-q-QWUu2g7QgVvRKkJkqXjXtjBU2w&s"
                if (image.complete) {
                    loaded()        
                } else {
                    off = on(image, 'load', loaded);
                }
            }
        })
        observer.observe(image)

        return { destroy() { if(off) off() } }
    }
</script>

{#key src}
<img use:lazyLoad={src} {...props}/>
{/key}

<style>
    img {
        opacity: 0;
        transition: opacity 1s ease-out;
    }

    img.loaded {
        opacity: 1;
    }
</style>