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
            redirect_uri: `${PUBLIC_ORIGIN}/login/redirect`,
            response_type: 'code',
            // prompt: 'none',
        });

        const redirect = $page.url.searchParams.get('redirect');
        if(redirect) params.set('state', redirect)

        await goto(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
    }
</script>

<div class="container" on:click={onTrigger} role="button" aria-pressed="false">
    <img src="/assets/google-icon.png" alt = "Google Icon"/>
    <span class="text">Sign in with Google</span>
</div>

<style> 
    @font-face {
        font-family: Roboto-Medium;
        src: url(/assets/Roboto-Medium.ttf);
    }
    .container {
        display: inline-flex;
        padding: 10px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;    
        border-radius: 3px;
        cursor: pointer;
        background: white;
        justify-content: center;
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
