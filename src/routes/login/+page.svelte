<script lang="ts">
    import GoogleSIM from "../../client/components/GoogleSIM.svelte";
</script>

<main>
    <div class="container">
        <div class="title">Project Week Database</div>
        <div class="subtitle">
            This is a collection of past projects and project ideas for Commonwealth School's project week.
        </div>
        <div class="instructions">
            Please use you Commonwealth School Google account to sign into the project
            week database.
        </div>
        <br>
        <hr style="width:100%; border:black solid 1px">
        <div class="GoogleSIM"><GoogleSIM /></div>
    </div>
</main>

<style>
    main {
        background-color: darkred;
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(100vh - var(--nav-bar-height));
    }
    .container {
        margin: 3rem;
        display: inline-flex;
        flex-direction: column;
        background-color: white;
        padding: 2rem;
        width: 20vw;
        border-radius: 10px;
    }
    .GoogleSIM{
        margin: auto;
    }
    .title {
        font-size: 24px;
        padding-bottom: 1rem;
        padding-top: 0.5rem;
    }

    .subtitle {
        padding-top: 0.7rem;
        padding-bottom: 0.7rem;
    }

    .instructions {
        padding-bottom: 0.7rem;
        padding-top: 0.7rem;
    }
</style>
