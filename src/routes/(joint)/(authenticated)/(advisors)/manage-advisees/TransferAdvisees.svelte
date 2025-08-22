<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { page } from "$app/state";
    import toast from "svelte-french-toast";

    let advisees = $derived(page.data.students);

    // State
    let isProcessing = $state(false);

    // Custom search state
    let searchQuery = $state("");
    let searchResults = $state([]);
    let isSearching = $state(false);
    let showResults = $state(false);
    let selectedStudents = $state([]);
    let existingFilteredOut = $state(false)

    let adviseeIds = $derived(new Set(advisees.map(advisee => advisee._id)));

    async function handleSearch() {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            searchResults = [];
            showResults = false;
            return;
        }

        isSearching = true;

        try {
            const response = await fetch(`/api/students?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            searchResults = filterExisting(data.students) || [];
            showResults = true;
        } catch (error) {
            console.error('Error searching students:', error);
            searchResults = [];
        } finally {
            isSearching = false;
        }
    }

    const filterExisting = (searchResults: any) => {
        if (!searchResults.length || !advisees.length) {
            return searchResults;
        }

        const filtered = searchResults.filter(student => !adviseeIds.has(student._id));

        existingFilteredOut = filtered.length !== searchResults.length;

        return filtered;
    };

    function selectStudent(student: any) {
        // Check if student is already selected to avoid duplicates
        const isAlreadySelected = selectedStudents.some(s => s.email === student.email);
        if (!isAlreadySelected) {
            selectedStudents.push(student);
        }
        searchQuery = "";
        showResults = false;
    }

    function removeSelectedStudent(studentEmail: string) {
        selectedStudents = selectedStudents.filter(s => s.email !== studentEmail);
    }

    function clearSearch() {
        searchQuery = "";
        selectedStudents = [];
        searchResults = [];
        showResults = false;
    }

    // Debounced search
    let searchTimeout: number;
    $effect(() => {
        clearTimeout(searchTimeout);
        if (searchQuery.trim().length >= 2) {
            searchTimeout = setTimeout(handleSearch, 300);
        } else {
            searchResults = [];
            showResults = false;
        }
    });

    async function handleTransferAdvisee() {
        if (!selectedStudents.length) return;

        isProcessing = true;

        try {
            // Transfer all selected students
            const transfers = selectedStudents.map(student =>
                fetch('/manage-advisees/transfer-advisee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: student._id
                    })
                })
            );

            const responses = await Promise.all(transfers);
            const results = await Promise.all(responses.map(r => r.json()));

            const successCount = responses.filter(r => r.ok).length;
            const failureCount = responses.length - successCount;

            if (successCount > 0) {
                clearSearch();
                invalidate('advisees');
                if (failureCount === 0) {
                    toast.success(`${successCount} student${successCount > 1 ? 's' : ''} transferred successfully`);
                } else {
                    toast.success(`${successCount} student${successCount > 1 ? 's' : ''} transferred successfully, ${failureCount} failed`);
                }

                invalidate("user:adviseeIds")
            } else {
                toast.error('Failed to transfer students');
            }
        } catch (error) {
            console.error('Error transferring students:', error);
            toast.error('Error transferring students');
        } finally {
            isProcessing = false;
        }
    }
</script>

<!-- Transfer Existing Advisees Section -->
<div class="">
    <div class="mb-4">
        <p class="text-xl font-semibold mb-4">Transfer Existing Advisees</p>
        <p class="text-sm text-gray-900 mb-2">Search for an existing student to transfer to your advisee list.</p>
    </div>

    <div class="flex flex-col gap-2">
        <label for="studentSearch" class="text-sm font-medium">Search Student: <span class="text-red-500">*</span></label>
        <div class="relative">
            <input
                id="studentSearch"
                type="text"
                placeholder="Type student name or email..."
                class="w-full p-2 px-3 rounded-md outline-none border border-gray-300 focus:border-blue-500"
                bind:value={searchQuery}
                disabled={isProcessing}
                onblur={() => {
                    // Delay hiding to allow for dropdown clicks
                    setTimeout(() => {
                        showResults = false;
                    }, 150);
                }}
                onfocus={() => {
                    if (searchResults.length > 0 && searchQuery.length >= 2) {
                        showResults = true;
                    }
                }}
            />

            {#if isSearching}
                <div class="absolute right-3 top-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
            {/if}

            <!-- Search Results Dropdown -->
            {#if showResults && searchResults.length > 0}
                <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {#each searchResults as student}
                        {@const isSelected = selectedStudents.some(s => s.email === student.email)}
                        <button
                            type="button"
                            class="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none {isSelected ? 'bg-green-50' : ''}"
                            onclick={() => selectStudent(student)}
                            disabled={isSelected}
                        >
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <div class="text-xs text-gray-500">Class of {student.graduationYear}</div>
                                    <div class='flex justify-between'>
                                        <div class="font-medium text-gray-900">{student.name || '[No name]'}</div>
                                        {#if isSelected}
                                            <div class="text-green-600 text-xs font-medium whitespace-nowrap">✓ Selected</div>
                                        {/if}
                                    </div>
                                    <div class="text-sm text-gray-600">{student.email}</div>
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            {:else if showResults && searchQuery.length >= 2 && !isSearching && existingFilteredOut}
                <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                    <div class="text-sm text-gray-500">All matching students are already your advisees</div>
                </div>
            {:else if showResults && searchQuery.length >= 2 && !isSearching}
                <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
                    <div class="text-sm text-gray-500">No students found matching "{searchQuery}"</div>
                </div>
            {/if}
        </div>

        <!-- Selected Students Display and Transfer Button -->
        {#if selectedStudents.length > 0}
            <div class="mt-2 space-y-2">
                <div class="text-sm font-medium text-gray-700">Selected Students ({selectedStudents.length}):</div>

                {#each selectedStudents as student}
                    <div class="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="text-xs text-blue-600">Class of {student.graduationYear}</div>
                                <div class="font-medium text-blue-900">{student.name || '[No name]'}</div>
                                <div class="text-sm text-blue-700">{student.email}</div>
                            </div>
                            <button
                                type="button"
                                class="text-red-500 hover:text-red-700 text-sm ml-2"
                                onclick={() => removeSelectedStudent(student.email)}
                                title="Remove from selection"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                {/each}

                <div class="flex gap-2 mt-3">
                    <button
                        type="button"
                        class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        onclick={handleTransferAdvisee}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Transferring...' : `Transfer ${selectedStudents.length} Student${selectedStudents.length > 1 ? 's' : ''}`}
                    </button>
                    <button
                        type="button"
                        class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        onclick={clearSearch}
                    >
                        Clear
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>
