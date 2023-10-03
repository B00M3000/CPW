<script lang="ts">
    import { goto } from '$app/navigation';
    import StudentCard from '@/client/components/StudentCard.svelte';

    export let data;

    $: ({ asset, student, project} = data);


</script>


<main>
<h1>Image Information</h1>
    <div class="image-container">
        <img src="/assets/{asset._id}" alt="a specific asset" />
    </div>
    <div class="info">

        <span><strong>Student:</strong>  </span> <StudentCard {student}/>
    </div>

    <div class="info">
        <button on:click={()=> goto(`/projects/${project._id}`)} class="viewproj-btn" > View Project </button>
    </div>
</main>
  
<style>
main {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.image-container {
    margin: 20px;
    padding: 20px;
    border: 2px solid black;
    border-radius: 5px;
    background-color: var(--color-blue-grey-200);
}

img {
    max-width: 100%;
    max-height: 400px; 
}

.info {
    text-align: center;
    margin: 0.5rem;
}

.viewproj-btn{
    background-color: var(--color-blue-500);
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    
}

.viewproj-btn:hover{
    background-color: var(--color-blue-400);
}
</style>