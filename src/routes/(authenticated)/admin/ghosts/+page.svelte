<script lang="ts">
    import { goto } from "$app/navigation";
    import { AccessLevel, AccountType } from "@/lib/enums";

    interface Action {
        action: string;
        email: string;
        accessLevel?: number;
        accountType?: number;
    }

    export let data;
    $: ({ ghosts } = data);

    async function upload() {
        const res = await fetch('/admin/ghosts', {
            method: "POST",
            body: JSON.stringify(actions)
        });
        clearActions();
        location.reload();
    }
   
    function actionFormSubmit() {
        actions.push({
            action: "CREATE",
            email: actionFormEmail,
            accessLevel: actionFormAL,
            accountType: actionFormAT
        })
        actions = actions
        if(actionFormClear) {
            actionFormAL = 0;
            actionFormAT = 0;
            actionFormEmail = "";
        }
    }

    function deleteAction(email: string){
        actions.push({
            action: "DELETE",
            email
        })
        actions = actions
    }
    
    function clearActions() {
        actions = []
    }

    let actions: Action[] = [];

    let actionFormEmail: string;
    let actionFormAL: number = 0;
    let actionFormAT: number = 0;
    let actionFormClear: boolean = false;
</script>

<h1>Admin - Ghost Manager</h1>

<h2>Active Ghosts</h2>
<div class="ghosts">
    {#each ghosts as ghost}
        <p>Email: {ghost.email}</p>
        <p>Account Type: {AccountType[ghost.accountType]}</p>
        <p>Access Level: {AccessLevel[ghost.accessLevel]}</p>
        <button on:click={() => deleteAction(ghost.email)}>Delete</button>
    {:else}
        <h3>No ghosts.</h3>
    {/each}
</div>

<h2>Queued Actions</h2>
<div class="actions">
    {#each actions as action}
        <div class="action">
            <p>Action: {action.action}</p>
            <p>Email: {action.email}</p>
            {#if action.accountType !== undefined}<p>Account Type: {AccountType[action.accountType]}</p>{/if}
            {#if action.accessLevel !== undefined}<p>Access Level: {AccessLevel[action.accessLevel]}</p>{/if}
        </div>
    {:else}
        <h3>No actions queued.</h3>
    {/each}
</div>

<div class="action-form">
    <label for="email">Email: </label>
    <input id="email" bind:value={actionFormEmail} type="text" placeholder="Enter Email to Match..."/>
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
    <label for="al">Clear after each add: </label>
    <input type="checkbox" bind:checked={actionFormClear}/>
</div>

<button on:click={actionFormSubmit}>Add New User to Queue</button>
<button on:click={clearActions}>Clear Queue</button>
<button on:click={upload}>Upload Queue to Server</button>

<style>
    .action {
        color: grey;
    }
    .actions {
        background: #bababa;
    }
    .actions>div:nth-of-type(odd) {
        background: #e0e0e0;
    }
</style>