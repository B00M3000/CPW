<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    export let text: string;
</script>

<span id="tag">{text}</span>

<style>
    #tag {
        display: inline-flex;

        padding: 0.3em;
        margin: 0.25em;

        background-color: lightskyblue;

        border-radius: 0.2em; 

        font-size: 12px;
    }
</style>
