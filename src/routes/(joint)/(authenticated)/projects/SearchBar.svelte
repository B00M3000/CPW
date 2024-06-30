<script lang=ts>
    import { goto } from "$app/navigation";
    import { user } from "@/client/stores/user";
    import { AccountType } from "@/lib/enums";

    export let query: string;
    export let search;
</script>

<div class="flex flex-wrap justify-center items-center w-full px-6 py-3 bg-gray-300 gap-4">
    <!-- svelte-ignore a11y-autofocus -->
    <div class="flex flex-grow max-w-[900px]">
        <input
            placeholder="Search..."
            class="w-full py-4 px-5 box-border rounded-l-lg outline-none"
            bind:value={query}
            type="search"
            autofocus
        />
        <button class="text-white text-md rounded-r-lg p-4 bg-sky-600 hover:bg-sky-700" on:click={search}>Search</button>
    </div>
    <div class="flex justify-center items-center gap-4">
        <button class="flex-grow-0 text-white rounded-lg bg-slate-400 p-4 text-md max-sm:text-sm hover:bg-slate-500" on:click={async () => {
                await goto(`/projects/archived`);
            }}>
            See Archived Projects
        </button>
        {#if $user.accountType == AccountType.Student}
        <button class="flex-grow-0 text-white rounded-lg bg-orange-600 p-4 text-md max-sm:text-sm hover:bg-orange-700" on:click={async () => {
                await goto(`/manage-projects`); 
            }}>
            View My Projects    
        </button>
        {:else if $user.accountType == AccountType.Advisor}
        <button class="flex-grow-0 text-white rounded-lg bg-yellow-600 p-4 text-md max-sm:text-sm hover:bg-yellow-700" on:click={async () => {
                await goto(`/manage-advisees`);
            }}>
            View My Advisees    
        </button>
        {/if}
    </div>
</div>