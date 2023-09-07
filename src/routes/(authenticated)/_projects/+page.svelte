<script lang="ts">
    import { goto } from "$app/navigation";

    export let data;

    const displayed_projects = [];

    async function search(e: Event){
        e.preventDefault();

        const searchParams = new URLSearchParams();




        await goto(`/?${searchParams}`);
    }
</script>



<style lang="scss">

</style>