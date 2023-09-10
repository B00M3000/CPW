<script lang=ts>
    import { goto } from "$app/navigation";
    import MentorSearcher from "@/client/components/MentorSearcher.svelte";
    import tags from "@/lib/tags";

    interface Action {
      action: string;
      project: ProjectInformation;
      mentor: MentorInformation;
      mentorId?: string;
    }

    interface ProjectInformation {
      title: string;
      tags: string[];
      shortDesc: string;
    }

    interface MentorInformation {
      firstName: string;
      lastName: string;
      organization: string;
      email: string;
      phoneNumber: string;
    }

    let project: ProjectInformation = {
      title: "",
      tags: [],
      shortDesc: ""
    };

    let mentor: MentorInformation = {
      firstName: "",
      lastName: "",
      organization: "",
      email: "",
      phoneNumber: "",
    };

    let action: Action;

    $: action = { ...action, action: "CREATE", project, mentor };

    async function upload() {
      console.log(action)
        const res = await fetch('/manage-projects/create', {
            method: "POST",
            body: JSON.stringify(action)
        });
        await goto('/manage-projects');
    }

    let step: number = 1;
    const maxStep: number = 4;
    const minStep: number = 1;

    const nextStep = () => { if(step < maxStep) step += 1 }
    const backStep = () => { if(step > minStep) step -= 1 }

    const phoneNumberRegex = /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/;

    type validation = () => true | string[];

    const stepValidations: validation[] = [
      () => {
        if(/.{24,100}/.test(project.title)) return true;
        else return ["Please enter a project name between 24 and 200 characters!"];
      },
      () => {
        const numberOfTags= project.tags.length
        if(numberOfTags >= 1 && numberOfTags <= 5) return true;
        else return ["Please select between 1 and 5 tags."];
      },
      () => {
        if(action.mentorId) return true;
       ( nonEmptyRegex.test(mentor.firstName) && nonEmptyRegex.test(mentor.lastName) && )
      }
    ]

    function mentorSelected(e: CustomEvent) {
      const { mentorId } = e.detail;
      action.mentorId = mentorId;
    }
</script>

<main>
  <form>
    {#if step === 1}
    <label for="subject" class="label">Project Title</label>
    <input type="text" id="title" required bind:value={project.title}>
    {:else if step === 2}
    <label for="selected" class="label">Select Tags</label>
    {#each Object.entries(tags) as [id, label]}
    <input type="checkbox" value={id} id="selected" bind:group={project.tags}/>
    {label}
    <br />
    {/each}
    {:else if step === 3}
    <MentorSearcher on:select={mentorSelected}/>
    {#if !action.mentorId}
    <label for="mentorFirst" class="label">Mentor First Name</label>
    <input type="text" id="mentorFirstName" required bind:value={mentor.firstName}>
    <label for="mentorLast" class="label">Mentor Last Name</label>
    <input type="text" id="mentorLastName" required bind:value={mentor.lastName}>
    <label for="mentorOrg" class="label">Mentor Organization</label>
    <input type="email" id="mentorOrganization" required bind:value={mentor.organization}>
    <label for="mentorEmail" class="label">Mentor Email</label>
    <input type="email" id="mentorEmail" required bind:value={mentor.email}>
    <label for="mentorPhone" class="label">Mentor Phone</label>
    <input type="text" id="mentorPhone" required bind:value={mentor.phoneNumber}>
    {/if}
    {:else if step === 4}
    <label for="shortDesc" class="label">Write A Short Description</label>
    <textarea id="shortDesc" rows=3 cols=60 maxlength=200 required bind:value={project.shortDesc}></textarea>
    {/if}

    {#if step > minStep}
    <button on:click={backStep}>Back</button>
    {/if}

    {#if step < maxStep}
    <button on:click={nextStep}>Next</button>
    {/if}

    {#if step === maxStep}
    <button type="submit" class="submit-button" on:click={upload}> Submit Form</button>
    {/if}
  </form>
</main>

<style lang="scss">
  
</style>






