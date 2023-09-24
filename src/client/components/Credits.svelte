<script lang="ts">
    import Icon from "@/client/components/Icon.svelte";
    import Information from "@/client/icons/Information";
    import Close from "@/client/icons/Close";

    let isOpen = false;

    function toggleState() {
        isOpen = !isOpen
    }
</script>

<div on:click={toggleState}>
    <Icon src={Information} />
</div>

{#if isOpen}
<div class="overlay">  
    <div class="container">
        <div class="heading">
            <h1>Credits</h1>
            <div on:click={toggleState}>
                <Icon src={Close} size="2em" color="white"/>
            </div>
        </div>
        <p>Authored by Thomas Zhou (26')</p>
        <p>Co-Authored by Ethan Wu (26')</p>
    </div>
</div>
{/if}

<style lang="scss">
    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.65);
        z-index: 9999;
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;

        .container {
            display: flex;
            flex-direction: column;
            padding: 2rem;
            background-color: aliceblue;
            color: black;
            border-radius: 1rem;

            .heading {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
</style>