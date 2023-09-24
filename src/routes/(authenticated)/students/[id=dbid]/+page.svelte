<script lang=ts>
    import Page from "../../projects/+page.svelte";
    import ProjectCard from "@/client/components/ProjectCard.svelte";


    export let data;

    $: ({ projects, student } = data);
    

</script>

<main>
    <div class="profile">
        <div class="profile-picture">
            <img src={student.picture} alt="pfp">
        </div>
        <div class="student-info">
            <h1 class="title">{student.name}</h1>
            <h1 class="title">{student.email}</h1>
        </div>
    </div>
    <hr>
    <div class="projects">
        {#each projects as project}
            <ProjectCard {project} />
        {/each}
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

    .projects {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    }
</style>