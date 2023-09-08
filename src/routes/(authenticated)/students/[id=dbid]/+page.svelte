<script lang=ts>
    import Page from "../../projects/+page.svelte";
    import ProjectCard from "@/client/components/ProjectCard.svelte";


    export let data;

    $: ({ projects, student } = data);
    

</script>


<main>
    <div class="profile">
        <img src={student.picture} alt="pfp">
        <div class="student-info">
            <h1 class="title">  {student.name} </h1>
            <h1 class="title"> {student.email} </h1>
        </div>
    </div>
    
    <div class = "projects">
        {#each projects as project }
            <ProjectCard {project} />
        {/each}
    </div>
</main>


<style lang="scss">

img {
    border-radius: 50%;
    width: 60px;
    height: 60px;
}
.profile{
    font-weight: 900;
    color: black;
    font-size: medium;
    align-items: center;
    padding: 5px;
    display: flex;
    padding-bottom: 1px;
}

.title{
    text-align: left;
}
.projects{
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.student-info{
    line-height: 1; 
    flex-direction: column; 
    padding-left: 5px;
}
</style>