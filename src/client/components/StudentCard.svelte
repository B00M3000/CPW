<script lang="ts">
    import students from '@client/data/generated/students.json';

    export let studentId: string;

    let student = students.find(s => s.studentId == studentId)
</script>

<div class="student-card">
    {#if student}
        <span class="text">{student.firstName} {student.lastName}</span> 
    {:else}
        <span class="text">Student Not Found!</span>
    {/if}
</div>

<style>
    .student-card {
        display: inline-flex;
        
        padding: 0.5em;

        margin: 0.25em;

        background-color: lightgoldenrodyellow;

        border-radius: 0.5em;
    }

    .text {
        font-size: 12px;
    }
</style>