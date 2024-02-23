<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Student } from '@/interfaces/project';

    export let student: Student;

    async function gotoStudent() {
        await goto(`/students/${student._id}`)
    }
</script>

<button class="student-card" on:click={gotoStudent}>
    {#if student}
        <img src={student.picture} alt={`image of ${student.firstName} ${student.lastName}`} class="w-4 h-4 rounded-full">
        <span class="text">{student.firstName} {student.lastName}</span> 
    {:else}
        <span class="text">Student Not Found!</span>
    {/if}
</button>

<style lang="scss">
    .student-card {
        cursor: pointer;

        display: inline-flex;

        align-items: center;
        
        padding: 0.3em;

        font-size: large;

        background-color: var(--color-blue-grey-200);

        border-radius: 2rem;

        gap: 0.2rem;

        border: none;
    }

    .text {
        font-size: 12px;
    }
</style>