<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import { onMount } from "svelte";
    import toast from "svelte-french-toast";

    export let data;
    $: ({ inflatedProject } = data);
    let editing = false;

    let editedFullReport: string;
    onMount(() => {
        editedFullReport = inflatedProject.fullReport;
    });

    function toggleEditing() {
        editing = !editing;
    }

    async function saveReport() {
        inflatedProject.fullReport = editedFullReport;
        const res = await fetch(
            `/admin/project-catalog/${inflatedProject._id}`,
            {
                method: "POST",
                body: JSON.stringify({
                    Action: "SAVE",
                    fullReport: editedFullReport,
                }),
            },
        );

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            toast.error(body.message || "Could not save report.");
            return;
        }

        toast.success("Report saved.");
        toggleEditing();
        location.reload();
    }

    async function changePublish() {
        const res = await fetch(
            `/admin/project-catalog/${inflatedProject._id}`,
            {
                method: "POST",
                body: JSON.stringify({
                    Action: "PUBLISH",
                    publish: !inflatedProject.publish,
                }),
            },
        );

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            toast.error(body.message || "Could not update publish status.");
            return;
        }

        toast.success("Publish status updated.");
        toggleEditing();
        location.reload();
    }
</script>

<main>
    <h1>{inflatedProject.title}</h1>
    {#if inflatedProject.publish}
        <button class="unpublish-button" on:click={changePublish}
            >Unpublish Project</button
        >
    {:else if inflatedProject.underReview == false}
        <button class="unpublish-button" on:click={changePublish}
            >Publish Project</button
        >
    {/if}
    <p class="year"><strong>Year:</strong> {inflatedProject.year}</p>
    <p class="mentor">
        <strong>Mentor:</strong>
        {inflatedProject.mentor.name}, {inflatedProject.mentor.email}, {inflatedProject
            .mentor.phoneNumber}
    </p>
    <p class="student">
        <strong>Student:</strong>
        {inflatedProject.student.name}, {inflatedProject.student.email}
    </p>
    <p class="student">
        <strong>Short Description:</strong>
        {inflatedProject.shortDesc}
    </p>
    <p class="created-at">
        <strong
            >Created: {new Date(
                inflatedProject.createdAt,
            ).toLocaleString()}</strong
        >
    </p>
    <p class="created-at">
        <strong
            >Last Modified: {new Date(
                inflatedProject.updatedAt,
            ).toLocaleString()}</strong
        >
    </p>

    <div class="content-grid">
        <div class="pdf-section">
            <div class="pdf-header">
                <h3>Submitted PDF</h3>
                {#if inflatedProject.pdfUrl}
                    <a
                        href={inflatedProject.pdfUrl}
                        target="_blank"
                        rel="noreferrer">Download PDF</a
                    >
                {/if}
            </div>
            {#if inflatedProject.pdfUrl}
                <iframe title="Project PDF" src={inflatedProject.pdfUrl}
                ></iframe>
            {:else}
                <p class="empty-state">
                    No PDF has been uploaded for this project.
                </p>
            {/if}
        </div>

        <div class="text-section">
            {#if editing}
                <div class="full-report-edit">
                    <textarea bind:value={editedFullReport}></textarea>
                </div>
                <button class="save-button" on:click={saveReport}>Save</button>
            {:else}
                <div class="full-report">
                    {#if editedFullReport?.trim()}
                        <p class="report-text">{editedFullReport}</p>
                    {:else}
                        <p class="empty-state">
                            No text report has been saved for this project.
                        </p>
                    {/if}
                </div>
                <button class="edit-button" on:click={toggleEditing}
                    >Edit Full Report</button
                >
            {/if}
        </div>
    </div>
</main>

<style lang="scss">
    main {
        border: 1px solid #ccc;
        padding: 20px;
        margin: 2rem;
        background-color: #f5f5f5;
        border-radius: 10px;

        h1 {
            font-size: 24px;
        }

        .year,
        .mentor,
        .student,
        .created-at {
            font-size: 16px;
        }

        .full-report {
            max-height: 500px;
            overflow-y: auto;
            margin-top: 10px;
            padding: 10px;
            border: 1px solid black;

            p {
                margin: 0;
            }

            .report-text {
                white-space: pre-wrap;
            }
        }

        .pdf-section {
            margin-top: 1rem;
            background-color: #fff;
            border: 1px solid #c9c9c9;
            border-radius: 8px;
            padding: 12px;
        }

        .pdf-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .pdf-header a {
            color: #1d4ed8;
            text-decoration: underline;
        }

        .content-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .text-section {
            min-width: 0;
        }

        @media (min-width: 1650px) {
            .content-grid {
                grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
                align-items: start;
            }
        }

        .empty-state {
            color: #4b5563;
        }

        iframe {
            width: 100%;
            min-height: 28rem;
            border: 1px solid #ddd;
            border-radius: 6px;
        }

        .full-report-edit {
            textarea {
                width: 100%;
                height: 500px;
                font-family: "Monospace", "Trebuchet MS", Arial, sans-serif;
                font-size: 16px;
            }
        }

        .save-button,
        .unpublish-button,
        .edit-button {
            margin-top: 1rem;
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;

            &:hover {
                background-color: #0056b3;
            }
        }

        .edit-button {
            background-color: #28a745;
        }

        .unpublish-button {
            background-color: red;
        }
        .unpublish-button:hover {
            background-color: rgb(159, 32, 32);
        }
    }
</style>
