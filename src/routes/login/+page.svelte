<script lang="ts">
    import GoogleSIM from "../../client/components/GoogleSIM.svelte";
</script>

<main>
    <div class="container">
        <div class="title">Project Week Database</div>
        <div class="subtitle">Collection of projects completed in previous years by students.</div>
        <div class="instructions">Please use you Commonwealth Google account to sign into the project week database.</div>
        <div><GoogleSIM /></div>
    </div>
</main>

<style>
    main {
        background-color: darkred;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .container {
        margin: 3rem;
        display: inline-flex;
        flex-direction: column;
        background-color: white;
        padding: 2rem;
    }

    .title {
        font-size: 24px;
    }

    .subtitle {

    }

    .instructions {

    }
</style>