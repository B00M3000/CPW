<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Student } from '@/interfaces/project';
    import LazyImage2 from '@/client/components/LazyImage2.svelte';

    let { student }: { student: Student } = $props();
</script>

<a href="/students/{student._id}" class="grid grid-cols-[auto_1fr] gap-2 p-2 px-3 bg-gray-300 border border-solid border-gray-400 rounded-l-full rounded-r-full items-center justify-center">
    <LazyImage2 src={student.picture} alt="image of {student.name}" class="w-5 h-5 rounded-full" />
    <span class="text-sm text-center">{student.name || "Student Not Found!"}</span>
</a>
