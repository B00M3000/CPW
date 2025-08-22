<script lang=ts>
    import People from "@/client/icons/People";
    import { ArrowLeft, Plus, Info, Users, GraduationCap } from "lucide-svelte";
</script>

<main class="w-full h-full p-4">
    <div class="relative w-full h-full rounded-xl p-8 grid grid-rows-[auto_minmax(0,_1fr)]">
        <h1 class="text-4xl mb-8 flex items-center justify-center gap-4"><Users size={48} /> Identity Center</h1>

        <div class="identity-center-content-grid h-full">
            <div class="grid-main h-full w-full rounded-lg bg-gray-200 border border-solid border-gray-400 ">
                <slot />
            </div>
            <div class="grid-sidebar h-full w-full p-8 rounded-lg bg-gray-200 border border-solid border-gray-400 flex flex-col gap-4 items-start">
                <h2 class="text-xl">Tabs:</h2>
                <div class="flex flex-col gap-2 w-full">
                    <a href=/admin/identity-center/manage-students class="flex gap-2 items-center bg-gray-500 hover:bg-gray-600 text-white p-2 px-3 rounded-md">
                        <Users />
                        <span>Manage Students</span>
                    </a>
                </div>
                <div class="flex flex-col gap-2 w-full">
                    <a href=/admin/identity-center/manage-advisors class="flex gap-2 items-center bg-gray-500 hover:bg-gray-600 text-white p-2 px-3 rounded-md">
                        <GraduationCap />
                        <span>Manage Advisors</span>
                    </a>
                </div>
            </div>
        </div>
        <a class="absolute top-0 left-0 bg-blue-500 hover:bg-blue-600 p-2 px-3 m-8 rounded-lg flex gap-2 items-center text-white" href=/admin>
            <ArrowLeft />
            <span>Back to Admin Dashboard</span>
        </a>
    </div>
</main>

<style>
    .identity-center-content-grid {
        display: grid;
        grid-template-columns: 1fr 4fr;
        grid-template-areas: "sidebar main";
        gap: 1.5rem;
    }

    .grid-main { grid-area: main; }
    .grid-sidebar { grid-area: sidebar; }   
</style>
