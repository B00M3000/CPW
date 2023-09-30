<!-- REFACTORED 9/29/2023 by Thomas -->

<script lang="ts">
    import { user } from "@/client/stores/user";
    import { AccessLevel, AccountType } from "@/lib/enums";

    import Icon from "@/client/components/Icon.svelte";
    import Gear from "@/client/icons/Gear";
    import { goto } from "$app/navigation";

    async function gotoAccount() {
        await goto('/account');
    }
</script>

{#if $user}
<div id="dropdown-container">
    <div id="dropdown-initiator">
        <img src={$user.picture} alt="" />
    </div>

    <div id="dropdown-content-container">
        <div id="dropdown-content">
            <div id="brief-profile">
                <img src={$user.picture} alt="" />
                <div id="brief-account-details">
                    <span class="name"> {$user.name}</span>
                    <span class="email"> {$user.email}</span>
                    <span class="account-information"> {AccountType[$user.accountType]} - {AccessLevel[$user.accessLevel]}</span>
                </div>
            </div>
            <div id="dropdown-menu-options">
                <button class="dropdown-menu-option" on:click={gotoAccount}>
                    <Icon src={Gear}/>
                    <a href="/account">Account</a>
                </button>
            </div>
            <button id="logout-button" on:click={() => user.logout() }>Log Out</button>
        </div>
    </div>
</div>
{:else}
    <span>ERROR: NO USER LOGGED IN</span>
{/if}

<style lang="scss">
    #dropdown-container {
        display: inline-flex;
        align-items: center;
        position: relative;

        padding: 3px;
        border-radius: 50%;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);

            #dropdown-content-container {
                display: flex;
            }
        }
    }

    #dropdown-initiator {
        display: inline-flex;
        border: 2px soild blue;

        img {
            width: 40px;
            height: 40px;

            border-radius: 50%;
        }
    }

    #dropdown-content-container {
        display: none;
        position: absolute;

        right: 0;
        top: calc(100% - 1rem);
        
        border-radius: 2px;
        padding: 1rem;
    }

    #dropdown-content {
        display: flex;
        flex-direction: column;

        z-index: 50;
        min-width: 150px;
        gap: 0.5rem;
        padding: 1rem;

        background-color: #fff;
        box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.4);

        white-space: nowrap;
    }

    #brief-profile {
        display: flex;
        justify-content: space-between;
        
        align-items: center;
        padding: 0.25rem;
        
        padding-bottom: 1px;

        img {
            width: 40px;
            height: 40px;

            border-radius: 50%;
        }
    }

    #brief-account-details {
        display: flex;
        flex-direction: column;

        padding-left: 5px;

        color: black;

        .name {
            font-size: 16px;
        }

        .email, .account-information {
            font-size: 12px;
        }
    }

    #dropdown-menu-options {
        display: inline-flex;
        justify-content: center;
    }

    .dropdown-menu-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;

        &:hover {
            background-color: aliceblue;
        }
    }

    button {
        border: none;
        background: inherit;

        cursor: pointer;
    }

    #logout-button {
        display: inline-flex;
        justify-content: center;
        background-color: #ff6347;
        color: #fff;
        border: none;
        border-radius: 2px;
        padding: 0.25rem;
        width: 98%;
        margin: 1px;

        &:hover {
            background-color: #0056b3;
        }
    }
</style>