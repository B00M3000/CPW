<script lang=ts>
    import { type Writable } from "svelte/store";

    let { value = $bindable() }: { value: number } = $props();
</script>

<div class="flex items-center gap-3">
    <progress value="{value.toPrecision(3)}" class="[&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-violet-400 [&::-moz-progress-bar]:bg-violet-400"></progress>
    <span>{(value * 100).toFixed(0)}%</span>
</div>