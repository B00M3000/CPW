<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

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

<main>
    <h1 class="main-title">Admin - Ghost Manager</h1>

    <p class="note">Note that only one ghost can exist per email address!</p>
    <p class="note">If modifications to an existing ghost are needed, please delete the existing one first before attempting to create a new updated one.</p>

    <div class="content">
        <div class="ghosts-container">
            <h2>Active Ghosts</h2>
            <div class="ghosts">
                {#each ghosts as ghost}
                <div class="ghost">
                    <div class="info">
                        <span>Email: {ghost?.email}</span>
                        <span>Account Type: {AccountType[ghost?.accountType]}</span>
                        <span>Access Level: {AccessLevel[ghost?.accessLevel]}</span>
                    </div>
                    <button class="delete-button" on:click={() => deleteAction(ghost?.email)}>Delete</button>
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
            <hr>
            <button class="clear-button" on:click={clearActions}>Clear Queue</button>
            <button class="upload-button" on:click={upload}>Upload Queue to Server</button>
        </div>

        <div class="action-form">
            <h2>Add a New Ghost</h2>
            <label for="email">Email: </label>
            <input id="email" bind:value={actionFormEmail} type="email" placeholder="Enter Email to Match..."/>
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
            <hr>
            <button class="add-button" on:click={actionFormSubmit}>Add New User to Queue</button>
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    }

    .main-title {
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .note {
        font-size: 1rem;
        color: #888;
        margin-bottom: 20px;
        text-align: center;
    }

    .content {
        display: flex;
        gap: 2rem;
    }

    .ghosts-container, .actions-container, .action-form {
        flex: 1;
        padding: 1rem;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .ghosts, .actions {
        max-height: 55vh;
        overflow-y: auto;
    }

    .ghost {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .info {
        display: flex;
        flex-direction: column;
        color: grey;
    }

    .action {
        display: flex;
        flex-direction: column;
        color: grey;
    }

    .delete-button, .clear-button, .upload-button, .add-button {
        background-color: #ff6347;
        color: #fff;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 1rem;
        transition: background-color 0.3s;
    }

    .delete-button:hover, .clear-button:hover, .upload-button:hover, .add-button:hover {
        background-color: #ff4500;
    }

    label {
        font-size: 1rem;
        margin-top: 0.5rem;
    }

    select {
        width: 100%;
        margin-bottom: 20px;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-top: 0.5rem;
    }
    input[type="email"] {
        width: calc(100% - 1.05rem); 
        margin-bottom: 20px;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-top: 0.5rem;
    }

    input[type="checkbox"] {
        margin-top: 0.5rem;
    }
</style>