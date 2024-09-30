<script lang=ts>
    import MobileDeviceFilter from "@/client/components/MobileDeviceFilter.svelte";

    let { children } = $props();
</script>

<MobileDeviceFilter {children} />
