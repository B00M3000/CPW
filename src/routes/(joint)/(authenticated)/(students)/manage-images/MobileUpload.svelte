<script lang=ts>
    import { copy } from '@/client/copy.ts';
    import { page } from '$app/stores';
    import qrcode from 'qrcode';
    import { PUBLIC_ORIGIN } from '$env/static/public';
    import Icon from '../../../../../client/components/Icon.svelte';
    import CircleCheck from '@/client/icons/CircleCheck';
    import Copy from '@/client/icons/Copy';
    import { RingLoader } from "svelte-loading-spinners";

    export let projectId: string;

    async function generateMobileKey() {
        const response = await fetch(`/manage-images/mobile-upload/?projectId=${projectId}`);
        return (await response.json()).mobileKey
    }

    const mobileKeyPromise: Promise<string> = new Promise(async (resolve) => resolve(await generateMobileKey()))
    const urlPromise: Promise<string> = new Promise(async (resolve) => resolve(new URL(`/mobile-upload-portal?mobileKey=${await mobileKeyPromise}`, PUBLIC_ORIGIN).toString()))
    const qrcodePromise: Promise<string> = new Promise(async (resolve) => resolve(await qrcode.toDataURL(await urlPromise)))

    let copied = false;

    function copyURL(url: string) {
        copy(url)
        copied = true;
    }
</script>

<div class="flex flex-col p-12 bg-white gap-3 items-center justify-center rounded-xl">
    <h1 class="text-4xl mb-4">Mobile Image Upload</h1>
    <div class="flex gap-2 justify-center items-center">
        {#await urlPromise}
        <span class="p-2 bg-gray-200 rounded-xl text-base w-72">Generating URL...</span>
        <button class="p-2 rounded-xl text-white">
            <Icon src={Copy} size="1.5rem" color="black"/>
        </button>
        {:then url}
        <span class="p-2 bg-gray-200 rounded-xl text-base w-72 text-ellipsis overflow-clip text-nowrap">{url}</span>
        <button on:click={() => copyURL(url)} class="{copied ? "" : "hover:bg-gray-200"} p-2 rounded-xl text-white">
            <Icon src={copied ? CircleCheck : Copy} color={copied ? "darkgreen" : "black"} size="1.5rem"/>
        </button>
        {/await}
    </div>

    {#await qrcodePromise}
        <div class="w-72 !h-72 flex items-center justify-center">
            <RingLoader color="blue" size={48} />
        </div>
    {:then qr}
        <img src={qr} class="w-72 h-72"/>
    {:catch error}
        <span>{error.message}</span>
    {/await}
</div>
