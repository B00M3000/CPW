<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { page } from "$app/state";
    import toast from "svelte-french-toast";

    let advisees = $derived(page.data.students);

    // State for multi-selection dropdown
    let showDropdown = $state(false);
    let selectedAdvisees = $state([]);
    let isProcessing = $state(false);

    // Helper function to get display name
    function getDisplayName(advisee: any) {
        return advisee.name || advisee.firstName || advisee.lastName || '[No name]';
    }

    // Actions
    function toggleAdviseeSelection(advisee: any) {
        const isSelected = selectedAdvisees.some(s => s._id === advisee._id);
        if (isSelected) {
            selectedAdvisees = selectedAdvisees.filter(s => s._id !== advisee._id);
        } else {
            selectedAdvisees = [...selectedAdvisees, advisee];
        }
    }

    function removeSelectedAdvisee(adviseeId: string) {
        selectedAdvisees = selectedAdvisees.filter(s => s._id !== adviseeId);
    }

    function clearSelection() {
        selectedAdvisees = [];
        showDropdown = false;
    }

    async function handleUnlinkAdvisees() {
        if (!selectedAdvisees.length) return;

        isProcessing = true;

        try {
            // Unlink all selected advisees
            const unlinkPromises = selectedAdvisees.map(advisee =>
                fetch('/manage-advisees/unlink-advisee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: advisee._id
                    })
                })
            );

            const responses = await Promise.all(unlinkPromises);
            const results = await Promise.all(responses.map(r => r.json()));

            const successCount = responses.filter(r => r.ok).length;
            const failureCount = responses.length - successCount;

            if (successCount > 0) {
                clearSelection();
                invalidate("user:adviseeIds");
                if (failureCount === 0) {
                    toast.success(`${successCount} advisee${successCount > 1 ? 's' : ''} unlinked successfully`);
                } else {
                    toast.success(`${successCount} advisee${successCount > 1 ? 's' : ''} unlinked successfully, ${failureCount} failed`);
                }
            } else {
                toast.error('Failed to unlink advisees');
            }
        } catch (error) {
            console.error('Error unlinking advisees:', error);
            toast.error('Error unlinking advisees');
        } finally {
            isProcessing = false;
        }
    }
</script>

<div>
    <!-- Unlink Advisee Section -->
    {#if advisees.length > 0}
        <div class="mb-4">
            <p class="text-xl font-semibold mb-4">Unlink Advisees</p>
        </div>

        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <label for="adviseeSelect" class="text-sm font-medium">Select Advisees to Unlink: <span class="text-red-500">*</span></label>
                <div class="relative">
                    <button
                        id="adviseeSelect"
                        type="button"
                        class="w-full p-2 px-3 rounded-md outline-none border border-gray-300 focus:border-red-500 text-left bg-white hover:bg-gray-50"
                        onclick={() => showDropdown = !showDropdown}
                        onblur={() => {
                            // Delay hiding to allow for dropdown clicks
                            setTimeout(() => {
                                showDropdown = false;
                            }, 150);
                        }}
                        disabled={isProcessing}
                    >
                        {#if selectedAdvisees.length === 0}
                            <span class="text-gray-500">Select advisees...</span>
                        {:else}
                            <span>{selectedAdvisees.length} advisee{selectedAdvisees.length > 1 ? 's' : ''} selected</span>
                        {/if}
                        <span class="float-right">▼</span>
                    </button>

                    <!-- Dropdown -->
                    {#if showDropdown}
                        <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {#each advisees as advisee}
                                {@const isSelected = selectedAdvisees.some(s => s._id === advisee._id)}
                                <button
                                    type="button"
                                    class="w-full text-left px-3 py-2 hover:bg-red-50 border-b border-gray-100 last:border-b-0 focus:bg-red-50 focus:outline-none {isSelected ? 'bg-red-50' : ''}"
                                    onclick={() => toggleAdviseeSelection(advisee)}
                                >
                                    <div class="flex justify-between items-start">
                                        <div class="flex-1">
                                            <div class="text-xs text-gray-500">Class of {advisee.graduationYear}</div>
                                            <div class="flex items-cente justify-between">
                                                <div class="font-medium text-gray-900">{getDisplayName(advisee)}</div>
                                                {#if isSelected}
                                                    <div class="text-red-600 text-xs font-medium whitespace-nowrap">✓ Selected</div>
                                                {/if}
                                            </div>
                                            <div class="text-sm text-gray-600">{advisee.email}</div>
                                        </div>

                                    </div>
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>

                <!-- Selected Advisees Display -->
                {#if selectedAdvisees.length > 0}
                    <div class="mt-2 space-y-2">
                        <div class="text-sm font-medium text-gray-700">Selected Advisees ({selectedAdvisees.length}):</div>

                        {#each selectedAdvisees as advisee}
                            <div class="p-3 bg-red-50 border border-red-200 rounded-md">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="text-xs text-red-600">Class of {advisee.graduationYear}</div>
                                        <div class="font-medium text-red-900">{getDisplayName(advisee)}</div>
                                        <div class="text-sm text-red-700">{advisee.email}</div>
                                    </div>
                                    <button
                                        type="button"
                                        class="text-red-500 hover:text-red-700 text-sm ml-2"
                                        onclick={() => removeSelectedAdvisee(advisee._id)}
                                        title="Remove from selection"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="flex gap-2">
                {#if selectedAdvisees.length > 0}
                    <button
                        type="button"
                        class="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        onclick={handleUnlinkAdvisees}
                        disabled={isProcessing || selectedAdvisees.length === 0}
                    >
                        {isProcessing ? 'Unlinking...' : `Unlink ${selectedAdvisees.length} Advisee${selectedAdvisees.length !== 1 ? 's' : ''}`}
                    </button>
                    <button
                        type="button"
                        class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        onclick={clearSelection}
                    >
                        Clear
                    </button>
                {/if}
            </div>
        </div>
    {:else}
        <div class="mb-4">
            <p class="text-xl font-semibold mb-4">Unlink Advisee</p>
            <p class="text-gray-500 text-center mb-4">No advisees to unlink</p>
        </div>
    {/if}
</div>
