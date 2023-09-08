<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "@/client/stores/user";

    export let data;

    $: ({ mentor } = data);
</script>

<main>
    <h1 class="title"><strong>{mentor?.firstName} {mentor?.lastName}</strong></h1>
    <p class="subtitle">Please contact Ms. Moss for contact information.</p>
</main>
  
<style>

</style>