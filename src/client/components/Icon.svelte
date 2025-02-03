<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import type { SVG, SVGAttributes } from "@/client/icons/types";

    interface Props {
        src: SVG;
        size: string;
        color?: string;
    }

    let { src, size = "1em", color }: Props = $props();

    let attributes: SVGAttributes = $state({});

    $effect(() => {
        if (color) {
            if (src?.attributes?.stroke !== "none") {
                attributes.stroke = color;
            }
            if (src?.attributes?.fill !== "none") {
                attributes.fill = color;
            }
        }
    })
</script>

<svg {...src.attributes} width={size} height={size} stroke-width="0" {...attributes} xmlns="http://www.w3.org/2000/svg">
    {@html src.source}
</svg>
