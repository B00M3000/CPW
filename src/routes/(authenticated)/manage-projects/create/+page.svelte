<script lang=ts>
    import { goto } from "$app/navigation";
  import InformationBox from "@/client/components/InformationBox.svelte";
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

    let displayedErrorMessages: string[] = []

    function nextStep() {
      if(step < maxStep) {
        const isValid = stepValidations[step]();
        if(isValid === true) {
          step += 1;
          displayedErrorMessages = []
        } else {
          displayedErrorMessages = isValid;
        }
      }
    }

    function backStep() {
      if(step > minStep) step -= 1
    }

    type validation = null | (() => true | string[]);

    const stepValidations: validation[] = [
      null,
      () => {
        if(/.{24,100}/.test(project.title)) return true;
        else return ["Please enter a project name between 24 and 200 characters."];
      },
      () => {
        const numberOfTags= project.tags.length
        if(numberOfTags >= 1 && numberOfTags <= 5) return true;
        else return ["Please select between 1 and 5 tags."];
      },
      () => {
        if(action.mentorId) return true;
        else {
          let errorsMessages: string[] = [];

          if(!/.+/.test(mentor.firstName)) errorsMessages.push("Please enter the first name of your mentor.");
          if(!/.+/.test(mentor.lastName)) errorsMessages.push("Please enter the last name of your mentor.");
          if(!/.+/.test(mentor.organization)) errorsMessages.push("Please enter the relevant organization your mentor is associated with for your project.");
          if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mentor.email)) errorsMessages.push("Please enter a valid mentor email address.");
          if(!/^[+]{1}(?:[0-9\-\(\)\/\.]\s?){6, 15}[0-9]{1}$/.test(mentor.phoneNumber)) errorsMessages.push("Please enter a valid mentor phone number in the form +1 555-555-5555.");

          return errorsMessages;
        }
      },
      () => {
        if(/.{100,}/.test(project.shortDesc)) return true;
        else return ["Please enter a short description with at least 100 characters to start. You can always edit it later."]
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
    <input type="text" id="title" bind:value={project.title}>
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
    <input type="text" id="mentorFirstName" bind:value={mentor.firstName}>
    <label for="mentorLast" class="label">Mentor Last Name</label>
    <input type="text" id="mentorLastName" bind:value={mentor.lastName}>
    <label for="mentorOrg" class="label">Mentor Organization</label>
    <input type="email" id="mentorOrganization" bind:value={mentor.organization}>
    <label for="mentorEmail" class="label">Mentor Email</label>
    <input type="email" id="mentorEmail" bind:value={mentor.email}>
    <label for="mentorPhone" class="label">Mentor Phone</label>
    <input type="text" id="mentorPhone" bind:value={mentor.phoneNumber}>
    {/if}
    {:else if step === 4}
    <label for="shortDesc" class="label">Write A Short Description</label>
    <textarea id="shortDesc" bind:value={project.shortDesc}></textarea>
    {/if}

    {#if displayedErrorMessages.length > 0}
    <InformationBox 
      backgroundColor="var(--color-red-100)" 
      borderColor="var(--color-red-600)" 
      textColor="var(--color-red-600)" 
      headingColor="var(--color-red-900)" 
      heading="Invalid Inputs" 
      text={displayedErrorMessages.map(m => `  - ${m}`).join('\n')}
    />
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






