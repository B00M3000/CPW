<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let disabled: boolean = false;

    let search = "";

    let mentors: any = [];

    async function update() {
        if(!search || search.endsWith("&#8291")) return;
        const res = await fetch(`/api/mentors?query=${search}`);
        ({ mentors } = await res.json());
    }

    const dispatcher = createEventDispatcher()

    let selected: string;

    function select(mentorId: string) {
        dispatcher('select', { mentorId })
        selected = mentorId;
        search = "";
    }

    $: if(disabled) search = "";
</script>


<main>
    <input type="text" placeholder="Start typing to search..." bind:value={search} on:keyup={update} {disabled}/>
    <div class="mentors">
        
        {#each mentors as mentor}
        <div class="mentors-card" style={selected == mentor._id ? "background-color: var(--color-green-600);" : ""}>
            <div class="info">
                <span>Name: {mentor.name}</span>
                <span>Org: {mentor.organization}</span>
            </div>
            <button on:click={() => select(mentor._id)}>Select</button>
        </div>
        {/each}
    </div> 
</main>


<style lang="scss">
    main {
        background-color: rgba(255, 255, 255, 0.401); 
        border-radius: 8px; 
        padding: 20px; 
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); 
        display: flex;
        flex-direction:column;
        display: inline-flex;
        align-items: center;
    }

    input { 
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
        margin-bottom: 20px;
        width: 35vw;
        padding: 5px 20px; 
        margin: 10px; 
    }

    button {
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 3px 6px;
        margin-left: 10px;
        cursor: pointer;
        font-size: 16px;
        outline: none;
        transition: background-color 0.2s;
    }


    button:hover {
        background-color: #0056b3;
    }

    .info{
       
        display: flex;
        flex-direction: column; 
        flex-grow: 1; 
    }

    .mentors-card {
        background-color: #ffffff; 
        border: 1px solid #e0e0e0; 
        border-radius: 8px; 
        padding: 20px; 
        margin: 10px; 
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); 
        display: inline-flex;
        width: 35vw;
 
    }

    .mentors{
        background-color: #ffffff; 
        border-radius: 8px; 
        padding: 20px; 
        
        display: flex;
        flex-direction:column;
        display: inline-flex;
        width: 40vw;
        height: 20vh;
        overflow-y: auto;
        overflow-x: hidden;
        align-items: center;
        
        &::-webkit-scrollbar {
            width: 0.4rem;
            height: 0.1rem;
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgba(100, 97, 97, 0.47);        
            border-radius: 3px;

            &:hover {
                background: rgba(44, 43, 43, 0.2);
            }
        }
    }
</style>

