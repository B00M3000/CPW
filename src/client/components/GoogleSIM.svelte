<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from "$app/navigation";

    import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_ORIGIN } from "$env/static/public";

    import { page } from "$app/stores";

    async function onTrigger(){
        const params = new URLSearchParams({
            client_id: PUBLIC_GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            redirect_uri: new URL(`/login/redirect`, PUBLIC_ORIGIN).toString(),
            response_type: 'code',
            // prompt: 'none',
        });

        const redirect = $page.url.searchParams.get('redirect');
        if(redirect) params.set('state', redirect)

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    }
</script>

<button class="container shadow-lg rounded-sm" on:click={onTrigger}>
    <!-- svelte-ignore a11y_missing_attribute -->
    <img src="/assets/google-icon.png"/>
    <span class="text">Sign in with Google</span>
</button>

<style>
    .container {
        display: flex;
        align-items: center;
        padding: 12px 10px;
        gap: 10px;
        height: 40px;
        background-color: #FFF;
        border: 1px #747775 solid;
    }
    img {
        width: 20px;
        height: 20px;
    }
    .text {
        font-family: Roboto-Medium;
        font-size: 16px;
        color: #1F1F1F;
    }
</style>
