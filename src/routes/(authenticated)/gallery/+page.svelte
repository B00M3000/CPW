<script lang="ts">
    import Gallery from "@/client/components/Gallery.svelte";

    export let data;

    $: ({ images } = data);

</script>

<main>
    <Gallery {images} />
</main>



