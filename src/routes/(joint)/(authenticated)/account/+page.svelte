<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { AccessLevel, AccountType } from "@/lib/enums";
    export let data;

    import { user } from "@/client/stores/user";
    import Icon from "@/client/components/Icon.svelte";
    import { goto } from "$app/navigation";
    import FileText from "@/client/icons/FileText.js";
    import Images from "@/client/icons/Images.js";
    import People from "@/client/icons/People.js";

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

<main class="flex flex-col justify-center items-center my-6 sm:my-12 mx-4 sm:mx-8 bg-gray-300 p-4 rounded-xl">
    <div class="flex items-center gap-5 sm:gap-10 sm:m-5">
        <img class="w-16 h-16 sm:w-32 sm:h-32 rounded-full" src={$user.picture} alt="profile">

        <div class="flex flex-col text-md sm:text-xl ">
            <span class="font-bold">{$user.name}</span>
            <span class="font-bold">{$user.email}</span>
            <span class="font-bold"> {AccountType[$user.accountType]} - {AccessLevel[$user.accessLevel]}</span>
        </div>
    </div>

    <h1 class="text-3xl my-5">Welcome back {$user.firstName}!</h1>

    <div class="text-center max-w-[36rem]">
        <h2 class="text-2xl my-5">Reminder! PLEASE READ!!!</h2> 
        <p class="text-wrap mb-5">Navigate to public pages using the navigation bar. To manage your own projects and images, utilize the hover menu on your google icon in the top right. For Advisors, the same menu contains the button to view your advisees.</p>
        <p class="text-wrap">Additionally, if any pages or things look broken or wonky (or too small), feel free to zoom in and out with Ctrl + and -.</p>
    </div>

    <div class="flex gap-4 items-center m-8 mx-4">
        {#if $user.accountType == AccountType.Student}
        <button class="flex items-center gap-3 p-3 bg-blue-400 hover:bg-blue-500 rounded-lg" on:click={gotoManageProjects}>
            <Icon src={FileText} size="1.25rem"/>
            <div class="dropdown-menu-option-link-container">
                <a href="/manage-projects">My Projects</a>
            </div>
        </button>
        <button class="flex items-center gap-3 p-3 bg-blue-400 hover:bg-blue-500 rounded-lg" on:click={gotoManageImages}>
            <Icon src={Images} size="1.25rem"/>
            <div class="dropdown-menu-option-link-container">
                <a href="/manage-images">My Images</a>
            </div>
        </button>
        {/if}
        {#if $user.accountType == AccountType.Advisor}
        <button class="flex items-center gap-3 p-3 bg-blue-400 hover:bg-blue-500 rounded-lg" on:click={gotoManageAdvisees}>
            <Icon src={People} size="1.25rem"/>
            <div class="dropdown-menu-option-link-container">
                <a href="/manage-advisees">My Advisees</a>
            </div>
        </button>
        {/if}
    </div>

    <br>

    <h2 class="text-2xl">Important Announcements: </h2>
    <h2 class="text-xl text-gray-800">[none]</h2>

    <div class="mb-24"></div>
</main>

