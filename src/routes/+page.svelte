<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "@/client/stores/user";
</script>

<main>

    <h1 class="title"><strong>Commonwealth School Project Week Database</strong></h1>
    <p class="subtitle"> Welcome to the Commonwealth School Project Week collection.
    </p>
    {#if !$user}
        <a class="login-button" href="/login">Log In</a>
    {/if}
        

</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(100vh - var(--nav-bar-height));
    }

    .login-button {
        background-color: var(--color-red-600);
        border-radius: 5px;
        padding: 15px;
        padding-left: 40px;
        padding-right: 40px;
        text-decoration: none;
        color: white
    }
    .title {
        font-size: 2rem;
        padding-top: 0.5rem;
    }

    .subtitle {
        font-size: 1.2rem;
        padding-top: 0.7rem;
        padding-bottom: 0.7rem;
    }


</style>