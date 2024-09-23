<script lang=ts>
    import Step1ProjectDetails from './Step1ProjectDetails.svelte';
    import Step2MentorInformation from './Step2MentorInformation.svelte';
    import Step3MentorDeduplication from './Step3MentorDeduplication.svelte';
    import Step4ProjectReport from './Step4ProjectReport.svelte';
    import Step5FinalTouches from './Step5FinalTouches.svelte';
    import Loading2 from '@/client/components/Loading2.svelte';
    import { navigating } from "$app/stores";
    import Modal from '@/client/components/Modal.svelte';
    import { X } from 'lucide-svelte';

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

<Modal>
    <div class="relative">
        <div class="flex flex-col rounded-lg bg-gray-300 p-12 items-start">
        <span class="text-4xl mb-16">Creating a new project...</span>
        <div class="overflow-y-auto flex flex-col items-start w-[65vw] h-[65vh]">
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
        <div class="flex justify-center w-full">
            <div class="flex justify-center opacity-25 bg-[#000000AA] rounded-lg py-2 px-4">
                <span class="text-white text-sm">Make Sure to Scroll to the Bottom</span>
            </div>
        </div>
        <a class="absolute top-0 right-0 m-4" href=/admin/project-center><X /></a>
    </div>
</Modal>
