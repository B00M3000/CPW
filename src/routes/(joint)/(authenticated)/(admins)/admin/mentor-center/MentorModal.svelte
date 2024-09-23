<script lang=ts>
    import Modal from "@/client/components/Modal.svelte";
    import { Circle3 } from "svelte-loading-spinners";
    import { X, Save, CircleCheckBig, CircleX } from "lucide-svelte";

    let { mentor, onclose } = $props();

    enum Status {
        Unchanged,
        Unsaved,
        Saving,
        Saved,
        Error
    }

    let name = $state(mentor.name);
    let email = $state(mentor.email);
    let organization = $state(mentor.organization);
    let phoneNumber = $state(mentor.phoneNumber || "");

    let changed = $derived(name != mentor.name || email != mentor.email || organization != mentor.organization || phoneNumber != (mentor.phoneNumber || ""))

    let status = $state(Status.Unchanged);

    $effect(() => {
        name;
        email;
        organization;
        phoneNumber;
        if(changed) status = Status.Unsaved;
        if(!changed) status = Status.Unchanged;
    })

    const EMAIL_REGEX = /.+@.+\..+/;
    const PHONE_REGEX = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

    let errorMessages: string[] = $state([]);

    async function updateInformation(event: SubmitEvent) {
        event.preventDefault();

        errorMessages = []

        name = name.trim();
        if (!/.+\ .+/.test(name)) {
            errorMessages.push("Please enter the full name of your mentor.");
        }
        if (name.length > 200) {
            errorMessages.push("Mentor full name cannot be longer than 200 characters.");
        }

        organization = organization.trim();
        if (!/.+/.test(organization)) {
            errorMessages.push(
                "Please enter the relevant organization your mentor is associated with for your project.",
            );
        }
        if (organization.length > 200) {
            errorMessages.push(
                "Mentor organization cannot be more than 200 characters long.",
            );
        }


        email = email.trim();
        if (!EMAIL_REGEX.test(email)) {
            errorMessages.push("Please enter a valid mentor email address.");
        }
        if (email.length > 200) {
            errorMessages.push("Mentor email should not be longer than 200 characters.");
        }

        phoneNumber = phoneNumber.trim();
        if (!PHONE_REGEX.test(phoneNumber) && phoneNumber.trim().length != 0) {
            errorMessages.push(
                "Please enter a valid mentor phone number in the form +1 555-555-5555.",
            );
        }
        if (phoneNumber.length > 100) {
            errorMessages.push("Mentor phone number should not be longer than 100 characters.");
        }

        if(errorMessages.length > 0) return;

        status = Status.Saving

        const res = await fetch('/admin/api/mentor/edit', {
            method: "POST",
            body: JSON.stringify({
                _id: mentor._id,
                name,
                email,
                organization,
                phoneNumber
            })
        });

        if(res.ok) onclose();
        else status = Status.Error;
    }
</script>

<Modal>
    <div class="relative">
        <form class="flex flex-col rounded-lg bg-gray-300 p-8 items-start" onsubmit={updateInformation}>
            <span class="text-2xl font-bold mb-4">Mentor Details</span>

            <div class="grid grid-rows-[auto_auto] grid-cols-[auto_auto] gap-4 mb-2">
                <div class="flex flex-col items-start">
                    <span class="text-lg mb-1">Mentor Full Name: </span>
                    <span bind:innerHTML={name} contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[16rem]"></span>
                    <span class="text-gray-600 max-w-[24rem] text-sm">Ex: Thomas Zhou, Bill Gates (just the name, no titles, etc.)</span>
                </div>

                <div class="flex flex-col items-start">
                    <span class="text-lg mb-1">Mentor Email: </span>
                    <span bind:innerHTML={email} contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[16rem]"></span>
                    <span class="text-gray-600 max-w-[24rem] text-sm">Ex: tzhou@commschool.org</span>
                </div>

                <div class="flex flex-col items-start">
                    <span class="text-lg mb-1">Mentor Organization: </span>
                    <span bind:innerHTML={organization} contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[16rem]"></span>
                    <span class="text-gray-600 max-w-[24rem] text-sm">Ex: Brookline Food Pantry, Center of Inclusive Computing at Northeastern University, Columbia University, Kaggle, Commonwealth School</span>
                </div>

                <div class="flex flex-col items-start">
                    <span class="text-lg mb-1">Mentor Phone: </span>
                    <span class="text-gray-600 max-w-[24rem] text-sm mb-1">*Optional</span>
                    <span bind:innerHTML={phoneNumber} contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[16rem]"></span>
                    <span class="text-gray-600 max-w-[24rem] text-sm">Ex: +1 (427)-211-9772, 324-474-1106, 8568224318</span>
                </div>
            </div>
            <div class="mb-3 flex flex-col">
                {#each errorMessages as msg}
                <span class="text-red-600 max-w-[36rem] text-sm">{msg}</span>
                {/each}
            </div>
            <div class="flex gap-2 items-center">
                <button type="submit" class="relative {status == Status.Saved || status == Status.Unchanged ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}  rounded-md p-2 text-white inline-flex items-center px-3 gap-2" disabled={status == Status.Saved || status == Status.Unchanged}>
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
        </form>
        <button class="absolute top-0 right-0 m-4" onclick={onclose}><X /></button>
    </div>
</Modal>
