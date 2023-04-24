<script lang="ts">
    export let text: string;
</script>

<div class="tag">
    <span class="text">{text}</span>
</div>

<style>
    .tag {
        display: inline-flex;
        
        padding: 0.5em;

        margin: 0.25em;

        background-color: lightcyan;

        border-radius: 0.5em;
    }

    .text {
        font-size: 12px;
    }
</style>