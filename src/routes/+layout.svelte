<script>
    import { Toaster } from 'svelte-french-toast';

    import "@/app.css";

    let { children } = $props();
</script>

<Toaster />

{@render children()}

<!-- Lead Developer Overlay -->
<div class="fixed max-sm:top-2 sm:bottom-24 max-sm:left-2 sm:right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg z-50 max-w-48">
    Project Lead and Lead Developer Thomas Zhou
</div>