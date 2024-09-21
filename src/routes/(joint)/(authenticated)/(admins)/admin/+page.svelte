<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    export let data;

    $: ({ projectCountPublished, projectCountNotPublished } = data)

    $: countPub = projectCountPublished//0;
    $: countNotPub = projectCountNotPublished//0;


    // onMount(() => {
    //     let speed = 85;

    //     const animatePub = () => {
    //         const value = projectCountPublished;

    //         const time = value / speed;
    //         if(countPub < value) {
    //             countPub = Math.ceil(countPub + time);
    //             setTimeout(animatePub, speed);
    //             speed = speed*0.99
    //         }else{
    //             countPub = value;
    //         }

    //     }

    //     const animateUnPub = () => {
    //         const value = projectCountNotPublished;
    //         const data = countNotPub;

    //         const time = value / speed;
    //         if(countNotPub < value) {
    //             countNotPub = Math.ceil(countNotPub + time);
    //             setTimeout(animateUnPub, speed);
    //             speed = speed*0.99
    //         }else{
    //             countNotPub = value;
    //         }
    //     }

    //     animatePub();
    //     animateUnPub();
    // });


</script>

<main>
    <div class="main-container">
        <div class="dashboard-panel-head">
            <h1 class="title"><strong>Administrator Dashboard</strong></h1>
        </div>

        <div class="dashboard-panel">
            <div class="count-panel">
                <h3 class="count-title">Published Projects</h3>
                <div class="count-value">{countPub}</div>
            </div>
            <hr>
            <div class="count-panel">
                <h3 class="count-title">Unfinished Projects</h3>
                <div class="count-value">{countNotPub}</div>
            </div>
        </div>

        <div class="dashboard-panel-button">
          <a href=/admin/identity-center class="p-4 bg-blue-400 hover:bg-blue-500">Identity Center</a>
          <a href=/admin/mentor-searcher class="p-4 bg-blue-400 hover:bg-blue-500">Mentor Searcher</a>
          <a href=/admin/project-catalog class="p-4 bg-blue-400 hover:bg-blue-500">Project Catalog</a>
          <a href=/admin/year-status class="p-4 bg-blue-400 hover:bg-blue-500">Year Status</a>
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
    margin-bottom: 1rem;
  }

  .dashboard-panel-head {
    background-color: #858585;
    border: 1px solid #1E1E1E;
    border-radius: 5px;
    padding: 20px;
    margin: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
  .dashboard-panel {
    background-color: #858585;
    display: flex;
    gap: 2rem;
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

  .main-container{
    background-color: var(--color-blue-grey-100);
    border: 1px solid #1E1E1E;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    margin-top: var(--nav-bar-height);
  }

</style>
