<script lang="ts">
    import students from '@client/data/generated/students.json';

    export let studentId: string;

    let student = students.find((s:any) => s.studentId == studentId)
</script>

<div class="student-card">
    {#if student}
        <a href="student/{student.studentId}" class="text">{student.firstName} {student.lastName}</a> 
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

        background-color: lightgoldenrodyellow;

        border-radius: 0.2em;
    }

    .text {
        font-size: 12px;
    }
</style>