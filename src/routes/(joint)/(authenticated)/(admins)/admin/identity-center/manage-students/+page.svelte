<script lang="ts">
    import { page } from "$app/state";
    import { goto, invalidateAll } from "$app/navigation";
    import { Search, UserPlus, Link2, Unlink, Trash2, AlertTriangle, CheckCircle, X, ChevronLeft, ChevronRight, GraduationCap } from "lucide-svelte";
    import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
    import toast from "svelte-french-toast";
    import { currentYear } from "@/lib/utils";
    import YearFilterSelector from "@/client/components/YearFilterSelector.svelte";

    // Search and filter state
    let searchQuery = $state(page.url.searchParams.get('search') || '');

    // Pagination state
    let currentPage = $state(page.data.pagination.currentPage);
    let pageSize = $state(page.data.pagination.limit);

    // Auto-search debounce
    let searchTimeout: number | null = null;
    const SEARCH_DELAY = 500; // 500ms delay after user stops typing

    // Create student form state
    let showCreateForm = $state(false);
    let newStudent = $state({
        firstName: '',
        lastName: '',
        email: '',
        graduationYear: currentYear(),
        advisorId: '' // Optional advisor to assign during creation
    });
    let isCreatingStudent = $state(false);

    // Link advisor state
    let showLinkModal = $state(false);
    let selectedStudentForLinking = $state<any>(null);
    let selectedAdvisorId = $state('');
    let isLinkingAdvisor = $state(false);

    // Delete user state
    let showDeleteModal = $state(false);
    let showUnlinkModal = $state(false);
    let selectedUserForDeletion = $state<any>(null);
    let selectedUserForUnlink = $state<any>(null);
    let isDeletingUser = $state(false);

    // Update graduation year state
    let showUpdateGradYearModal = $state(false);
    let selectedStudentForGradYear = $state<any>(null);
    let newGradYear = $state(currentYear());
    let isUpdatingGradYear = $state(false);

    // Generate graduation year options
    const graduationYearOptions = Array.from({ length: 5 }, (_, i) => currentYear() + i);

    // Email validation function
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

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

    // Create student functions
    async function handleCreateStudent() {
        if (!newStudent.firstName || !newStudent.lastName || !newStudent.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate email format
        if (!isValidEmail(newStudent.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        isCreatingStudent = true;
        try {
            const formData = new FormData();
            formData.append('firstName', newStudent.firstName);
            formData.append('lastName', newStudent.lastName);
            formData.append('email', newStudent.email);
            formData.append('graduationYear', newStudent.graduationYear.toString());

            // Include advisor if selected
            if (newStudent.advisorId) {
                formData.append('advisorId', newStudent.advisorId);
            }

            const response = await fetch('?/createStudent', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.type == "success") {
                toast.success('Student created successfully' + (newStudent.advisorId ? ' and linked to advisor' : ''));
                clearCreateForm();
                await invalidateAll();
            } else {
                toast.error(result.message || 'Failed to create student');
            }
        } catch (error) {
            console.error('Error creating student:', error);
            toast.error('Error creating student');
        } finally {
            isCreatingStudent = false;
        }
    }

    function clearCreateForm() {
        newStudent = {
            firstName: '',
            lastName: '',
            email: '',
            graduationYear: currentYear(),
            advisorId: ''
        };
        showCreateForm = false;
    }

    // Link advisor functions
    function openLinkModal(student: any) {
        selectedStudentForLinking = student;
        selectedAdvisorId = student.advisor?._id || '';
        showLinkModal = true;
    }

    async function handleLinkAdvisor() {
        if (!selectedAdvisorId) {
            toast.error('Please select an advisor');
            return;
        }

        isLinkingAdvisor = true;
        try {
            const formData = new FormData();
            formData.append('studentId', selectedStudentForLinking._id);
            formData.append('advisorId', selectedAdvisorId);

            const response = await fetch('?/linkAdvisor', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.type == "success") {
                toast.success('Advisor linked successfully');
                closeLinkModal();
                await invalidateAll();
            } else {
                toast.error(result.message || 'Failed to link advisor');
            }
        } catch (error) {
            console.error('Error linking advisor:', error);
            toast.error('Error linking advisor');
        } finally {
            isLinkingAdvisor = false;
        }
    }

    async function handleUnlinkAdvisor(student: any) {
        try {
            const formData = new FormData();
            formData.append('studentId', student._id);

            const response = await fetch('?/unlinkAdvisor', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.type == "success") {
                toast.success('Advisor unlinked successfully');
                await invalidateAll();
            } else {
                console.log(response)
                toast.error(result.message || 'Failed to unlink advisor');
            }
        } catch (error) {
            console.error('Error unlinking advisor:', error);
            toast.error('Error unlinking advisor');
        }
    }

    function closeLinkModal() {
        showLinkModal = false;
        selectedStudentForLinking = null;
        selectedAdvisorId = '';
    }

    // Delete user functions
    function openDeleteModal(user: any) {
        selectedUserForDeletion = user;
        showDeleteModal = true;
    }

    async function handleDeleteUser() {
        isDeletingUser = true;
        try {
            const formData = new FormData();
            formData.append('userId', selectedUserForDeletion._id);

            const response = await fetch('?/deleteUser', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.type == "success") {
                toast.success('User deleted successfully');
                closeDeleteModal();
                await invalidateAll();
            } else {
                toast.error(result.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error deleting user');
        } finally {
            isDeletingUser = false;
        }
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        selectedUserForDeletion = null;
    }

    // Unlink advisor functions
    function openUnlinkModal(user: any) {
        selectedUserForUnlink = user;
        showUnlinkModal = true;
    }

    async function confirmUnlinkAdvisor() {
        if (!selectedUserForUnlink) return;
        await handleUnlinkAdvisor(selectedUserForUnlink);
        closeUnlinkModal();
    }

    function closeUnlinkModal() {
        showUnlinkModal = false;
        selectedUserForUnlink = null;
    }

    function canDeleteUser(user: any) {
        return !user.hasCurrentProject && (!user.adviseeIds || user.adviseeIds.length === 0) && !user.lastVisit;
    }

    // Update graduation year functions
    function openUpdateGradYearModal(student: any) {
        selectedStudentForGradYear = student;
        newGradYear = student.graduationYear;
        showUpdateGradYearModal = true;
    }

    async function handleUpdateGradYear() {
        if (!selectedStudentForGradYear || !newGradYear) {
            toast.error('Invalid data');
            return;
        }

        isUpdatingGradYear = true;
        try {
            const formData = new FormData();
            formData.append('studentId', selectedStudentForGradYear._id);
            formData.append('graduationYear', newGradYear.toString());

            const response = await fetch('?/updateGradYear', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.type == "success") {
                toast.success('Graduation year updated successfully');
                closeUpdateGradYearModal();
                await invalidateAll();
            } else {
                toast.error(result.message || 'Failed to update graduation year');
            }
        } catch (error) {
            console.error('Error updating graduation year:', error);
            toast.error('Error updating graduation year');
        } finally {
            isUpdatingGradYear = false;
        }
    }

    function closeUpdateGradYearModal() {
        showUpdateGradYearModal = false;
        selectedStudentForGradYear = null;
        newGradYear = currentYear();
    }
</script>

<main class="grid grid-rows-[auto_auto_auto_1fr_auto] gap-4 p-6 overflow-hidden">
    <!-- Header with search and create button -->
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h1 class="text-3xl font-bold">Manage Advisees</h1>

        <!-- Create new student button -->
        <button
            onclick={() => showCreateForm = true}
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
            <UserPlus size={20} />
            Create Student
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

    <div>
        <YearFilterSelector />
    </div>

    <!-- Students table -->
    <div class="bg-white rounded-lg border border-gray-300">
        <div class="overflow-auto">
            {#key page.data.students}
            <Table striped={true} items={page.data.students} class="w-full">
                <TableHead class="bg-gray-100 sticky top-0 z-10 rounded-lg">
                    <TableHeadCell>Student</TableHeadCell>
                    <TableHeadCell>Advisor</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                </TableHead>
                <TableBody>
                    <TableBodyRow slot="row" let:item class="hover:bg-gray-50">
                        {@const student = item as any}
                        <TableBodyCell>
                            <div class="flex flex-col">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">{student.name || '[No name]'}</span>
                                    <span class="text-xs bg-gray-200 px-2 py-1 rounded">'{student.graduationYear % 100}</span>
                                    {#if Date.now() - new Date(student.createdAt).getTime() < 1000 * 60 * 60 * 24}
                                        <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded animate-pulse">New!</span>
                                    {/if}
                                </div>
                                <span class="text-sm text-gray-600">{student.email}</span>
                            </div>
                        </TableBodyCell>
                        <TableBodyCell>
                            {#if student.advisor}
                                <div class="flex flex-col">
                                    <span class="font-medium">{student.advisor.name}</span>
                                    <span class="text-sm text-gray-600">{student.advisor.email}</span>
                                </div>
                            {:else}
                                <span class="text-gray-500 italic">No advisor assigned</span>
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex items-center gap-2">
                                {#if student.lastVisit}
                                    {@const daysSinceLastVisit = Math.floor((Date.now() - new Date(student.lastVisit).getTime()) / (1000 * 60 * 60 * 24))}
                                    {#if daysSinceLastVisit <= 7}
                                        <CheckCircle size={16} class="text-green-500" />
                                    {:else if daysSinceLastVisit <= 30}
                                        <AlertTriangle size={16} class="text-orange-500" />
                                    {:else}
                                        <AlertTriangle size={16} class="text-red-500" />
                                    {/if}
                                    <span class="text-sm text-gray-600">
                                        {new Date(student.lastVisit).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })} at {new Date(student.lastVisit).toLocaleTimeString('en-US', {
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
                                <!-- Link/Change advisor button -->
                                <button
                                    onclick={() => openLinkModal(student)}
                                    class="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                                    title="Link/Change Advisor"
                                >
                                    <Link2 size={16} />
                                </button>

                                <!-- Update graduation year button -->
                                <button
                                    onclick={() => openUpdateGradYearModal(student)}
                                    class="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                                    title="Update Graduation Year"
                                >
                                    <GraduationCap size={16} />
                                </button>

                                <!-- Unlink advisor button (only show if has advisor, otherwise invisible placeholder) -->
                                {#if student.advisor}
                                    <button
                                        onclick={() => openUnlinkModal(student)}
                                        class="p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                                        title="Unlink Advisor"
                                    >
                                        <Unlink size={16} />
                                    </button>
                                {:else}
                                    <!-- Invisible placeholder to maintain spacing -->
                                    <div class="p-2 rounded-lg invisible pointer-events-none">
                                        <Unlink size={16} />
                                    </div>
                                {/if}

                                <!-- Delete user button (only if safe to delete) -->
                                <button
                                    onclick={() => openDeleteModal(student)}
                                    disabled={!canDeleteUser(student)}
                                    class="p-2 rounded-lg transition-colors"
                                    class:bg-red-500={canDeleteUser(student)}
                                    class:hover:bg-red-600={canDeleteUser(student)}
                                    class:text-white={canDeleteUser(student)}
                                    class:bg-gray-300={!canDeleteUser(student)}
                                    class:text-gray-500={!canDeleteUser(student)}
                                    class:cursor-not-allowed={!canDeleteUser(student)}
                                    title={canDeleteUser(student) ? 'Delete User' : 'Cannot delete: Has has logged in'}
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
                of {page.data.pagination.totalCount} student{page.data.pagination.totalCount !== 1 ? 's' : ''}
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

<!-- Create Student Modal -->
{#if showCreateForm}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Create New Student</h2>

            <form class="flex flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleCreateStudent(); }}>
                <div class="flex gap-2">
                    <div class="flex-1">
                        <label for="firstName" class="block text-sm font-medium mb-1">First Name <span class="text-red-500">*</span></label>
                        <input
                            id="firstName"
                            type="text"
                            bind:value={newStudent.firstName}
                            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div class="flex-1">
                        <label for="lastName" class="block text-sm font-medium mb-1">Last Name <span class="text-red-500">*</span></label>
                        <input
                            id="lastName"
                            type="text"
                            bind:value={newStudent.lastName}
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
                        bind:value={newStudent.email}
                        class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label for="graduationYear" class="block text-sm font-medium mb-1">Graduation Year <span class="text-red-500">*</span></label>
                    <select
                        id="graduationYear"
                        bind:value={newStudent.graduationYear}
                        class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        {#each graduationYearOptions as year}
                            <option value={year}>{year}</option>
                        {/each}
                    </select>
                </div>

                <div>
                    <label for="advisor" class="block text-sm font-medium mb-1">Advisor (Optional)</label>
                    <select
                        id="advisor"
                        bind:value={newStudent.advisorId}
                        class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">No advisor (can be added later)</option>
                        {#each page.data.advisors as advisor}
                            <option value={advisor._id}>{advisor.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                    <div class="flex">
                        <AlertTriangle class="h-5 w-5 text-yellow-400" />
                        <div class="ml-3">
                            <p class="text-sm text-yellow-700">
                                <strong>Important:</strong> This will create a new user in the database.
                                Please verify all information before submitting.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2 mt-4">
                    <button
                        type="submit"
                        disabled={isCreatingStudent}
                        class="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        {isCreatingStudent ? 'Creating...' : 'Create Student'}
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

<!-- Link Advisor Modal -->
{#if showLinkModal && selectedStudentForLinking}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Link Advisor</h2>
            <p class="text-gray-600 mb-4">
                Linking advisor for: <strong>{selectedStudentForLinking.name}</strong>
            </p>

            <div class="mb-4">
                <label for="advisorSelect" class="block text-sm font-medium mb-1">Select Advisor</label>
                <select
                    id="advisorSelect"
                    bind:value={selectedAdvisorId}
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">-- Select an advisor --</option>
                    {#each page.data.advisors as advisor}
                        <option value={advisor._id}>
                            {advisor.name} ({advisor.email})
                        </option>
                    {/each}
                </select>
            </div>

            <div class="flex gap-2">
                <button
                    onclick={handleLinkAdvisor}
                    disabled={isLinkingAdvisor || !selectedAdvisorId}
                    class="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
                >
                    {isLinkingAdvisor ? 'Linking...' : 'Link Advisor'}
                </button>
                <button
                    onclick={closeLinkModal}
                    class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
{/if}

<!-- Delete User Confirmation Modal -->
{#if showDeleteModal && selectedUserForDeletion}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4 text-red-600">Confirm Deletion</h2>
            <p class="text-gray-600 mb-4">
                Are you sure you want to delete <strong>{selectedUserForDeletion.name}</strong>?
            </p>
            <p class="text-sm text-red-600 mb-4">
                This action cannot be undone.
            </p>

            <div class="flex gap-2">
                <button
                    onclick={handleDeleteUser}
                    disabled={isDeletingUser}
                    class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-md transition-colors"
                >
                    {isDeletingUser ? 'Deleting...' : 'Delete User'}
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

<!-- Unlink Advisor Confirmation Modal -->
{#if showUnlinkModal && selectedUserForUnlink}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4 text-orange-600">Confirm Unlink Advisor</h2>
            <p class="text-gray-600 mb-4">
                Are you sure you want to unlink the advisor from <strong>{selectedUserForUnlink.name}</strong>?
            </p>
            {#if selectedUserForUnlink.advisor}
                <p class="text-sm text-gray-500 mb-4">
                    Current advisor: <strong>{selectedUserForUnlink.advisor.name}</strong>
                </p>
            {/if}
            <p class="text-sm text-orange-600 mb-4">
                The student will no longer have an advisor assigned.
            </p>

            <div class="flex gap-2">
                <button
                    onclick={confirmUnlinkAdvisor}
                    class="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                    Unlink Advisor
                </button>
                <button
                    onclick={closeUnlinkModal}
                    class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
{/if}

<!-- Update Graduation Year Modal -->
{#if showUpdateGradYearModal && selectedStudentForGradYear}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4 text-green-600">Update Graduation Year</h2>
            <p class="text-gray-600 mb-4">
                Updating graduation year for: <strong>{selectedStudentForGradYear.name}</strong>
            </p>
            <p class="text-sm text-gray-500 mb-4">
                Current graduation year: <strong>{selectedStudentForGradYear.graduationYear}</strong>
            </p>

            <div class="mb-4">
                <label for="gradYearSelect" class="block text-sm font-medium mb-1">New Graduation Year</label>
                <select
                    id="gradYearSelect"
                    bind:value={newGradYear}
                    class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                    {#each graduationYearOptions as year}
                        <option value={year}>{year}</option>
                    {/each}
                </select>
            </div>

            <div class="flex gap-2">
                <button
                    onclick={handleUpdateGradYear}
                    disabled={isUpdatingGradYear || newGradYear === selectedStudentForGradYear.graduationYear}
                    class="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-md transition-colors"
                >
                    {isUpdatingGradYear ? 'Updating...' : 'Update Graduation Year'}
                </button>
                <button
                    onclick={closeUpdateGradYearModal}
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
