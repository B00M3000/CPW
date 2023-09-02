<script lang="ts">
    import { user } from "@/client/stores/user";
</script>

<div class="dropdown-container">
    <div class="dropdown-initiator">
        <img src={$user.picture} alt="User Profile" />
    </div>

    <div class="dropdown-content">
        <div class="brief-profile">
            <img src={$user.picture} alt="User Profile" />
            <div style="line-height: 1; flex-direction: column;">
                <h1>{$user.name}</h1>
                <p>{$user.email}</p>
            </div>
        </div>
        <hr />
        <button class="logout-button" on:click={() => user.logout() }>Log Out</button
        >
    </div>
</div>

<style lang="scss">
    .dropdown-container {
        display: inline-flex;
        align-items: center;
        position: relative;

        padding: 3px;
        border-radius: 50%;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);

            .dropdown-container {
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
        // border: 2px solid var(--color-blue-500);
        border: 2px soild blue;
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

    .verticalLine {
        border-left: 2px solid #ffffff;
    }

    .dropdown-content {
        display: none;
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