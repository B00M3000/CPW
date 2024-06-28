<script lang=ts>
    import { type Writable } from "svelte/store";

    export let valueStore: Writable<number>;
</script>

<div class="flex items-center gap-3">
    <progress value="{$valueStore.toPrecision(3)}" class="[&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-violet-400 [&::-moz-progress-bar]:bg-violet-400"/>
    <span>{($valueStore * 100).toFixed(0)}%</span>
</div>