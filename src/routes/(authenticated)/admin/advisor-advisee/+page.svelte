<script lang="ts">
    import { goto } from "$app/navigation";
    import UserSearcher from "@/client/components/UserSearcher.svelte";
    import { AccessLevel, AccountType } from "@/lib/enums";

    interface Action {
        email: string;
        adviseeEmails: string[]
    }

    export let data;
    $: ({ advisors } = data);

    async function upload() {
        const res = await fetch('/admin/advisor-advisee', {
            method: "POST",
            body: JSON.stringify(actions)
        });
        clearActions();
        location.reload();
    }
   
    function actionFormSubmit() {
        actions.push({
            email: actionFormEmail,
            adviseeEmails: actionFormAdviseeEmails
        })
        actions = actions
        actionFormEmail = ""
        actionFormAdviseeEmails = [];
    }
    
    function clearActions() {
        actions = []
    }

    let actions: Action[] = [];

    let actionFormEmail: string = "";
    let actionFormAdviseeEmails: string[] = [];

    function onSelect(e: Event) {
        const { email } = e.detail
        if(actionFormAdviseeEmails.find(e => e == email)) return
        actionFormAdviseeEmails.push(email);
        actionFormAdviseeEmails = actionFormAdviseeEmails;
    }   

    function edit(email: string) {
        actionFormEmail = email;
        actionFormAdviseeEmails = advisors.find(a => a.email == email)?.advisees?.map(a => a.email)
    }
</script>

<main>
    <h1>Admin - Advisor-Advisee Linker</h1>
    
    <div class="content">
        <div class="advisors-container">
            <h2>Advisors</h2>
            <div class="advisors">
                {#each advisors as advisor}
                <div class="advisor">
                    <div class="info">
                        <span>Email: {advisor.email}</span>
                        <span>Advisees: </span>
                        {#each advisor.advisees as advisee}
                        <span>{advisee.name}</span>
                        {:else}
                        <span>No Advisees.</span>
                        {/each}
                    </div>
                    <button on:click={() => edit(advisor.email)}>Edit</button>
                </div>
                {:else}
                <h3>No Advisors.</h3>
                {/each}
            </div>
        </div>

        <div class="actions-container">
            <h2>Queued Actions</h2>
            <div class="actions">
                {#each actions as action}
                <div class="action">
                    <span>Email: {action.email}</span>
                    <span>Advisees: </span>
                    {#each action.adviseeEmails as adviseeEmail}
                    <span>{adviseeEmail}</span>
                    {:else}
                    <span>No Advisees.</span>
                    {/each}
                </div>
                {:else}
                <h3>No actions queued.</h3>
                {/each}
            </div>
            <button on:click={clearActions}>Clear Queue</button>
            <button on:click={upload}>Upload Queue to Server</button>
        </div>

        <div class="action-form">
            <h2>Modify Advisor-Advisee Link</h2>
            <label for="email">Email: </label>
            <input id="email" bind:value={actionFormEmail} type="text" disabled/>

            <div class="duoed">
                {#each actionFormAdviseeEmails as email}
                <span>{email}</span>
                {:else}
                <span>No Advisees.</span>
                {/each}
            </div>
            <UserSearcher on:select={onSelect} disabled={!actionFormEmail}/>

            <button on:click={actionFormSubmit}>Add New User to Queue</button>
        </div>
    </div>
</main>

<style lang="scss">
    .action, .info {
        display: flex;
        flex-direction: column;
        color: grey;
        padding: 1rem;
    }
    .actions, .advisors {
        display: flex;
        flex-direction: column;
        background: #e0e0e0;
        max-height: 65vh;
        min-width: 20vw;
        overflow-y: auto;
    }
    .advisor {
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
    .actions-container, .advisors-container, .action-form {
        display: flex;
        flex-direction: column;
    }
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .duoed {
        display: flex;
        flex-direction: column;
        background: #e0e0e0;
        &>div:nth-of-type(even) {
            background: #bababa;
        }
    }
</style>