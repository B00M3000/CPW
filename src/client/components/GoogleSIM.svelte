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

<button class="container shadow-lg" on:click={onTrigger}>
    <img src="/assets/google-icon.png" alt = "Google Icon"/>
    <span class="text">Sign in with Google</span>
</button>

<style> 
    .container {
        display: inline-flex;
        padding: 10px;
        border-radius: 3px;
        cursor: pointer;
        background: white;
        justify-content: center;
        border: none;
        align-items: center;
    }
    img {
        width: 20px;
        height: 20px;
    }
    .text {
        font-family: Roboto-Medium;
        font-size: 16px;
        color: rgba(67, 67, 67, 1);
        margin: 0 20px;
    }
</style>
