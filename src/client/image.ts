import { on } from 'svelte/events';

export const lazyLoad = (image: HTMLImageElement, src: string) => {
    const loaded = () => {
        image.style.opacity = "1"
    }
    let off: () => void;
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            image.src = src
            if (image.complete) {
                loaded()        
            } else {
                off = on(image, 'load', loaded);
            }
        }
    })
    observer.observe(image)

    return {
        destroy() {
            if(off) off()
        }
    }
}