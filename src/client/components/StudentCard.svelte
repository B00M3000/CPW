<script lang="ts">
    import type { Student } from '@/interfaces/project';

    export let student: Student;
</script>

<div class="student-card">
    {#if student}
        <a href={`/students/${student._id}`} class="text">{student.firstName} {student.lastName}</a> 
    {:else}
        <span class="text">Student Not Found!</span>
    {/if}
</div>

<style>
    .student-card {
        display: inline-flex;
        
        padding: 0.3em;

        font-size: large;

        margin: -0.1em;

        background-color: rgb(113, 151, 201);

        border-radius: 0.2em;
    }

    .text {
        font-size: 12px;
    }
</style>