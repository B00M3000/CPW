<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { currentYear } from "@/lib/utils";
    import toast from "svelte-french-toast";

    // Form variables for creating new students
    let newStudentFirstName = $state("");
    let newStudentLastName = $state("");
    let newStudentEmail = $state("");
    let newStudentGradYear = $state("");
    let isCreatingStudent = $state(false);

    // Generate graduation year options (current year + 3 years into the future)
    const currentYearValue = currentYear();
    let graduationYearOptions: number[] = [];
    for (let year = currentYearValue; year <= currentYearValue + 3; year++) {
        graduationYearOptions.push(year);
    }

    async function handleCreateStudent(event: Event) {
        event.preventDefault();
        if (!newStudentFirstName || !newStudentLastName || !newStudentEmail || !newStudentGradYear) return;

        isCreatingStudent = true;

        try {
            const response = await fetch('/manage-advisees/create-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: newStudentFirstName,
                    lastName: newStudentLastName,
                    email: newStudentEmail,
                    graduationYear: parseInt(newStudentGradYear)
                })
            });

            if (response.ok) {
                // Clear form and refresh advisees list
                clearForm();
                toast.success('Student created successfully');
            } else {
                console.error('Failed to create student');
                toast.error('Failed to create student');
            }
        } catch (error) {
            console.error('Error creating student:', error);
            toast.error('Error creating student');
        } finally {
            isCreatingStudent = false;
            await invalidate("user:adviseeIds");
        }
    }

    function clearForm() {
        newStudentFirstName = "";
        newStudentLastName = "";
        newStudentEmail = "";
        newStudentGradYear = "";
    }
</script>

<div class="bg-gray-200 border border-gray-400 border-solid rounded-xl shadow-xl p-6 w-xs overflow-y-auto">
    <h2 class="text-xl font-semibold mb-4">Add New Advisee</h2>
    <div class="mb-4">
        <p class="text-base font-medium text-red-700 mb-1">IMPORTANT:</p>
        <ul class="text-sm text-gray-900 list-disc list-inside ml-2 space-y-1">
            <li>This form makes can potentially make harmful changes to the database, please verify your input before submitting!</li>
            <li>After submitting, please check in the table to your right to verify that the student has been added.</li>
            <li>Please report any accidental creations to Anna Moss to maintain database integrity.</li>
            <li>If you encounter any issues or misenter anything, please shoot an email to Anna Moss.</li>
        </ul>
    </div>
    <form class="flex flex-col gap-4" onsubmit={handleCreateStudent}>
        <div class="flex flex-col gap-2">
            <label for="firstName" class="text-sm font-medium">Name: <span class="text-red-500">*</span></label>
            <div class="flex items-center gap-2">
                <input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    class="p-2 px-3 rounded-md outline-none border w-30 border-gray-300 focus:border-blue-500"
                    bind:value={newStudentFirstName}
                    required
                />
                <input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    class="p-2 px-3 rounded-md outline-none border w-30 border-gray-300 focus:border-blue-500"
                    bind:value={newStudentLastName}
                    required
                />
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium">Student Email: <span class="text-red-500">*</span></label>
            <input
                id="email"
                type="email"
                placeholder="Enter student email..."
                class="p-2 px-3 rounded-md outline-none border border-gray-300 focus:border-blue-500"
                bind:value={newStudentEmail}
                required
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="graduationYear" class="text-sm font-medium">Graduation Year: <span class="text-red-500">*</span></label>
            <select
                id="graduationYear"
                class="p-2 px-3 rounded-md outline-none border border-gray-300 focus:border-blue-500 bg-white"
                bind:value={newStudentGradYear}
                required
            >
                <option value="">Select graduation year...</option>
                {#each graduationYearOptions as year}
                    <option value={year}>{year}</option>
                {/each}
            </select>
        </div>

        <div class="flex gap-2 mt-2">
            <button
                type="submit"
                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                disabled={isCreatingStudent}
            >
                {isCreatingStudent ? 'Creating...' : 'Add Student'}
            </button>
            <button
                type="button"
                class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onclick={clearForm}
            >
                Clear
            </button>
        </div>
    </form>
</div>
