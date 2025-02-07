<script lang=ts>
    let { children } = $props();
</script>

<div class="fixed top-0 left-0 w-screen h-screen mask flex items-center justify-center">
{@render children()}
</div>

<style>
    .mask {
        background-color: #00000045;
        z-index: 50;
    }
</style>
