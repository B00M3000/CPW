<script lang=ts>
    import CheckmarkFilled from "carbon-icons-svelte/lib/CheckmarkFilled.svelte";
    import WarningAltFilled from "carbon-icons-svelte/lib/WarningAltFilled.svelte";
    import ErrorFilled from "carbon-icons-svelte/lib/ErrorFilled.svelte";

    let { type }: { type: string } = $props();
</script>

<div class="flex items-center justify-center p-1">
    {#if type == "green"}
    <CheckmarkFilled size={24} color="green" />
    {:else if type == "orange"}
    <WarningAltFilled size={24} color="orange" />
    {:else if type == "red"}
    <ErrorFilled size={24} color="red" />
    {:else}
    <span>INVALID TYPE</span>
    {/if}
</div>
