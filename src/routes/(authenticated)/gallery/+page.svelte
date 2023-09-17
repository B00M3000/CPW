<script lang="ts">
    import ImageUpload from "@/client/components/ImageUpload.svelte";

    export let data;

    $: ({ assets, projects } = data);
</script>

{#each assets as asset}
    <div>
        <span>{asset.desc}</span>
        <span>{asset.size} KB</span>
    </div>
{/each}

<ImageUpload {projects}/>

