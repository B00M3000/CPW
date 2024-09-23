<script lang=ts>
    import Modal from "@/client/components/Modal.svelte";
    import { tags } from "@/lib/tags";
    import MultiSelect from "svelte-multiselect";
    import { Circle3 } from "svelte-loading-spinners";
    import { X, Save, CircleX } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import MentorModal from "../../mentor-center/MentorModal.svelte";

    const TAG_OPTIONS = Array.from(tags.entries()).map(([k, v]) => ({ id: k, label: v, value: v }))

    let errorMessages: string[] = $state([]);

    let { data } = $props();

    let originalProject = $derived(data.project);

    let project = $state(originalProject);

    let selected = $state(TAG_OPTIONS.filter(tO => project.tags.includes(tO.id)));

    async function submitChanges() {
        status = Status.Saving;

        errorMessages = []

        if(project.title.length < 12 || project.title.length > 200) {
            errorMessages.push("Please enter a project name between 12 and 200 characters.");
        }

        if(selected.length < 1 || selected.length > 5) {
            errorMessages.push("Please select between 1 and 5 tags.");
        }

        if(project.shortDesc.length < 25 || project.shortDesc.length > 500) {
            errorMessages.push("Please enter a short description with at least 25 characters and less than 500.");
        }

        if(errorMessages.length > 0) return status = Status.Error;

        let submissionString = JSON.stringify({ ...project, tags: selected.map(s => s.id) });

        const res = await fetch('/admin/api/project/edit', {
            method: "POST",
            body: submissionString
        });

        if(res.ok) {
            if($page.url.searchParams.get("close-window") == "true") window.close()
            else await goto('/admin/project-center')
        }
        else status = Status.Error
    }

    enum Status {
        Unsaved,
        Saving,
        Saved,
        Error
    }

    let changed = $derived(!Object.is(originalProject, project));

    let status: Status = $state(Status.Unsaved);

    // report stuff

    let ctrlDown = $state(false);
    let vDown = $state(false);
    let isChanged = $state(false);

    async function handlePaste(){
        project.report = await navigator.clipboard.readText()
        isChanged = true;
    };

    function onKeydown(event: KeyboardEvent) {
        const { repeat, key } = event;

        if (repeat) return;

        if (key == "Meta" || key == "Control") {
            ctrlDown = true;
            event.preventDefault();
        }

        if(key == "v") {
            vDown = true;
            event.preventDefault();
        }

        if (ctrlDown && vDown) {
            handlePaste();
        }
    }

    function onKeyup(event: KeyboardEvent) {
        const { key } = event;

        if (key == "Meta" || key == "Control") {
            ctrlDown = false;
            event.preventDefault();
        }

        if(key == "v") {
            vDown = false;
            event.preventDefault();
        }
    }

    let mentorEditingOpen = $state(false);

    function onMentorEditingClose() {
        mentorEditingOpen = false;
    }
</script>

<Modal>
    <div class="relative">
        <div class="rounded-lg p-12 bg-gray-300 flex flex-col items-start">
            <div class="flex gap-12">
                <div class="flex flex-col items-start">
                    <span class="text-2xl font-bold mb-8">Project Details</span>

                    <div class="flex flex-col items-start mb-4">
                        <span class="text-xl mb-2">Project Title: </span>
                        <span contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[30rem]" bind:innerHTML={project.title}></span>
                        <span class="text-gray-600 max-w-[24rem] text-sm">Ex: Spanish Exchange 2024, Neurolinguistics at MIT's EvLab, Starting A Car Washing Business</span>
                    </div>

                    <div class="flex items-start flex-col mb-4">
                        <h2 class="text-xl mb-2">Tags: </h2>
                        <MultiSelect
                            options={TAG_OPTIONS}
                            maxSelect={5}
                            placeholder="Search tags.."
                            liSelectedClass="flex gap-2 items-center"
                            outerDivClass="flex gap-2 items-center my-0 bg-gray-50 p-2 py-3 rounded-md border-gray-400 border max-w-[30rem] min-w-72"
                            bind:selected
                        >
                            <span slot="selected" let:option class="max-w-72 text-ellipsis overflow-x-clip text-base">{option.label}</span>
                        </MultiSelect>
                    </div>

                    <div class="flex items-start flex-col mb-8">
                        <h2 class="text-lg mb-2">Short Description:</h2>
                        <span contenteditable="plaintext-only" class="text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-h-16 min-w-72 max-w-[32rem]" bind:innerHTML={project.shortDesc}></span>
                    </div>

                    <button onclick={() => mentorEditingOpen = true} class="bg-blue-500 hover:bg-blue-600 p-2 px-3 mb-8 rounded-md text-white">
                        <span>Edit/View Mentor Information</span>
                    </button>

                    <div class="mb-1 flex flex-col">
                        {#each errorMessages as msg}
                        <span class="text-red-600 max-w-[36rem] text-sm">{msg}</span>
                        {/each}
                    </div>
                </div>

                <div class="flex flex-col items-start">
                    <span class="text-2xl font-bold mb-8">Project Report</span>

                    <span class="text-gray-600 max-w-[36rem] text-base mb-4">Your project report can always be uploaded and modified later. If you don't have your project report ready to paste, just skip this step.</span>

                    <span class="text-gray-600 max-w-[36rem] text-base mb-4">To submit or edit your full report, copy your project report and paste it here by pressing the paste keybind on your computer (<code>Meta/Command + V</code> for <code>Mac & Control + V</code> for Windows). </span>

                    <div class="mb-8">
                        <p><pre class="bg-gray-50 p-4 rounded-lg w-[36rem] max-h-96 overflow-y-auto min-h-16 text-wrap text-xs">{project.report}</pre>

                        <input type="text" placeholder="Or type/paste here if you are Jacob Signorovitch '26" class="w-full mt-3 p-2 rounded-lg" oninput={(e) => project.report = e.target.value} />
                    </div>
                </div>
            </div>
            <div class="flex gap-2 items-center">
                <button type="submit" class="relative {status == Status.Saved || status == Status.Unchanged ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}  rounded-md p-2 text-white inline-flex items-center px-3 gap-2" disabled={status == Status.Saved || status == Status.Unchanged} onclick={submitChanges}>
                    <Save />
                    <span>Save</span>
                    {#if status == Status.Unsaved}
                    <div class="absolute bg-red-500 rounded-full -top-2 -right-3 w-6 h-6">
                        <span class='text-sm font-bold'>!</span>
                    </div>
                    {/if}
                </button>
                {#if status == Status.Saving}
                <Circle3 size={32}/>
                {/if}
                {#if status == Status.Error}
                <CircleX color=red size={24}/>
                {/if}
            </div>
        </div>

        <a class="absolute top-0 right-0 m-4" href=/admin/project-center><X /></a>
    </div>
</Modal>

{#if mentorEditingOpen}
<MentorModal mentor={data.mentor} onclose={onMentorEditingClose} />
{/if}

<svelte:window onkeydown={onKeydown} onkeyup={onKeyup} />
