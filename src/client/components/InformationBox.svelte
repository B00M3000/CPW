<script lang="ts">
    export let backgroundColor: string;
    export let borderColor: string;
    export let textColor: string;
    export let headingColor: string;
</script>

<div style="border-color: {borderColor}; background: {backgroundColor}">
    <h1 style="color: {headingColor}"></h1>
    <p style="color: {textColor}"></p>
</div>

<style lang="scss">
        
</style>