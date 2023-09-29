<!-- REFACTORED 9/29/2023 by Thomas -->

<script lang="ts">
    import { user } from "@/client/stores/user";
    import { AccessLevel, AccountType } from "@/lib/enums";

    import Icon from "@/client/components/Icon.svelte";
    import Gear from "@/client/icons/Gear";
</script>

{#if $user}
<div id="dropdown-container">
    <div id="dropdown-initiator">
        <img src={$user.picture} alt="User Profile" />
    </div>

    <div id="dropdown-content-container">
        <div id="dropdown-content">
            <div id="brief-profile">
                <img src={$user.picture} alt="User Profile" />
                <div style="line-height: 1; flex-direction: column; padding-left: 5px;">
                    <h1> {$user.name}</h1>
                    <p> {$user.email}</p>
                    <p> {AccountType[$user.accountType]} - {AccessLevel[$user.accessLevel]}</p>
                </div>
            </div>
            <hr />
            <a href="/">Home</a>
            <hr />
            <div class="icon-text-group">
                <Icon src={Gear}/>
                <a href="/account">Account</a>
            </div>
            <hr />
            <button class="logout-button" on:click={() => user.logout() }>Log Out</button>
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
            
            border-radius: 2px;
            padding: 1rem;
            right: 0;
            top: calc(100% - 1rem);

            #dropdown-content {
                display: flex;
                flex-direction: column;

                background-color: #fff;
                box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.4);

                z-index: 50;
                min-width: 150px;

                white-space: nowrap;

                #brief-profile {
                    
                }
            }
        }
    }

    .icon-text-group {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    a {
        text-align: center;
        text-decoration: none; 
     }
    .brief-profile {
        font-weight: 900;
        color: black;
        font-size: medium;
        align-items: center;
        padding: 5px;
        display: flex;
        padding-bottom: 1px;
    }

    
    hr {
        width:99%;
        margin-left:0
    }


    .brief-profile {
        p {
            margin: 0; 
            padding: 0px; 
            font-weight: 100;
            font-size: 12px;
        }
        h1 {
            font-size: 16px;
            margin: 0; 
            padding: 0px; 
        }
    }

    .logout-button {
        background-color: #ff6347;
        color: #fff;
        border: none;
        border-radius: 2px;
        padding: 5px 10px;
        cursor: pointer;
        width: 98%;
        margin: 1px;

        &:hover {
            background-color: #0056b3;
        }
    }

    .dropdown-content {
        
    }

</style>