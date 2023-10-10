<script lang=ts>
    import ProjectCard from "@/client/components/ProjectCard.svelte";
    import StudentCard from "@/client/components/StudentCard.svelte";

    export let data;

    $: ({projects} = data)

    $: completedProjects = projects.filter((p) => p.underReview == false);
    $: uncompletedProjects = projects.filter((p) => p.underReview == true);
</script>



<main>
    <table>
        <h1> Incomplete Projects</h1>
        <tr>
            <th>
                <span>Project Title</span>   
            </th>
            <th>
                <span>Student Name </span>
            </th>
            <th>
                <span>Status</span>
            </th>
        </tr>
    
        {#each uncompletedProjects as project}
        <tr>
            <td>
                <span>{project.title}</span>
            </td>
            <td>
                <span> <StudentCard student={project.student} /> </span>
            </td>
            <td>
                <span>Incomplete</span>
            </td>
        </tr>
        {/each}
    </table>


    <table>
        <h1> Completed Projects</h1>
        <tr>
            <th>
                <span>Project Title</span>   
            </th>
            <th>
                <span>Student Name </span>
            </th>
            <th>
                <span>Status</span>
            </th>
        </tr>
    
        {#each completedProjects as project}
        <tr>
            <td>
                <span>{project.title}</span>
            </td>
            <td>
                <span> <StudentCard student={project.student} /> </span>
            </td>
            <td>
                <span>Complete</span>
            </td>
        </tr>
        {/each}
    </table>
</main>

<style lang=scss>
    main{
        display: flex;
        flex-direction: column;
        table {
            padding: 2rem;
            background-color: #fff;
            outline: 1px black solid;
            gap: 2rem;

            tr {
                th, td {
                    text-align: left;
                    padding: 0.5rem 1rem;
                }
                &:nth-child(even) {
                    background-color: #ddd;
                }
                
                &:nth-child(odd) {
                    background-color: #e9e9e9;
                }
            }
        }  
    } 
</style>