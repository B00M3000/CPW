<script lang=ts>
    import StudentCard from '@/client/components/StudentCard.svelte';
    import MentorCard from '@/client/components/MentorCard.svelte';
    export let data;

    $: ({ project } = data);
    

</script>


<main>
    <h1>{project.title}</h1>

</main>