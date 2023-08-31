<script lang="ts">
    import { goto } from "$app/navigation";

    import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_ORIGIN } from "$env/static/public";

    async function onTrigger(){
        const params = new URLSearchParams({
            client_id: PUBLIC_GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            redirect_uri: `${PUBLIC_ORIGIN}/login/redirect`,
            response_type: 'code',
            prompt: 'none',
        });

        await goto(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
    }
</script>

<div class="container" on:click={onTrigger}>
    <img src="/assets/google-icon.png" />
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
    }
    img {
        width: 18px;
        height: 18px;
    }
    .text {
        font-family: Roboto-Medium;
        font-size: 14px;
        color: rgba(67, 67, 67, 1);
        margin: 0 20px;
    }
</style>
