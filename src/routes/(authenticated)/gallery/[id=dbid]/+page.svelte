<script lang="ts">
    import StudentCard from '@/client/components/StudentCard.svelte';

    export let data;

    $: ({ asset, student} = data);


</script>


<main>
<h1>Image Information</h1>
    <div class="image-container">
        <img src="/assets/{asset._id}" alt="a specific asset" />
    </div>
    <div class="info">

        <span><strong>Student:</strong>  </span> <StudentCard {student}/>
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
}
</style>