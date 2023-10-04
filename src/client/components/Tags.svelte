<script lang="ts">
    import Tag from '@/client/components/Tag.svelte'
    import { getTagString } from '@/lib/tags';

    export let tagIds: string[];
</script>

<div id="tags">
    {#each tagIds as tagId}
    <Tag text={getTagString(tagId)} />
    {/each}
</div>

<style lang='scss'>
    #tags {
        display: inline-flex;
        flex-wrap: wrap;
    }
</style>