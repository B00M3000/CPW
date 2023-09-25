<script lang="ts">
    export let text: string;
</script>

<div class="tag">
    <span class="text">{text}</span>
</div>

<style>
    .tag {
        display: inline-flex;
        
        padding: 0.3em;

        margin: 0.25em;

        background-color: lightskyblue;

        border-radius: 0.2em;

        
    }

    .text {
        font-size: 12px;
    }
</style>
