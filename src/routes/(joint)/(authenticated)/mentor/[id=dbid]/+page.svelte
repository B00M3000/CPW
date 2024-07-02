<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    export let data;

    $: ({ mentor } = data);
</script>

<main class="flex items-center justify-center text-center h-full">
    <div class="inline-flex flex-col p-6 m-12">
        <h2 class="text-8xl text-gray-700 font-bold">{mentor?.name}</h2>
        <p class="italic text-gray-400 mt-9 mb-2 text-xl"><em>Please contact Ms. Moss for mentor contact information.</em></p>
        <p class="text-xl mb-5">Click <a class="text-blue-500" href="{`/projects/?yearUpper=${new Date().getFullYear()}&yearLower=2019&mentorSearch=${mentor?.name}`}">here</a> 
            to search for projects this mentor has facillitated</p>
        <div class="flex justify-center">
            <button class="bg-blue-400 hover:bg-blue-300 text-center p-3 block rounded-lg text-xl text-gray-900" on:click={() => history.back()}>Go back</button>
        </div>
    </div>
</main>
  
<style>
    a {
        text-decoration: none;
        border-bottom: 2px solid var(--color-primary); 
        transition: border-bottom 0.2s ease; 
    }

    a:hover {
        border-bottom: 2px solid;
    }
</style>