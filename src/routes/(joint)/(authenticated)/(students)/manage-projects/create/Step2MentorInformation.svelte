<script lang=ts>
    let { mentorInformation = $bindable(), step = $bindable() } = $props();

    let errorMessages = $state([]);

    const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    const PHONE_REGEX = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/

    function continueInvoked() {
        errorMessages = []

        if (!/.+\ .+/.test(mentorInformation.fullName)) {
            errorMessages.push("Please enter the full name of your mentor.");
        }
        if (mentorInformation.fullName.length > 200) {
            errorMessages.push("Mentor full name cannot be longer than 200 characters.");
        }
        mentorInformation.fullName = mentorInformation.fullName.trim();

        if (!/.+/.test(mentorInformation.organization)) {
            errorMessages.push(
                "Please enter the relevant organization your mentor is associated with for your project.",
            );
        }
        if (mentorInformation.organization.length > 200) {
            errorMessages.push(
                "Mentor organization cannot be more than 200 characters long.",
            );
        }
        mentorInformation.organization = mentorInformation.organization.trim();

        if (!EMAIL_REGEX.test(mentorInformation.email)) {
            errorMessages.push("Please enter a valid mentor email address.");
        }
        if (mentorInformation.email.length > 200) {
            errorMessages.push("Mentor email should not be longer than 200 characters.");
        }
        mentorInformation.email = mentorInformation.email.trim();

        if (!PHONE_REGEX.test(mentorInformation.phoneNumber) && mentorInformation.phoneNumber.trim().length != 0) {
            errorMessages.push(
                "Please enter a valid mentor phone number in the form +1 555-555-5555.",
            );
        }
        if (mentorInformation.phoneNumber.length > 100) {
            errorMessages.push("Mentor phone number should not be longer than 100 characters.");
        }
        mentorInformation.phoneNumber = mentorInformation.phoneNumber.trim();

        if(errorMessages.length == 0) {
            step = 3;
        }
    }
</script>

<span class="text-2xl font-bold mb-8">Step 2: Mentor Information</span>

<div class="flex flex-col items-start mb-4">
    <span class="text-xl mb-2">Mentor Full Name: </span>
    <span contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[32rem]" bind:innerHTML={mentorInformation.fullName}></span>
    <span class="text-gray-600 max-w-[24rem] text-sm">Ex: Thomas Zhou, Bill Gates (just the name, no titles, etc.)</span>
</div>

<div class="flex flex-col items-start mb-4">
    <span class="text-xl mb-2">Mentor Organization: </span>
    <span contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[32rem]" bind:innerHTML={mentorInformation.organization}></span>
    <span class="text-gray-600 max-w-[24rem] text-sm">Ex: Brookline Food Pantry, Center of Inclusive Computing at Northeastern University, Columbia University, Kaggle, Commonwealth School</span>
</div>

<div class="flex flex-col items-start mb-4">
    <span class="text-xl mb-2">Mentor Email: </span>
    <span contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[32rem]" bind:innerHTML={mentorInformation.email}></span>
    <span class="text-gray-600 max-w-[24rem] text-sm">Ex: tzhou@commschool.org</span>
</div>

<div class="flex flex-col items-start mb-4">
    <span class="text-xl mb-2">Mentor Phone: </span>
    <span class="text-gray-600 max-w-[24rem] text-sm mb-1">*Optional</span>
    <span contenteditable="plaintext-only" class="mb-1 text-base rounded-md bg-gray-50 p-2 border-gray-400 border min-w-72 max-w-[32rem]" bind:innerHTML={mentorInformation.phoneNumber}></span>
    <span class="text-gray-600 max-w-[24rem] text-sm">Ex: +1 (427)-211-9772, 324-474-1106, 8568224318</span>
</div>

<div class="mb-1 flex flex-col">
    {#each errorMessages as msg}
    <span class="text-red-600 max-w-[36rem] text-sm">{msg}</span>
    {/each}
</div>

<div class='flex items-center justify-start gap-4'>
    <button class="p-2 px-5 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center" onclick={() => step = 1}>
        <span>Go Back</span>
    </button>
    <button class="p-2 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center" onclick={continueInvoked}>
        <span>Continue</span>
    </button>
</div>
