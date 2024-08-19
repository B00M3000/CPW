<script lang=ts>
    import { goto } from "$app/navigation";
    import { user } from "@/client/stores/user";
    import { AccountType } from "@/lib/enums";

    export let query: string;
    export let search;
    export let openRefinedSearch;
</script>

<form class="flex flex-wrap justify-center items-center w-full px-6 py-3 bg-gray-300 gap-2 sm:gap-4" on:submit|preventDefault={search}>
    <!-- svelte-ignore a11y-autofocus -->
    <div class="flex flex-grow max-w-[900px]">
        <input
            placeholder="Search..."
            class="w-full p-2 sm:py-4 px-5 box-border rounded-l-lg outline-none"
            bind:value={query}
            type="search"
            autofocus
        />
        <button class="text-white text-md rounded-r-lg p-2 sm:p-4 bg-sky-600 hover:bg-sky-700" type="submit">Search</button>
    </div>
    <div class="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
        <button class="flex-grow-0 text-white rounded-lg bg-slate-400 p-2 sm:p-4 text-md max-sm:text-sm hover:bg-slate-500" on:click={async () => {
                await goto(`/projects/archived`);
            }}>
            See Archived Projects
        </button>
        {#if $user.accountType == AccountType.Student}
        <button class="flex-grow-0 text-white rounded-lg bg-orange-600 p-2 sm:p-4 text-md max-sm:text-sm hover:bg-orange-700" on:click={async () => {
                await goto(`/manage-projects`); 
            }}>
            View My Projects    
        </button>
        {:else if $user.accountType == AccountType.Advisor}
        <button class="flex-grow-0 text-white rounded-lg bg-yellow-600 p-2 sm:p-4 text-md max-sm:text-sm hover:bg-yellow-700" on:click={async () => {
                await goto(`/manage-advisees`);
            }}>
            View My Advisees    
        </button>
        {/if}
        <button class="flex-grow-0 text-white rounded-lg bg-gray-400 p-2 sm:p-4 text-md max-sm:text-sm hover:bg-gray-500" on:click={openRefinedSearch}>
            Open Refined Search 
        </button>
    </div>
</form>
