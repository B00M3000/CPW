<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<!-- REFACTORED 9/29/2023 by Thomas -->

<script lang="ts">
    import { user } from "@/client/stores/user";
    import { AccessLevel, AccountType } from "@/lib/enums";
    import { goto } from "$app/navigation";

    import Icon from "@/client/components/Icon.svelte";
    import Gear from "@/client/icons/Gear";
    import Images from "@/client/icons/Images";
    import FileText from "@/client/icons/FileText";
    import People from "@/client/icons/People";

    function gotoAccount() {
        goto('/account');
    }

    function gotoManageImages() {
        goto('/manage-images')
    }

    function gotoManageProjects() {
        goto('/manage-projects')
    }

    function gotoManageAdvisees() {
        goto('/manage-advisees')
    }
</script>

{#if $user}
<div id="dropdown-container">
    <div class="inline-flex">
        <img class="w-10 h-10 rounded-full" src={$user.picture} alt="" />
    </div>

    <div id="dropdown-content-container" class="text-black">
        <div id="dropdown-content">
            <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
                <img class="w-10 h-10 rounded-full" src={$user.picture} alt="" />
                <div class="flex flex-col">
                    <span class="text-sm font-bold -mb-1">{$user.name}</span>
                    <span class="text-xs font-bold text-gray-700">{$user.email}</span>
                    <span class="text-xs font-bold">{AccountType[$user.accountType]} - {AccessLevel[$user.accessLevel]}</span>
                </div>
            </div>
            <div id="dropdown-menu-options-container">
                <div id="dropdown-menu-options">
                    <button class="dropdown-menu-option" on:click={gotoAccount}>
                        <Icon src={Gear} size="1.25rem"/>
                        <div class="dropdown-menu-option-link-container">
                            <a href="/account">Account</a>
                        </div>
                    </button>
                    {#if $user.accountType == AccountType.Student}
                    <button class="dropdown-menu-option" on:click={gotoManageProjects}>
                        <Icon src={FileText} size="1.25rem"/>
                        <div class="dropdown-menu-option-link-container">
                            <a href="/manage-projects">My Projects</a>
                        </div>
                    </button>
                    <button class="dropdown-menu-option" on:click={gotoManageImages}>
                        <Icon src={Images} size="1.25rem"/>
                        <div class="dropdown-menu-option-link-container">
                            <a href="/manage-images">My Images</a>
                        </div>
                    </button>
                    {/if}
                    {#if $user.accountType == AccountType.Advisor}
                    <button class="dropdown-menu-option" on:click={gotoManageAdvisees}>
                        <Icon src={People} size="1.25rem"/>
                        <div class="dropdown-menu-option-link-container">
                            <a href="/manage-advisees">My Advisees</a>
                        </div>
                    </button>
                    {/if}
                </div>
            </div>
            <button class="inline-flex justify-center items-center bg-[#ff6347] text-white rounded-sm p-1 hover:bg-[#0056b3]" on:click={() => user.logout()}>Log Out</button>
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
                display: inline-flex;
            }
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
        justify-content: center;

        z-index: 999;
        min-width: 205px;
        gap: 0.5rem;
        padding: 1rem;

        background-color: #fff;
        box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.4);
    }

    #dropdown-menu-options-container {
        display: flex;
        justify-content: center;
    }

    #dropdown-menu-options {
        display: inline-flex;
        flex-direction: column;
        align-items: center;

        .dropdown-menu-option {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            border-radius: 0.5rem;

            width: 100%;

            &:hover {
                background-color: aliceblue;
            }

            .dropdown-menu-option-link-container {
                display: flex;
                justify-content: center;
                align-items: center;

                width: 100%;

                a {
                    margin-left: 1rem;
                }
            }
        }
    }
</style>
