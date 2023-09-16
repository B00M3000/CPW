<script lang="ts">
    import { goto } from "$app/navigation";
    import ProjectCard from "@/client/components/ProjectCard.svelte";
    import { user } from "@/client/stores/user";

    export let data;

    $: ({ mentor, projects } = data);
</script>

<main>
    <h1 class="title"><strong>{mentor?.firstName} {mentor?.lastName}</strong></h1>
    <p class="subtitle"><em>Please contact Ms. Moss for contact information.</em></p>
    <h4> Click <a href="{`/projects/?yearUpper=2023&yearLower=2019&mentorSearch=${mentor?.firstName}+${mentor?.lastName}`}">here</a> 
        to search for projects this mentor has facillitated</h4>
    
</main>
  
<style>
main {
    text-align: center; 
    padding: 2rem; 
}

.title {
    font-size: 4rem; 
    color: #333; 
}

.subtitle {
    font-style: italic;
    color: #777; 
    margin-top: 1rem; 
}

a {
    text-decoration: none;
    border-bottom: 2px solid var(--color-primary); 
    transition: border-bottom 0.2s ease; 
}

a:hover {
    border-bottom: 2px solid;
}

</style>