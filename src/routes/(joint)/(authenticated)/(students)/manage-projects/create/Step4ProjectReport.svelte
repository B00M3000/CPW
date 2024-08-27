<script lang=ts>
    let { step = $bindable(), setFullReport } = $props();

    let ctrlDown = $state(false);
    let vDown = $state(false);
    let isChanged = $state(false);
    let fullReport = $state();

    async function handlePaste(){
        fullReport = await navigator.clipboard.readText()
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

    function onContinue() {
        if(isChanged) {
            setFullReport(fullReport);
        }
        step = 5;
    }
</script>

<span class="text-2xl font-bold mb-8">Step 4: Project Report</span>

<span class="text-gray-600 max-w-[36rem] text-base mb-4">Your project report can always be uploaded and modified later. If you don't have your project report ready to paste, just skip this step.</span>

<span class="text-gray-600 max-w-[36rem] text-base mb-4">To submit or edit your full report, copy your project report and paste it here by pressing the paste keybind on your computer (<code>Meta/Command + V</code> for <code>Mac & Control + V</code> for Windows). </span>

<div class="mb-8">
    <p><pre class="bg-gray-50 p-4 rounded-lg w-[36rem] max-h-96 overflow-y-auto min-h-16 text-wrap text-xs">{fullReport}</pre>

    <input type="text" placeholder="Or type/paste here if you are Jacob Signorovitch '26" class="w-full mt-3 p-2 rounded-lg" oninput={(e) => fullReport = e.target.value} />
</div>

<div class='flex items-center justify-start gap-4'>
    <button class="p-2 px-5 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center" onclick={() => step = 3}>
        <span>Go Back</span>
    </button>
    <button class="p-2 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center" onclick={() => onContinue()}>
        <span>Continue</span>
    </button>
</div>

<svelte:window onkeydown={onKeydown} onkeyup={onKeyup} />
