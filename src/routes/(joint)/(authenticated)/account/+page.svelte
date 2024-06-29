<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { AccessLevel, AccountType } from "@/lib/enums";
    export let data;

    import { user } from "@/client/stores/user";
</script>

<main class="flex flex-col justify-center items-center mt-20">
    <div class="flex items-center gap-10 m-5">
        <img class="w-32 h-32 rounded-full" src={$user.picture} alt="profile">

        <div class="flex flex-col">
            <span class="text-xl font-bold">{$user.name}</span>
            <span class="text-xl font-bold">{$user.email}</span>
            <span class="text-xl font-bold"> {AccountType[$user.accountType]} - {AccessLevel[$user.accessLevel]}</span>
        </div>
    </div>

    <h1 class="text-3xl my-5">Welcome back {$user.firstName}!</h1>

    <div class="w-[36rem] text-center">
        <h2 class="text-2xl my-5">Reminder! PLEASE READ!!!</h2> 

        <p>Navigate to public pages using the navigation bar. To manage your own projects and images, utilize the hover menu on your google icon in the top right. For Advisors, the same menu contains the button to view your advisees.</p>
    </div>

    <br>

    <h2 class="text-2xl">Important Announcements: </h2>
    <h2 class="text-xl text-gray-800">[none]</h2>
</main>

