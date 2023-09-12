<script lang="ts">
    import { goto } from "$app/navigation";
    import { user } from "@/client/stores/user";
    import { onMount } from "svelte";

    async function gotoGhostManager() {
        await goto('/admin/ghosts');
    }

    async function gotoAdvisorAdviseeLinker() {
        await goto('/admin/advisor-advisee');
    }

    export let data;

    $: ({ projectCountPublished, projectCountNotPublished} = data)

    $: countPub = 0;
    $: countNotPub = 0;


    onMount(() => {
        let speed = 75;

        const animatePub = () => {
            const value = projectCountPublished;
            
            const time = value / speed;
            if(countPub < value) {
                countPub = Math.ceil(countPub + time);
                setTimeout(animatePub, speed);
                speed = speed*0.99
            }else{
                countPub = value;
            }
            
        }

        const animateUnPub = () => {
            const value = projectCountNotPublished;
            const data = countNotPub;
            
            const time = value / speed;
            if(countNotPub < value) {
                countNotPub = Math.ceil(countNotPub + time);
                setTimeout(animateUnPub, speed);
                speed = speed*0.99
            }else{
                countNotPub = value;
            }
        }
   
        animatePub();
        animateUnPub();
    });


</script>

<main>
    <h1 class="title"><strong>Administrator Dashboard</strong></h1>
    <p class="subtitle">Currently still under development...</p>
    <h3>Currently Logging {countPub} Published Projects</h3>
    <h3>Currently Logging {countNotPub} Projects Being Created </h3>
    <button on:click={gotoGhostManager}>Ghosts Manager</button>
    <button on:click={gotoAdvisorAdviseeLinker}>Advisor-Advisee Linker</button>
</main>
  
<style>
 main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f4f4;
    padding: 20px;
  }

  .title {
    font-size: 2rem;
    color: #333;
    text-align: center;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #888;
    text-align: center;
    margin-bottom: 20px;
  }

  button {
    background-color: #ff6347;
    color: #fff;
    padding: 10px 20px;
    font-size: 1.2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #ff4500;
  }
</style>