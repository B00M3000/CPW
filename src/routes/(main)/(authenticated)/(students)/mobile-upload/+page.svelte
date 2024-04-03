<script>
  import { copy } from '@/client/copy.ts';
  import { page } from '$app/stores';
  import qrcode from 'qrcode';
  

    export let data;

    $: ({ mobileKey } = data)

    $: url = `${$page.url.protocol}//${$page.url.hostname}/mobile?mobileKey=${mobileKey}`

    $: qrdata = qrcode.toDataURL(url);
</script>

<main class="flex items-center justify-center">
    <div class="flex flex-col p-7 bg-gray-400 gap-3 items-center justify-center rounded-xl">
        <h1 class="text-4xl">Mobile Key</h1>
        <div class="flex gap-2 justify-center items-center">
            <span class="p-2 bg-white rounded-xl">{url}</span>
            <button on:click={() => copy(url)} class="bg-blue-500 hover:bg-blue-400 p-3 rounded-xl text-white">Copy</button>
        </div>

        {#await qrdata}
            <span>Loading QR Code...</span>
        {:then qr}
            <img src={qr} class="w-72 h-72"/>
        {:catch error}
            <span>{error.message}</span>
        {/await}
    </div>
</main>

<style>
    main {
        height: calc(100vh - var(--nav-bar-height));
    }
</style>