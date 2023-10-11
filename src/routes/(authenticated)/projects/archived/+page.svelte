<script lang=ts>
    import projects20 from "@client/data/projects20.json";
    import projects22 from "@client/data/projects22.json";
    import projects23 from "@client/data/projects23.json";
    const allProjects = [...projects20, ...projects22, ...projects23];
    import Fuse from 'fuse.js';
    const fuseOptions = {
        keys: [
            'Name First',          
            'Name Last',           
            'Mentor First Name',   
            'Mentor Last Name',    
            'Mentor Organization', 
            'Project Subject',     
            'Category 1',          
            'Category 2',          
            'Category 3'           
        ],
        includeScore: true, 
        threshold: 0.35, 
    };

    let searchResults = allProjects;
    let searchQuery: string = '';
    const fuse = new Fuse(allProjects, fuseOptions);


    function performSearch() {
        const results = fuse.search(searchQuery);
        searchResults = [];
        results.forEach((result) => {
            searchResults.push(result.item)
        });
    }

    function clear() {
        searchResults = allProjects;
        searchQuery = "";
    }
</script>


<main>
    <div class="searching">
        <input
            placeholder="Search ..."
            size="120"
            id="search-box"
            class="search-box"
            bind:value={searchQuery}
            type="text"
        />
        <button class="button" on:click={performSearch}>Search</button>
        <button class="button" on:click={clear}>Clear</button>
    </div>
    <div class="mentor-container">
        <table>
                <th>
                    <span>Project Subject</span>   
                </th>
                <th>
                    <span>Name</span>   
                </th>
                <th>
                    <span>Mentor </span>
                </th>
                <th>
                    <span>Mentor Organization</span>
                </th>

        
            {#each searchResults as result}
            <tr>
                <td>
                    <span> {result["Project Subject"]} </span>
                </td>
                <td>
                    <span> {result["Name First"]} {result["Name Last"]} </span>
                </td>
                <td>
                    <span> {result["Mentor First Name"]} {result["Mentor Last Name"]} </span>
                </td>
                <td>
                    <span> {result["Mentor Organization"]} </span>
                </td>

            </tr>
            {/each}
        </table>
    </div>
</main>

<style lang=scss>
    .searching{
        display: flex;
        justify-content: center;
        padding: 1.5rem 0rem;
        width: calc(100vw - (100vw - 100%));
        background-color: rgb(196, 186, 186);
        
        .search-box {
            padding: 12px 20px;
            margin: 8px 0.2rem;
            box-sizing: border-box;
            border: 2px solid rgb(0, 0, 0);
            border-radius: 0px;
        }
        
        button {
            padding: 10px 20px;
            margin: 8px;
            box-sizing: border-box;
            border: transparent;
            font-weight: bold;
            color: white;
            background-color: var(--color-blue-grey-400);
            border-radius: 2px;
        }
        button:hover {
            background-color: var(--color-blue-grey-300);
        }

 
    }

    .mentor-container {
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
            padding-left: 2rem;
            background-color: white;
            margin: 0;
        }

    }

</style>