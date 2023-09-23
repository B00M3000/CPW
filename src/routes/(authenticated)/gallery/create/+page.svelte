<script lang="ts">
    import ImageUpload from "@/client/components/ImageUpload.svelte";
    import InformationBox from "@/client/components/InformationBox.svelte";

    export let data;
    $: ({projects} = data)
</script>


<ImageUpload {projects}/>



<style lang="scss">

</style>