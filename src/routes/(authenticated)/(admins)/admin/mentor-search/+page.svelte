<script lang=ts>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import MentorCard from "@/client/components/MentorCard.svelte";
    export let data;

    $: ({ mentors } = data);

    let name: string;
    let organization: string;
    let email: string;

    function syncFields(searchParams: URLSearchParams){
        name = searchParams?.get("name") || "";
        organization = searchParams?.get("organization") || "";
        email = searchParams?.get("email") || ""
    }

    $: syncFields($page.url.searchParams);

    async function search(e: Event){
        e.preventDefault();

        const searchParams = new URLSearchParams();
        if(name) searchParams.set("name", name);
        if(organization) searchParams.set("organization", organization);
        if(email) searchParams.set("email", email);

        await goto(`mentor-search?${searchParams}`, { replaceState: true });
    }
</script>
<svelte:window on:load="{()=> syncFields()}"/>

<main>
    <div class="searching">
        <input
            placeholder="Search Mentor..."
            size="30"
            id="search-box"
            class="search-box"
            bind:value={name}
            type="text"
        />
        <input
            placeholder="Search Organization..."
            size="30"
            id="search-box"
            class="search-box"
            bind:value={organization}
            type="text"
        />
        <input
            placeholder="Search Email..."
            size="30"
            id="search-box"
            class="search-box"
            bind:value={email}
            type="text"
        />
        <button class="button" on:click={search}>Search</button>
    </div>
    <div class="mentor-container">
        {#each mentors as mentor}
            <div class="mentor-card">
                <span>Name: <MentorCard {mentor}/> </span>
                <span>Organization: {mentor.organization}</span>
                <span>Email: {mentor.email}</span>
            </div>
        {/each}
    </div>
</main>

<style lang=scss>
    .searching{
        display: flex;
        justify-content: center;
        padding: 1.5rem 0rem;
        width: calc(100vw - (100vw - 100%));
        background-color: rgb(196, 186, 186);
        
        .search-box {
            padding: 12px 20px;
            margin: 8px 0.2rem;
            box-sizing: border-box;
            border: 2px solid rgb(0, 0, 0);
            border-radius: 0px;
        }
        
        button {
            padding: 10px 20px;
            margin: 8px;
            box-sizing: border-box;
            border: transparent;
            font-weight: bold;
            color: white;
            background-color: var(--color-blue-grey-400);
            border-radius: 2px;
        }
        button:hover {
            background-color: var(--color-blue-grey-300);
        }

 
    }

    .mentor-container {
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .mentor-card{
        display: flex;
        padding: 1rem;
        gap: 5rem;
        background-color: aliceblue;
    }
</style>