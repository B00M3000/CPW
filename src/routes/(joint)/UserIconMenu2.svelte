<script lang=ts>
    import { user } from "@/client/stores/user";
    import { AccessLevel, AccountType } from "@/lib/enums";
    import Icon from "../../client/components/Icon.svelte";
    import Gear from "../../client/icons/Gear";
    import FileText from "../../client/icons/FileText";
    import Images from "../../client/icons/Images";
    import People from "../../client/icons/People";
</script>

{#if $user}
<div class="trigger text-black">
    <div class="hover:bg-[#AAAAAA44] rounded-full p-1">
        <!-- svelte-ignore a11y_missing_attribute -->
        <img class="w-10 h-10 rounded-full" src={$user.picture} />
    </div>

    <div class="relative">
        <div class="reveal-on-trigger hidden h-2 bg-white w-full"></div>
        <div class="reveal-on-trigger hidden flex-col items-center absolute top-2 left-6 -translate-x-3/4 bg-white p-4 gap-3 shadow-lg">
            <div class="grid grid-cols-[3.5rem_1fr] grid-rows-1 items-center justify-center">
                <div class="p-2">
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <img class="w-10 h-10 rounded-full" src={$user.picture} />
                </div>
                <div class="flex flex-col">
                    <span class="text-sm font-bold -mb-1">{$user.name}</span>
                    <span class="text-xs text-gray-600">{$user.email}</span>
                    <span class="text-xs ">{AccountType[$user.accountType]} - {AccessLevel[$user.accessLevel]}</span>
                </div>
            </div>
            <div class="grid gap-2">
                <a class="flex items-center justify-between gap-4 p-2 px-6 hover:bg-[#44444444] bg-[#4444441a] border rounded-lg" href="/account">
                    <Icon src={Gear} size="1.25rem"/>
                    <span class="w-full text-center">Account</span>
                </a>
                {#if $user.accountType == AccountType.Student}
                <a class="flex items-center justify-between gap-4 p-2 px-6 hover:bg-[#44444444] bg-[#4444441a] border rounded-lg" href="/manage-projects">
                    <Icon src={FileText} size="1.25rem"/>
                    <span class="w-full text-center">My Projects</span>
                </a>
                <a class="flex items-center justify-between gap-4 p-2 px-6 hover:bg-[#44444444] bg-[#4444441a] border rounded-lg" href="/manage-images">
                    <Icon src={Images} size="1.25rem"/>
                    <span class="w-full text-center">My Images</span>
                </a>
                {/if}
                {#if $user.accountType == AccountType.Advisor}
                <a class="flex items-center justify-between gap-4 p-2 px-6 hover:bg-[#44444444] bg-[#4444441a] border rounded-lg" href="/manage-advisees">
                    <Icon src={People} size="1.25rem"/>
                    <span class="w-full text-center">My Advisees</span>
                </a>
                {/if}
            </div>
            <button class="inline-flex justify-center items-center bg-red-500 text-white rounded-sm p-1 px-4 hover:bg-red-600" on:click={() => user.logout()}>Log Out</button>
        </div>
    </div>
</div>
{:else}
<a class="p-2 bg-rose-600 shadow-xl hover:shadow-sm hover:bg-rose-700 rounded-xl text-xl animate-red-glowing" href="/login">Login</a>
{/if}

<style type="scss">
    .animate-red-glowing {
        animation: glowing 1500ms infinite;
    }

    @keyframes glowing {
        0% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
        50% { background-color: #FF0000; box-shadow: 0 0 40px #FF0000; }
        100% { background-color: #B20000; box-shadow: 0 0 3px #B20000; }
    }

    .trigger:hover .reveal-on-trigger {
        display: flex;
    }
</style>
