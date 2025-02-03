<script lang=ts>
    import MobileDeviceFilter from "@/client/components/MobileDeviceFilter.svelte";

    let { children } = $props();
</script>

<MobileDeviceFilter>
    {@render children()}
</MobileDeviceFilter>
