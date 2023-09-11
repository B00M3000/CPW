
<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    export let data;
    $: ({ project, id } = data);
    let fullReport: string = ""; 

   
    interface Action {
        action: string;
        fullReport: string;
        projectId: string;
    }

    let ctrlDown = false;
    let vDown = false;
    let isChanges = false;

    let action: Action;
    onMount(() => { 
        action = {
            action: "CREATE",
            fullReport: project.fullReport,
            projectId: id
        }
        fullReport = project.fullReport;

    });

    async function handlePaste(){
        fullReport = await navigator.clipboard.readText()
        isChanges = true;

    };

    async function upload(){
        action.fullReport = fullReport;
        const res = await fetch(`/manage-projects/report/${id}`, {
            method: "POST",
            body: JSON.stringify(action)
        });
        
        await goto("/manage-projects")
    }

    function onKeydown(event) {
       
        if (event.repeat) return;
        switch (event.key) {
            case "Meta":
                ctrlDown = true;
                event.preventDefault;
                break; 

            case "Control":
                ctrlDown = true;
                event.preventDefault();
                break;

            case "v":
                vDown = true;
                event.preventDefault();
                break;
        }


        if (ctrlDown && vDown) {
            handlePaste();

        }
    }

    function onKeyup(event) {

        switch (event.key) {
            case "Meta":
                ctrlDown = false;
                event.preventDefault;
                break; 

            case "Control":
                ctrlDown = false;

                event.preventDefault();
                break;

            case "h":
                vDown = false;

                event.preventDefault();
                break;
        }
    }

</script>

<svelte:window on:keydown={onKeydown} on:keyup={onKeyup} />
<main>
    <div class="header">Submit Project Report for {project.title}</div>
    <div class="description">To submit or edit your full report, copy your project report and paste it here by 
        pressing the paste keybind on your computer (Meta/Command + V for Mac & Control + V for Windows). 
        if you already submitted a report before, you'll see the old one displayed below. If you accidentally
        made a change, just press the cancel button. If a change is made, the submit button will appear, and you can click that to 
        submit your report.
    </div>

    <div> 
        <button on:click={ () =>  goto("/manage-projects")}> Cancel </button>
        {#if isChanges}
            <button on:click={upload}> Submit </button>
        {/if}
    </div>
    <hr>
        {#if fullReport}
        <div>
            <h2>Report Content:</h2>
            <p>{fullReport}</p>
        </div>
        {/if}
</main>

<style>

    main {
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .header {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 2rem;
        text-align: center;
    }

    .description {
        font-size: 18px;
        margin-bottom: 20px;
        text-align: center;
    }

    button {
        background-color: #007bff;
        color: #fff;
        font-size: 18px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }

    p {
        white-space: pre-wrap; 
        word-break: break-word; 
        font-size: 16px;
        background-color: #f4f4f4;
        padding: 10px;
        border-radius: 5px;
    }
</style>




