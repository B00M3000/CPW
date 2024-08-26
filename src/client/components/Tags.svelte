<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { getTagString } from '@/lib/tags';

    export let tagIds: string[];
    export let additionalClasses: string = '';
</script>

<div id="tags">
    {#each tagIds as tagId}
        <span class="inline-flex p-1 bg-sky-200 rounded-sm text-xs {additionalClasses}">{getTagString(tagId)}</span>
    {/each}
</div>

<style lang='scss'>
    #tags {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }
</style>
