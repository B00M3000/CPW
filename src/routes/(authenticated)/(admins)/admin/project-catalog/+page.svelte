<script lang=ts>
    import { goto } from "$app/navigation";
    import ProjectCard from "@/client/components/ProjectCard.svelte";
    import StudentCard from "@/client/components/StudentCard.svelte";

    export let data;

    $: ({inflatedProjects} = data)

    $: completedProjects = inflatedProjects.filter((p) => p.underReview == false);
    $: uncompletedProjects = inflatedProjects.filter((p) => p.underReview == true);
</script>



<main>
    <table>
        <h1> Incomplete Projects</h1>
        <tr>
            <th>
                <span>Title</span>   
            </th>
            <th>
                <span>Student </span>
            </th>
            <th>
                <span>Status</span>
            </th>
        </tr>
    
        {#each uncompletedProjects as project}
        <tr on:click ={()  => goto(`project-catalog/${project._id}`)}>
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
                <span>Title</span>   
            </th>
            <th>
                <span>Student </span>
            </th>
            <th>
                <span>Status</span>
            </th>
        </tr>
    
        {#each completedProjects as project}
        <tr on:click={()  => goto(`project-catalog/${project._id}`)}>
            <td>
                <span>{project.title}</span>
            </td>
            <td>
                <span> <StudentCard student={project.student} /> </span>
            </td>
            <td>
                <span>Completed </span>
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
            gap: 2rem;

            tr {
                td {
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
            tr:hover {
                    background-color: rgb(163, 230, 185);
                    cursor: pointer;
            }

            th{
                text-align: left;
                padding: 0.5rem 1rem;
                background-color: rgb(163, 162, 162);
            }
        }  

        h1 {
            background-color: white;
            margin: 0;
        } 
    } 
</style>