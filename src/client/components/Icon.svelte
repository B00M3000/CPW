<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import type { SVG, SVGAttributes } from "@/client/icons/types";

    export let src: SVG;
    export let size = "1em";
    export let color: string | undefined = undefined;
    
    let attributes: SVGAttributes;

    $: {
        attributes = {};

        if (color) {
            if (src?.attributes?.stroke !== "none") {
                attributes.stroke = color;
            }
            if (src?.attributes?.fill !== "none") {
                attributes.fill = color;
            }
        }
    }
</script>

<svg  {...src.attributes} width={size} height={size} stroke-width="0" {...attributes} xmlns="http://www.w3.org/2000/svg">
    {@html src.source}
</svg>