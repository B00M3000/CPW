<script lang="ts">
    import ImageUpload from "@/client/components/ImageUpload.svelte";

    export let data;
    $: ({projects} = data)
</script>


<ImageUpload {projects}/>