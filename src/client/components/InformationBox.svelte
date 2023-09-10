<script lang="ts">
    export let backgroundColor: string;
    export let borderColor: string;
    export let textColor: string;
    export let headingColor: string;

    export let heading: string;
    export let text: string;
</script>

<div style="border-color: {borderColor}; background: {backgroundColor}">
    <span class="heading" style="color: {headingColor}">{heading}</span>
    <span class="text" style="color: {textColor}"><pre>{text}</span>
</div>

<style lang="scss">
    div {
        display: inline-flex;
        flex-direction: column;
        padding: 1rem;
        border-width: 3px;
        border-style: solid;
    }
    
    .heading {
        font-size: large;
    }
</style>