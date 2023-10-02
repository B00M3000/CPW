<script lang="ts">
    interface PageData {
        images: {
            _id: string;
        }[]
    }

    export let data: PageData;

    $: ({ images } = data)
</script>

{#each images as image}
<img src="/images/{image._id}" />
{/each}

<style lang="scss">
    img { 
        width: 5rem;
        height: 5rem;
        border-radius: 1rem;
    }
</style>

