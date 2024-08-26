<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang=ts>
    import ProjectCard from "@/client/components/ProjectCard.svelte";

    export let data;

    $: ({ projects, student } = data);
</script>

<main>
    <div class="profile my-5 sm:my-12">
        <div class="profile-picture">
            <img src={student.picture} alt="pfp">
        </div>
        <div class="student-info">
            <h1 class="title text-xl">{student.name}</h1>
            <h1 class="title text-xl">{student.email}</h1>
        </div>
    </div>

    <h1 class='text-center text-2xl'>Projects Completed:</h1>

    <div class="flex flex-wrap items-center justify-center mt-8 mx-4 sm:mx-36 mb-12">
        <div>
        {#each projects as project}
            <ProjectCard {project} />
        {/each}
        </div>
    </div>

    <div class="flex justify-center">
        <button class="bg-blue-400 hover:bg-blue-300 text-center px-3 p-2 sm:p-3 block rounded-lg text-lg sm:text-xl text-gray-900" on:click={() => history.back()}>Go back</button>
    </div>
</main>


<style lang="scss">
    img {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        object-fit: cover;
    }

    .profile {
        justify-content: center;
        font-weight: 900;
        color: #333;
        font-size: 0.5rem;
        align-items: center;
        padding: 20px;
        display: flex;
        gap: 20px;
        border-radius: 10px;
    }

    .profile-picture {
        flex-shrink: 0;
    }

    .title {
        text-align: left;
        margin: 0;
    }

    .student-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
