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
    <div class="main-container">
        <div class="dashboard-panel">
            <h1 class="title"><strong>Administrator Dashboard</strong></h1>
        </div>
        
        <div class="dashboard-panel">
            <div class="count-panel">
                <h3 class="count-title">Logging Published Projects</h3>
                <div class="count-value">{countPub}</div>
            </div>
            <hr>
            <div class="count-panel">
                <h3 class="count-title">Logging Unfinished Projects</h3>
                <div class="count-value">{countNotPub}</div>
            </div>
        </div>

        <div class="dashboard-panel">
            <button on:click={gotoGhostManager} class="dashboard-button futuristic-button">Ghosts Manager</button>
            <button on:click={gotoAdvisorAdviseeLinker} class="dashboard-button futuristic-button">Advisor-Advisee Linker</button>
        </div>
    </div>
</main>
  
<style>
 main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh - var(--nav-bar-height);
  }

  .dashboard-panel {
    background-color: #858585; 
    border: 1px solid #1E1E1E; 
    border-radius: 5px;
    padding: 20px;
    margin: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
  }

  .title {
    font-size: 2rem;
    color: #ffffff;
    text-align: center;
    margin-bottom: 10px;
  }


  .count-panel {
    text-align: center;
  }

  .count-title {
    font-size: 1.5rem;
    color: var(--color-blue-grey-100);
    margin-bottom: 10px;
  }

  .count-value {
    font-size: 2.8rem;
    color: var(--color-red-400); 
  }

  .dashboard-button {
    background-color: #0073E6; 
    color: #fff;
    padding: 10px 20px;
    font-size: 1.2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 10px;
    transition: background-color 0.3s;
    width: 15rem;
  }

  .dashboard-button:hover {
    background-color: #005CBF; 
  }
  .main-container{
    background-color: var(--color-blue-grey-100); 
    border: 1px solid #1E1E1E; 
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    margin-top: var(--nav-bar-height);
  }

</style>

