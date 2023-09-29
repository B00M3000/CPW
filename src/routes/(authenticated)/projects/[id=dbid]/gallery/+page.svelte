<script lang="ts">
    import GeneralGallery from "@/client/components/GeneralGallery.svelte";

    export let data;

    $: ({assets} = data)

    import GeneralGallary from "@/client/components/GeneralGallery.svelte";

</script>


<main>
    <GeneralGallery {assets} />
</main>