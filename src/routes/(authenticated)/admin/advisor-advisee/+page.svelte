<script lang="ts">
    import { goto } from "$app/navigation";
    import UserSearcher from "@/client/components/UserSearcher.svelte";
    import { AccessLevel, AccountType } from "@/lib/enums";

    // interface Action {
    //     email: string;
    //     adviseeIds: [string]
    // }

    // export let data;
    // $: ({ ghosts } = data);

    // async function upload() {
    //     const res = await fetch('/admin/ghosts', {
    //         method: "POST",
    //         body: JSON.stringify(actions)
    //     });
    //     clearActions();
    //     location.reload();
    // }
   
    // function actionFormSubmit() {
    //     actions.push({
    //         email: actionFormEmail,

    //     })
    //     actions = actions
    //     actionFormAL = 0;
    //     actionFormAT = 0;
    //     actionFormEmail = "";
    // }
    
    // function clearActions() {
    //     actions = []
    // }

    // let actions: Action[] = [];

    // let actionFormEmail: string;
    // let actionFormAL: number = 0;
    // let actionFormAT: number = 0;
    // let actionFormClear: boolean = false;
</script>

<main>
    <h1>Admin - Advisor-Advisee Linker</h1>

    <UserSearcher />
    <!-- <div class="content">
        <div class="ghosts-container">
            <h2>Active Ghosts</h2>
            <div class="ghosts">
                {#each ghosts as ghost}
                <div class="ghost">
                    <div class="info">
                        <span>Email: {ghost.email}</span>
                        <span>Account Type: {AccountType[ghost.accountType]}</span>
                        <span>Access Level: {AccessLevel[ghost.accessLevel]}</span>
                    </div>
                    <button on:click={() => deleteAction(ghost.email)}>Delete</button>
                </div>
                {:else}
                <h3>No ghosts.</h3>
                {/each}
            </div>
        </div>

        <div class="actions-container">
            <h2>Queued Actions</h2>
            <div class="actions">
                {#each actions as action}
                <div class="action">
                    <span>Action: {action.action}</span>
                    <span>Email: {action.email}</span>
                    {#if action.accountType !== undefined}<span>Account Type: {AccountType[action.accountType]}</span>{/if}
                    {#if action.accessLevel !== undefined}<span>Access Level: {AccessLevel[action.accessLevel]}</span>{/if}
                </div>
                {:else}
                <h3>No actions queued.</h3>
                {/each}
            </div>
            <button on:click={clearActions}>Clear Queue</button>
            <button on:click={upload}>Upload Queue to Server</button>
        </div>

        <div class="action-form">
            <h2>Add a New Ghost</h2>
            <label for="email">Email: </label>
            <input id="email" bind:value={actionFormEmail} type="text" disabled/>
            <label for="at">Account Type: </label>
            <select id="at"bind:value={actionFormAT}>
                <option value={AccountType.Unknown}>Unknown</option>
                <option value={AccountType.Student}>Student</option>
                <option value={AccountType.Advisor}>Advisor</option>
            </select>
            <label for="al">Access Level: </label>
            <select id="al" bind:value={actionFormAL}>
                <option value={AccessLevel.Normal}>Normal</option>
                <option value={AccessLevel.Admin}>Admin</option>
            </select>
            <input type="checkbox" bind:checked={actionFormClear}/>
            <button on:click={actionFormSubmit}>Add New User to Queue</button>
        </div>
    </div> -->
</main>

<style>
    .action, .info {
        display: flex;
        flex-direction: column;
        color: grey;
        padding: 1rem;
    }
    .actions, .ghosts {
        display: flex;
        flex-direction: column;
        background: #e0e0e0;
        max-height: 55vh;
        min-width: 20vw;
        overflow-y: auto;
    }
    .ghost {
        display: flex;
        justify-content: space-between;
    }
    .actions>div:nth-of-type(even) {
        background: #bababa;
    }
    .content {
        display: flex;
        gap: 5rem;
    }
    .actions-container, .ghosts-container, .action-form {
        display: flex;
        flex-direction: column;
    }
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>