<script lang=ts>
    import Step1ProjectDetails from './Step1ProjectDetails.svelte';
    import Step2MentorInformation from './Step2MentorInformation.svelte';
    import Step3MentorDeduplication from './Step3MentorDeduplication.svelte';
    import Step4ProjectReport from './Step4ProjectReport.svelte';
    import Step5FinalTouches from './Step5FinalTouches.svelte';
    import Loading2 from '@/client/components/Loading2.svelte';
    import { navigating } from "$app/stores";

    let projectDetails = $state({
        title: "",
        selected: [],
        shortDescription: ""
    })

    let mentorInformation = $state({
        fullName: "",
        organization: "",
        email: "",
        phoneNumber: ""
    })

    let existingMentorId = $state();
    function selectExistingMentor(_id?: string) {
        existingMentorId = _id;
    }

    let fullReport = $state();
    function setFullReport(r?: string) {
        fullReport = r;
    }

    let step = $state(1);

    export const snapshot = {
        capture: () => ({
            projectDetails,
            mentorInformation,
            existingMentorId,
            fullReport,
            step
        }),
		restore: (snapshot) => {
            projectDetails = snapshot.projectDetails;
            mentorInformation = snapshot.mentorInformation;
            existingMentorId = snapshot.existingMentorId;
            fullReport = snapshot.fullReport;
            step = snapshot.step;
        }
    }

    let creationStatus = $state("not_started");
    $effect.pre(() => {
        if (step == 5 && creationStatus == "not_started") {
            creationStatus = "started";
            const reformedProjectDetails = { ...projectDetails, tags: projectDetails.selected.map(tag => tag.id) };
            delete reformedProjectDetails.selected;
            fetch("/manage-projects/create", {
                method: "POST",
                body: JSON.stringify({
                    projectDetails: reformedProjectDetails,
                    mentorInformation,
                    existingMentorId,
                    fullReport,
                })
            }).then(res => {
                if (res.ok) {
                    creationStatus = "success";
                } else {
                    creationStatus = "error";
                }
            })
        }
    })
</script>

{#if $navigating}
<Loading2 />
{/if}

<main class="w-full h-full flex flex-col items-center justify-start relative overflow-y-auto">
    <div class="sm:hidden absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 z-20">
        <div class="flex flex-col items-center bg-gray-300 m-12 p-8 rounded-xl">
            <span class="text-2xl">Sorry, please create your project on a desktop computer (any device with a larger screen). Thanks!</span>
        </div>
    </div>
    <div class="flex flex-col items-start p-12 pb-4 rounded-lg my-16 bg-gray-200 border border-solid border-gray-400">
        <span class="text-4xl mb-12">Creating a new project...</span>
        <div class="flex flex-col items-start w-[65vw] min-h-[65vh] max-w-4xl p-2">
            {#if step == 1}
            <Step1ProjectDetails bind:projectDetails bind:step />
            {:else if step == 2}
            <Step2MentorInformation bind:mentorInformation bind:step />
            {:else if step == 3}
            <Step3MentorDeduplication bind:mentorInformation bind:step {selectExistingMentor}/>
            {:else if step == 4}
            <Step4ProjectReport bind:step {setFullReport} />
            {:else if step == 5}
            <Step5FinalTouches bind:step bind:creationStatus />
            {/if}
        </div>
        <div class="fixed justify-center w-72 bottom-8 left-1/2 -translate-1/2 ">
            <div class="flex justify-center opacity-35 bg-[#000000AA] rounded-lg py-2 px-4">
                <span class="text-white text-sm">Make Sure to Scroll to the Bottom</span>
            </div>
        </div>
    </div>

</main>
