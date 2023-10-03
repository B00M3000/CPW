<script lang="ts">
    import Gallery from "@/client/components/Gallery.svelte";


    export let data;

    $: ({ assets } = data);

</script>

<main>
    <Gallery {assets} />
</main>



