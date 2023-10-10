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

    async function clear(){
       await goto("mentor-search");
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
        <button class="button" on:click={clear}>Clear</button>
    </div>
    <div class="mentor-container">
        <h1> Mentors: </h1>
        <table>
            
                <th>
                    <span>Name</span>   
                </th>
                <th>
                    <span>Organization </span>
                </th>
                <th>
                    <span>Email</span>
                </th>
                <th>
                    <span>Phone</span>
                </th>
        
            {#each mentors as mentor}
            <tr on:click ={()  => goto(`/mentor/${mentor._id}`)}>
                <td>
                    <span> {mentor.name} </span>
                </td>
                <td>
                    <span> {mentor.organization} </span>
                </td>
                <td>
                    <span> {mentor.email} </span>
                </td>
                <td>
                    <span> {mentor.phoneNumber} </span>
                </td>
            </tr>
            {/each}
        </table>
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
        display: flex;
        flex-direction: column;
        table {
            padding: 2rem;
            background-color: #fff;
            gap: 2rem;

            tr {
                td {
                    text-align: left;
                    padding: 0.5rem 1rem;
                }
                &:nth-child(even) {
                    background-color: #ddd;
                }
                
                &:nth-child(odd) {
                    background-color: #e9e9e9;
                } 
            }
            tr:hover {
                    background-color: rgb(163, 230, 185);
                    cursor: pointer;
            }

            th{
                text-align: left;
                padding: 0.5rem 1rem;
                background-color: rgb(163, 162, 162);
            }
        }  

        h1 {
            padding-left: 2rem;
            background-color: white;
            margin: 0;
        }

    }

</style>