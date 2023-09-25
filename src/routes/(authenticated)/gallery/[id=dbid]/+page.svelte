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

        <p><strong>Student:</strong> <StudentCard {student}/> </p>
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
}

img {
    max-width: 100%;
    max-height: 400px; 
}

.info {
    text-align: center;
}
</style>