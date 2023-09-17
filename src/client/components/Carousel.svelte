<script lang="ts">
    import { Project } from "@/interfaces/project";
    import ProjectCard from "./ProjectCard.svelte";
    
    export let projectList: Project[] = [];

    let left = 0;
    let middle = 1;
    let right = 2;

</script>

<div>
    <button on:click={moveLeft}>Left</button>
    <button on:click={moveRight}>Right</button>
    <ProjectCard {projectList[left]} />
    <ProjectCard {projectList[middle]} />
    <ProjectCard {projectList[right]} />
</div>

