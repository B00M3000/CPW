<script lang="ts">
    import { user } from "@/client/stores/user";
    import { AccessLevel, AccountType } from "@/lib/enums";
</script>

{#if $user}
<div class="dropdown-container">
    <div class="dropdown-initiator">
        <img src={$user.picture} alt="User Profile" />
    </div>

    <div class="dropdown-content">
        <div class="brief-profile">
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
        <a href="/account">Account</a>
        <hr />
        <button class="logout-button" on:click={() => user.logout() }>Log Out</button>
    </div>
</div>
{:else}
    <span>ERROR: NO USER LOGGED IN</span>
{/if}

<style lang="scss">
    .dropdown-container {
        display: inline-flex;
        align-items: center;
        position: relative;

        padding: 3px;
        border-radius: 50%;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);

            .dropdown-content {
                display: flex;
            }
        }
    }

    img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .dropdown-initiator {
        display: inline-flex;
        border: 2px soild blue;
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
        display:none;
        flex-direction: column;
        position: absolute;
        overflow: auto;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.4);
        z-index: 50;
        min-width: 150px;
        right: 0;
        top: 100%;
        white-space: nowrap;
    }

</style>