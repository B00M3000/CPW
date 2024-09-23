<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { BookUser, FolderOpen, Info, Users } from 'lucide-svelte';

    export let data;
</script>

<main class="w-full h-full flex items-center justify-center">
    <div class="flex flex-col items-center">
        <h1 class="font-bold text-6xl mb-16">Administrator Dashboard</h1>

        <div class="grid grid-rows-2 grid-cols-2 items-center gap-4 m-2 text-4xl text-blue-50">
          <a href=/admin/identity-center class="p-4 px-6 bg-blue-500 rounded-lg hover:bg-blue-600 flex flex-col items-center gap-4">
            <Users size={96} />
            <span>Identity Center</span>
          </a>
          <a href=/admin/mentor-center class="p-4 px-6 bg-blue-500 rounded-lg hover:bg-blue-600 flex flex-col items-center gap-4">
            <BookUser size={96} />
            <span>Mentor Center</span>
          </a>
          <a href=/admin/project-center class="p-4 px-6 bg-blue-500 rounded-lg hover:bg-blue-600 flex-col flex items-center gap-4">
            <FolderOpen size={96} />
            <span>Project Center</span>
          </a>
          <a href=/admin/year-status class="p-4 px-6 bg-blue-500 rounded-lg hover:bg-blue-600 flex-col flex items-center gap-4">
            <Info size={96} />
            <span>Year Status</span>
          </a>
        </div>
    </div>
</main>
