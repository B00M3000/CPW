<script lang="ts">
    import { page } from "$app/state";
    import { goto, invalidateAll } from "$app/navigation";
    import { Search, UserPlus, Trash2, AlertTriangle, CheckCircle, X, ChevronLeft, ChevronRight } from "lucide-svelte";
    import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
    import toast from "svelte-french-toast";
    import { currentYear } from "@/lib/utils";

    // Search and filter state
    let searchQuery = $state(page.url.searchParams.get('search') || '');

    // Pagination state
    let currentPage = $state(page.data.pagination.currentPage);
    let pageSize = $state(page.data.pagination.limit);

    // Auto-search debounce
    let searchTimeout: number | null = null;
    const SEARCH_DELAY = 500; // 500ms delay after user stops typing

    // Email validation function
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Create advisor form state
    let showCreateForm = $state(false);
    let newAdvisor = $state({
        firstName: '',
        lastName: '',
        email: ''
    });
    let isCreatingAdvisor = $state(false);

    // Delete advisor state
    let showDeleteModal = $state(false);
    let selectedAdvisorForDeletion = $state<any>(null);
    let isDeletingAdvisor = $state(false);

    // Handle search and filter changes
    function handleSearch() {
        const url = new URL(window.location.href);
        if (searchQuery) {
            url.searchParams.set('search', searchQuery);
        } else {
            url.searchParams.delete('search');
        }
        // Reset to page 1 when searching
        url.searchParams.delete('page');
        goto(url.toString(), { keepFocus: true, noScroll: true });
    }

    // Debounced search function for auto-update
    function handleSearchInput() {
        // Clear any existing timeout
        if (searchTimeout !== null) {
            clearTimeout(searchTimeout);
        }

        // Set a new timeout to trigger search after delay
        searchTimeout = setTimeout(() => {
            handleSearch();
        }, SEARCH_DELAY);
    }

    // Pagination functions
    function goToPage(pageNum: number) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', pageNum.toString());
        goto(url.toString(), { keepFocus: true, noScroll: true });
    }

    function changePageSize(newSize: number) {
        const url = new URL(window.location.href);
        url.searchParams.set('limit', newSize.toString());
        url.searchParams.delete('page'); // Reset to page 1
        goto(url.toString(), { keepFocus: true, noScroll: true });
    }

    // Generate page numbers for pagination
    function getPageNumbers() {
        const { currentPage, totalPages } = page.data.pagination;
        const delta = 2; // Show 2 pages on each side of current page
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots.filter((item, index, array) => {
            // Remove duplicate 1s or totalPages
            return !(item === 1 && array[index - 1] === 1) &&
                   !(item === totalPages && array[index - 1] === totalPages);
        });
    }

    // Create advisor functions
    async function handleCreateAdvisor() {
        if (!newAdvisor.firstName || !newAdvisor.lastName || !newAdvisor.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate email format
        if (!isValidEmail(newAdvisor.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        isCreatingAdvisor = true;
        try {
            const formData = new FormData();
            formData.append('firstName', newAdvisor.firstName);
            formData.append('lastName', newAdvisor.lastName);
            formData.append('email', newAdvisor.email);

            const response = await fetch('?/createAdvisor', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.type == "success") {
                toast.success('Advisor created successfully');
                clearCreateForm();
                await invalidateAll();
            } else {
                toast.error(result.message || 'Failed to create advisor');
            }
        } catch (error) {
            console.error('Error creating advisor:', error);
            toast.error('Error creating advisor');
        } finally {
            isCreatingAdvisor = false;
        }
    }

    function clearCreateForm() {
        newAdvisor = {
            firstName: '',
            lastName: '',
            email: ''
        };
        showCreateForm = false;
    }

    // Delete advisor functions
    function openDeleteModal(advisor: any) {
        selectedAdvisorForDeletion = advisor;
        showDeleteModal = true;
    }

    async function handleDeleteAdvisor() {
        isDeletingAdvisor = true;
        try {
            const formData = new FormData();
            formData.append('advisorId', selectedAdvisorForDeletion._id);

            const response = await fetch('?/deleteAdvisor', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.type == "success") {
                toast.success('Advisor deleted successfully');
                closeDeleteModal();
                await invalidateAll();
            } else {
                toast.error(result.message || 'Failed to delete advisor');
            }
        } catch (error) {
            console.error('Error deleting advisor:', error);
            toast.error('Error deleting advisor');
        } finally {
            isDeletingAdvisor = false;
        }
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        selectedAdvisorForDeletion = null;
    }
</script>

<main class="grid grid-rows-[auto_auto_1fr_auto] gap-4 p-6 overflow-hidden">
    <!-- Header with search and create button -->
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h1 class="text-3xl font-bold">Manage Advisors</h1>

        <!-- Create new advisor button -->
        <button
            onclick={() => showCreateForm = true}
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
            <UserPlus size={20} />
            Create Advisor
        </button>
    </div>

    <!-- Search bar -->
    <div class="flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-2 min-w-[300px] max-w-3xl">
        <Search size={20} class="text-gray-400 mb-[2px]" />
        <input
            type="text"
            placeholder="Search by name, email..."
            bind:value={searchQuery}
            oninput={handleSearchInput}
            onkeydown={(e) => e.key === 'Enter' && handleSearch()}
            class="flex-1 outline-none"
        />
        {#if searchQuery}
            <button onclick={() => { searchQuery = ''; handleSearch(); }} class="text-gray-400 hover:text-gray-600">
                <X size={16} />
            </button>
        {/if}
    </div>

    <!-- Advisors table -->
    <div class="bg-white rounded-lg border border-gray-300">
        <div class="overflow-auto">
            {#key page.data.advisors}
            <Table striped={true} items={page.data.advisors} class="w-full">
                <TableHead class="bg-gray-100 sticky top-0 z-10 rounded-lg">
                    <TableHeadCell>Advisor</TableHeadCell>
                    <TableHeadCell>Advisees</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                </TableHead>
                <TableBody>
                    <TableBodyRow slot="row" let:item class="hover:bg-gray-50">
                        {@const advisor = item as any}
                        <TableBodyCell>
                            <div class="flex flex-col">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">{advisor.name || '[No name]'}</span>
                                    {#if Date.now() - new Date(advisor.createdAt).getTime() < 1000 * 60 * 60 * 24}
                                        <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded animate-pulse">New!</span>
                                    {/if}
                                </div>
                                <span class="text-sm text-gray-600">{advisor.email}</span>
                            </div>
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex items-center gap-2">
                                <span class="font-medium">{advisor.adviseeCount}</span>
                                <span class="text-sm text-gray-600">
                                    {advisor.adviseeCount === 1 ? 'advisee' : 'advisees'}
                                </span>
                            </div>
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex items-center gap-2">
                                {#if advisor.lastVisit}
                                    {@const daysSinceLastVisit = Math.floor((Date.now() - new Date(advisor.lastVisit).getTime()) / (1000 * 60 * 60 * 24))}
                                    {#if daysSinceLastVisit <= 7}
                                        <CheckCircle size={16} class="text-green-500" />
                                    {:else if daysSinceLastVisit <= 30}
                                        <AlertTriangle size={16} class="text-orange-500" />
                                    {:else}
                                        <AlertTriangle size={16} class="text-red-500" />
                                    {/if}
                                    <span class="text-sm text-gray-600">
                                        {new Date(advisor.lastVisit).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })} at {new Date(advisor.lastVisit).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                {:else}
                                    <X size={20} class="text-red-500 animate-pulse" />
                                    <span class="text-sm text-gray-600">Never logged in</span>
                                {/if}
                            </div>
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex items-center gap-2">
                                <!-- Delete advisor button -->
                                <button
                                    onclick={() => openDeleteModal(advisor)}
                                    class="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                                    title="Delete Advisor"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </TableBodyCell>
                    </TableBodyRow>
                </TableBody>
            </Table>
            {/key}
        </div>
    </div>

    <!-- Results count and pagination controls -->
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div class="flex flex-col gap-2">
            <div class="text-sm text-gray-600">
                Showing {((page.data.pagination.currentPage - 1) * page.data.pagination.limit) + 1} to
                {Math.min(page.data.pagination.currentPage * page.data.pagination.limit, page.data.pagination.totalCount)}
                of {page.data.pagination.totalCount} advisor{page.data.pagination.totalCount !== 1 ? 's' : ''}
            </div>

            <!-- Page size selector -->
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Show:</span>
                <select
                    value={pageSize}
                    onchange={(e) => {
                        const target = e.target as HTMLSelectElement;
                        changePageSize(parseInt(target.value));
                    }}
                    class="text-sm border border-gray-300 bg-gray-300 rounded px-2 py-1"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span class="text-sm text-gray-600">per page</span>
            </div>
        </div>

        <!-- Pagination controls -->
        {#if page.data.pagination.totalPages > 1}
            <div class="flex items-center gap-1">
                <!-- Previous button -->
                <button
                    onclick={() => goToPage(page.data.pagination.currentPage - 1)}
                    disabled={!page.data.pagination.hasPrevPage}
                    class="p-2 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                    title="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                <!-- Page numbers -->
                {#each getPageNumbers() as pageNum}
                    {#if pageNum === '...'}
                        <span class="px-3 py-2 text-gray-500">...</span>
                    {:else}
                        <button
                            onclick={() => goToPage(pageNum)}
                            class="px-3 py-2 rounded-lg border transition-colors"
                            class:bg-blue-500={pageNum === page.data.pagination.currentPage}
                            class:text-white={pageNum === page.data.pagination.currentPage}
                            class:border-blue-500={pageNum === page.data.pagination.currentPage}
                            class:border-gray-300={pageNum !== page.data.pagination.currentPage}
                            class:hover:bg-gray-50={pageNum !== page.data.pagination.currentPage}
                        >
                            {pageNum}
                        </button>
                    {/if}
                {/each}

                <!-- Next button -->
                <button
                    onclick={() => goToPage(page.data.pagination.currentPage + 1)}
                    disabled={!page.data.pagination.hasNextPage}
                    class="p-2 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                    title="Next page"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        {/if}
    </div>
</main>

<!-- Create Advisor Modal -->
{#if showCreateForm}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Create New Advisor</h2>

            <form class="flex flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleCreateAdvisor(); }}>
                <div class="flex gap-2">
                    <div class="flex-1">
                        <label for="firstName" class="block text-sm font-medium mb-1">First Name <span class="text-red-500">*</span></label>
                        <input
                            id="firstName"
                            type="text"
                            bind:value={newAdvisor.firstName}
                            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div class="flex-1">
                        <label for="lastName" class="block text-sm font-medium mb-1">Last Name <span class="text-red-500">*</span></label>
                        <input
                            id="lastName"
                            type="text"
                            bind:value={newAdvisor.lastName}
                            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium mb-1">Email <span class="text-red-500">*</span></label>
                    <input
                        id="email"
                        type="email"
                        bind:value={newAdvisor.email}
                        class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                    <div class="flex">
                        <AlertTriangle class="h-5 w-5 text-yellow-400" />
                        <div class="ml-3">
                            <p class="text-sm text-yellow-700">
                                <strong>Important:</strong> This will create a new advisor in the database.
                                Please verify all information before submitting.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 mt-4">
                    <button
                        type="submit"
                        disabled={isCreatingAdvisor}
                        class="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        {isCreatingAdvisor ? 'Creating...' : 'Create Advisor'}
                    </button>
                    <button
                        type="button"
                        onclick={clearCreateForm}
                        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Delete Advisor Confirmation Modal -->
{#if showDeleteModal && selectedAdvisorForDeletion}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4 text-red-600">Confirm Deletion</h2>
            <p class="text-gray-600 mb-4">
                Are you sure you want to delete <strong>{selectedAdvisorForDeletion.name}</strong>?
            </p>
            {#if selectedAdvisorForDeletion.adviseeCount > 0}
                <p class="text-sm text-orange-600 mb-4">
                    <strong>Warning:</strong> This advisor currently has {selectedAdvisorForDeletion.adviseeCount}
                    {selectedAdvisorForDeletion.adviseeCount === 1 ? 'advisee' : 'advisees'}.
                    Those students will no longer have an advisor.
                </p>
            {/if}
            <p class="text-sm text-red-600 mb-4">
                This action cannot be undone.
            </p>

            <div class="flex gap-2">
                <button
                    onclick={handleDeleteAdvisor}
                    disabled={isDeletingAdvisor}
                    class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md transition-colors"
                >
                    {isDeletingAdvisor ? 'Deleting...' : 'Delete Advisor'}
                </button>
                <button
                    onclick={closeDeleteModal}
                    class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    :global(.table-auto) {
        min-width: 100%;
    }
</style>
