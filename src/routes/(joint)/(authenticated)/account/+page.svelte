<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { AccessLevel, AccountType } from "@/lib/enums";
    import { user } from "@/client/stores/user";
    import Icon from "@/client/components/Icon.svelte";
    import FileText from "@/client/icons/FileText.js";
    import Images from "@/client/icons/Images.js";
    import People from "@/client/icons/People.js";
    import Ind from "./ChecklistItemStatusIndicator.svelte";
    import { Launch, Dashboard } from "carbon-icons-svelte"
    import { currentYear } from "@/lib/utils";

    let { data } = $props();

    let aNavGridCols = $derived(($user.accountType == AccountType.Student ? 2 : 0) + ($user.accountType == AccountType.Advisor ? 1 : 0) + ($user.accessLevel == AccessLevel.Admin ? 1 : 0))
</script>

<main class="flex flex-col justify-center items-center min-h-full">
    <div class="my-6 mx-4 sm:mx-8 bg-gray-300 p-8 rounded-xl flex flex-col">
        <h1 class="text-4xl lg:text-5xl mb-8 text-center">My Account</h1>
        <div class="flex max-lg:flex-col gap-12">
            <div class="flex flex-col items-center">
                <div class="flex items-center gap-5 sm:gap-10">
                    <img class="w-16 h-16 sm:w-32 sm:h-32 rounded-full" src={$user.picture} alt="profile">

                    <div class="flex flex-col text-base sm:text-xl ">
                        <span class="font-bold">{$user.name}</span>
                        <span class="font-bold">{$user.email}</span>
                        <span class="font-bold"> {AccountType[$user.accountType]} - {AccessLevel[$user.accessLevel]}</span>
                    </div>
                </div>

                <h1 class="text-3xl my-4">Welcome back {$user.firstName}!</h1>

                <div class="flex max-md:flex-col justify-center gap-4 items-center m-4 text-blue-950">
                    {#if $user.accountType == AccountType.Student}
                    <a class="flex items-center gap-3 p-3 bg-blue-400 hover:bg-blue-500 rounded-lg w-full h-full"
                        href="/manage-projects" data-sveltekit-preload-data>
                        <Icon src={FileText} size="1.25rem"/>
                        <span>My Projects</span>
                    </a>
                    <a class="flex items-center gap-3 p-3 bg-blue-400 hover:bg-blue-500 rounded-lg w-full h-full"
                        href="/manage-images" data-sveltekit-preload-data>
                        <Icon src={Images} size="1.25rem"/>
                        <span>My Images</span>
                    </a>
                    {/if}
                    {#if $user.accountType == AccountType.Advisor}
                    <a class="flex items-center gap-3 p-3 bg-blue-400 hover:bg-blue-500 rounded-lg w-full h-full"
                        href="/manage-advisees" data-sveltekit-preload-data>
                        <Icon src={People} size="1.25rem"/>
                        <span>My Advisees</span>
                    </a>
                    {/if}
                    {#if $user.accessLevel == AccessLevel.Admin}
                    <a class="flex items-center gap-3 p-3 bg-blue-400 hover:bg-blue-500 rounded-lg w-full h-full"
                        href="/admin" data-sveltekit-preload-data>
                        <Dashboard size={24}/>
                        <span>Admin Dashboard</span>
                    </a>
                    {/if}
                </div>

                <!-- <div class="flex flex-col gap-2 items-center mb-4">
                    <h2 class="text-2xl">Important Announcements: </h2>
                    <h2 class="text-xl text-gray-800">[none]</h2>
                </div> -->
                <!-- Use modal instead! -->

                <div class="text-center max-w-[36rem]">
                    <h2 class="text-2xl my-5">Reminder! PLEASE READ!!!</h2>
                    <p class="text-wrap mb-5">Navigate to public pages using the navigation bar. To manage your own projects and images, utilize the hover menu on your google icon in the top right. For Advisors, the same menu contains the button to view your advisees.</p>
                    <p class="text-wrap">Additionally, if any pages or things look broken or wonky (or too small), feel free to zoom in and out with Ctrl + and -, or use desktop mode if on mobile.</p>
                </div>
            </div>
            <div class="flex flex-col items-center justify-center gap-5">
                <h2 class="text-xl text-left">Project Week {currentYear()} Checklist</h2>

                {#if $user.accountType == AccountType.Student}
                {@const student = data.checklist.student}
                <div class="p-4 rounded-lg bg-gray-200 flex flex-col items-start max-w-[36rem]">
                    <h3 class="text-lg font-bold mb-2">Student</h3>
                    <div class="grid grid-cols-[auto_auto_auto] gap-3 ml-2">
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            <Ind type="green" />
                            <span>Login to the website.</span>
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            <Ind type={student.createdProject ? "green" : "red"} />
                            <span>Create a project.</span>
                            <a href="/manage-projects" class="hover:bg-gray-300 rounded-full p-2">
                                <Launch color="blue" size={20}/>
                            </a>
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            <Ind type={student.uploadedReportLength > 1250 ? "green" : student.uploadedReportLength > 0 ? "orange" : "red"} />
                            <span>{student.uploadedReportLength > 1250 ? "Looking good! Your report is uploaded." : student.uploadedReportLength > 0 ? "Your report is quite short! (Under 1250 characters / 250 words / 1 page double spaced)" : "Upload your report"}</span>
                            <a href="/manage-projects" class="hover:bg-gray-300 rounded-full p-2">
                                <Launch color="blue" size={20}/>
                            </a>
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            <Ind type={student.acquiredAdvisorApproval ? "green" : "red"} />
                            {#if student.acquiredAdvisorApproval}
                            <span>Your project has been approved! You have completed all required elements.</span>
                            {:else}
                            <div class="flex flex-col items-start">
                                <span>Get your advisor to approve your project.</span>
                                <span class="text-xs text-gray-600">(You should be in regular contact by email or in person reguarding your project and project report status. You're strongy encouraged to share your report with your advisor prior to seeking final approval.)</span>
                            </div>
                            {/if}
                            <span>{student.acquiredAdvisorApproval ? "" : ""}</span>
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            <Ind type={student.imagesAdded >= 5 ? "green" : student.imagesAdded > 1 ? "orange" : "red"} />
                            <span>{
                                student.imagesAdded >= 5 ? `${student.imagesAdded} images added!` :
                                student.imagesAdded > 1 ? "Please consider uploading a few more images." : "Pictures help paint a better picture of what the experience was like. Please upload images."
                            }</span>
                            <a href="/manage-images" class="hover:bg-gray-300 rounded-full p-2" data-sveltekit-preload-data>
                                <Launch color="blue" size={20}/>
                            </a>
                        </div>
                    </div>
                </div>
                {:else if $user.accountType == AccountType.Advisor}
                {@const advisor = data.checklist.advisor}
                {@const adviseeCount = $user.adviseeIds.length}
                <div class="p-4 rounded-lg bg-gray-200 flex flex-col items-start  max-w-[36rem]">
                    <h3 class="text-lg font-bold mb-2">Advisor</h3>
                    <div class="grid grid-cols-[auto_auto] gap-2 ml-2">
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            <Ind type="green" />
                            <span>Login to the website.</span>
                        </div>
                        <div class="col-start-2 col-end-2 max-w-96">
                            <span class="text-sm text-gray-600">Please help guide your advisees through the entire process and remind them to complete these steps.</span>
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            <Ind type={advisor.notVisited == 0 ? "green" : advisor.notVisited == adviseeCount ? "red" : "orange"} />
                            {#if advisor.notVisited == 0}
                            <span>All advisees have checked out the website!</span>
                            {:else if advisor.notVisited == adviseeCount}
                            <span>No advisees have checked out the website.</span>
                            {:else}
                            <span>{advisor.notVisited} advisees have not visited the website.</span>
                            {/if}
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            {#if advisor.notCreatedProjects == 0}
                            <Ind type="green" />
                            <span>All advisees have created a project!</span>
                            {:else if advisor.notCreatedProjects == adviseeCount}
                            <Ind type="red" />
                            <span>No advisees have created a project.</span>
                            {:else}
                            <Ind type="orange" />
                            <span>{advisor.notCreatedProjects} advisees have not created a project.</span>
                            {/if}
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            {#if advisor.notUploadedReports == 0}
                            <Ind type="green" />
                            <span>All advisees have uploaded a report!</span>
                            {:else if advisor.notUploadedReports == adviseeCount}
                            <Ind type="red" />
                            <span>No advisees have uploaded a report</span>
                            {:else}
                            <Ind type="orange" />
                            <span>{advisor.notUploadedReports} advisees have not uploaded a report.</span>
                            {/if}
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            {#if advisor.notApproved == 0}
                            <Ind type="green" />
                            <span>All advisee projects have been approved. Congrats, you are all set!</span>
                            {:else if advisor.notApproved == adviseeCount}
                            <Ind type="red" />
                            <span>No advisees have been approved yet.</span>
                            {:else}
                            <Ind type="orange" />
                            <span>{advisor.notApproved} advisees have not been approved. <p class="text-gray-400 text-sm">({advisor.adviseeCount - advisor.notApproved} approved. Hooray!)</p></span>
                            {/if}
                        </div>
                        <div class="grid grid-cols-subgrid col-span-full items-center justify-center">
                            {#if advisor.notHaveImages == 0}
                            <Ind type="green" />
                            <span>All advisees have uploaded images.</span>
                            {:else if advisor.notHaveImages == adviseeCount}
                            <Ind type="red" />
                            <span>No advisees have uploaded any images. Please encourage your advisees to upload images. It helps paint a better picture of what the experience was like.</span>
                            {:else}
                            <Ind type="orange" />
                            <span>{advisor.notApproved} have not uploaded images. Please encourage your advisees to upload images. It helps paint a better picture of what the experience was like.</span>
                            {/if}
                        </div>
                    </div>
                </div>
                {/if}

                {#if $user.accessLevel == AccessLevel.Admin}
                <div class="p-4 rounded-lg bg-gray-200 flex flex-col items-start">
                    <h3 class="text-lg font-bold mb-2">Admin</h3>
                    <div class="flex flex-col ml-2 max-w-[30rem] gap-2">
                        <span>1. Upload new student, advisor, and advisee student relation data.</span>
                        <span>2. Oversee advisees and the approval process.</span>
                        <span>3. Utilize the report generator to hunt people who haven't done what they are supposed to.</span>
                    </div>
                </div>
                {/if}
            </div>
        </div>
    </div>
</main>
