<script lang=ts>
    import axios from "axios";

    import { get, type Writable, writable } from "svelte/store";

    import MobileUpload from "@/client/components/MobileUpload.svelte";
    import LazyImage from "@/client/components/LazyImage.svelte";
    import Icon from "@/client/components/Icon.svelte";
    import CloudUpload from "@/client/icons/CloudUpload";
    import { bytesToString, sleep } from "@/lib/utils";
    import Progress from "./Progress.svelte";
    import DescriptionEditor from "./DescriptionEditor.svelte";
    import { goto, invalidate } from "$app/navigation";
    import Trash from "@/client/icons/Trash";

    interface UploadedImageData {
        _id: string;
        size: number;
        description: string;
        projectId: string;
        createdAt: Date;
        project: {
            title: string;
        };
    };
    interface UploadQueueItem {
        image: File;
        status: Writable<UploadQueueItemStatus>;
        progress: Writable<number>;
        project: Project;
        imageId: Writable<string>;
    };
    interface Project {
        _id: string;
        title: string;
    }
    enum UploadedImageStatus { Unchanged, Deleting, Deleted };
    enum UploadQueueItemStatus { NotUploaded, Uploading, Failed, Uploaded };
    interface PageData { images: UploadedImageData[]; projects: Project[] };
    interface UploadedImage extends UploadedImageData { status: UploadedImageStatus; };

    export let data: PageData;

    let uploadedImages: UploadedImage[];
    $: uploadedImages = data.images.map((image: UploadedImageData) => ({ ...image, status: UploadedImageStatus.Unchanged }))

    let projects: Project[];
    $: projects = data.projects;

    let projectId: string;

    let imageUploadQueue: UploadQueueItem[] = [];

    async function deleteImage(id: string) {
        const imageIndex = uploadedImages.findIndex(image => image._id == id)

        uploadedImages[imageIndex].status = UploadedImageStatus.Deleting

        await fetch(`/manage-images/${id}`, { method: "DELETE" });

        await sleep(200);

        uploadedImages[imageIndex].status = UploadedImageStatus.Deleted
    }

    async function addImageToUploadQueue(image: File) {
        const queueItem: UploadQueueItem = {
            image,
            status: writable(UploadQueueItemStatus.NotUploaded),
            progress: writable(0),
            project: projects.find(p => p._id == projectId),
            imageId: writable()
        }

        imageUploadQueue.push(queueItem)
        imageUploadQueue = imageUploadQueue;

        const formData = new FormData();
        formData.append('image', image);
        formData.append('description', "");
        formData.append('projectId', projectId);

        const response = await axios({
            url: '/manage-images/upload',
            method: "put",
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData,
            onUploadProgress: (p: any) => {
                queueItem.progress.set(p.progress);
            }
        });
        
        if(response.status == 200) {
            queueItem.status.set(UploadQueueItemStatus.Uploaded);
            uploadedImages.unshift({
                ...(await response.request.json()),
                project: {
                    title: queueItem.project.title
                },
                status: UploadedImageStatus.Unchanged
            })
        } else {
            queueItem.status.set(UploadQueueItemStatus.Failed);
        }

        queueItem.imageId.set(response.data.imageId);
    }

    function handleFileDrop(event: DragEvent) {
        if(!event.dataTransfer) return;
        if (event.dataTransfer.items) {
            [...event.dataTransfer.items].forEach((item, i) => {
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    if(file) {
                        addImageToUploadQueue(file)
                    } else {
                        throw Error("Could not get file.")
                    }
                }
            });
        } else {
            [...event.dataTransfer.files].forEach((file, i) => {
                addImageToUploadQueue(file)
            });
        }
    }

    function handleFileInput() {
        for(let file of fileInput.files || []) {
            addImageToUploadQueue(file);
        }
    }

    let fileInput: HTMLInputElement;

    let mobileKeyOverlay = false;

    function closeOverlay(event?: MouseEvent) {
        if(event?.target?.nodeName == "BUTTON") mobileKeyOverlay = false
    }
</script>

{#if mobileKeyOverlay}
<button class="overlay" on:click={closeOverlay}>
    <MobileUpload {projectId}/>
</button>
{/if}

<input type="file" class="hidden" bind:this={fileInput} on:input={handleFileInput} accept="image/png,image/jpeg,image/gif" multiple />
<main class="flex justify-center">
    <div class="flex flex-col bg-gray-100 rounded-3xl m-5 p-5 max-w-7xl gap-3">
        <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold">Upload and manage your project images</h1>
            <p class="text-md text-gray-500">Upload new project images, alter the descriptions, and delete images. Note that once an image has been uploaded, it cannot be swapped out/changed. You must delete the image and then upload the desired image.</p>
        </div>

        <hr class="border-2 border-gray-200 rounded-sm">

        <div class="flex flex-col gap-2">
            <h2 class="text-2xl font-bold">Uploading images</h2>
            <div class="flex items-center">
                <label for="project">Choose associated project: </label>
                <select
                    id="project"
                    name="projectId"
                    class="border-black border-[1px] rounded-md p-1 ml-3"
                    disabled={projects.length == 0}
                    required
                    bind:value={projectId}
                >
                    <option disabled selected value="none">Please select a project!</option>
                    {#each projects as project}
                        <option value={project._id}>{project.title}</option>
                    {/each}
                </select>
            </div>
        </div>  

        {#if /^[0-9A-Fa-f]{24}$/.test(projectId)}
        <div class="flex items-center mx-2">
            <button class="p-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white" on:click={() => mobileKeyOverlay = true}>Mobile Upload</button>
            <span class="p-7">OR</span>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <button class="border-4 flex-grow border-slate-300 bg-slate-200 rounded-xl flex-col h-36 flex justify-center items-center" on:click={() => fileInput.click()} on:dragover|preventDefault on:drop|preventDefault={handleFileDrop} aria-dropeffect="execute">
                <div class="p-2 bg-gray-300 inline-flex rounded-full mb-1">
                    <Icon src={CloudUpload} size="2em" color="#505080"/>
                </div>
                <span class="text-gray-700"><strong>Click to upload</strong> or drag and drop</span>
                <span class="text-gray-700">PNG, JPG, or GIF</span>
            </button>
        </div>
        {/if}

        {#if imageUploadQueue.length > 0}
        <div class="flex flex-col border-[3px] rounded-xl">
            <div class="p-6">
                <h1 class="font-bold text-2xl">Uploads in progress</h1>
                <span>*Please add descriptions to your images after uploading them on the text fields to the right.</span>
            </div>
            <div class="flex flex-col">
                {#each imageUploadQueue as item}
                <div class="flex justify-center border-y-[3px]">
                    <div class="p-4 flex justify-center items-center">
                        <div class="flex justify-center items-center rounded-xl w-20 h-20">
                            <img src={URL.createObjectURL(item.image)} class="w-20 h-20 rounded-xl"/>
                        </div>
                    </div>
                    <div class="flex flex-col p-6 gap-3 justify-center">
                        {#if get(item.progress) == 100}
                        <span>{item.project.title}</span>
                        <Progress valueStore={item.progress} />
                        {:else}
                        <span>Upload Complete! See below in the table.</span>
                        {/if}
                    </div>
                </div>
                {/each}
            </div>
        </div>
        {/if}

        <hr class="border-2 border-gray-200 rounded-sm">

        <div class="flex rounded-2xl border-[3px] flex-col">
            <div class="flex flex-col gap-1 m-5">
                <h1 class="text-2xl font-bold">Uploaded images</h1>
                <p class="text-md text-gray-500">Project images that you uploaded.</p>
            </div>

            <table>
                <thead class="bg-gray-300">
                    <tr class="border-t-[3px]">
                        <th class="p-4 text-gray-700">Image</th>
                        <th class="p-4 text-gray-700">Associated Project</th>
                        <th class="p-4 text-gray-700">Description</th>
                        <th class="p-4 text-gray-700">Upload Date</th>
                        <th class="p-4 text-gray-700">Size</th>
                        <th class="p-4 text-gray-700">
                            <div class="flex items-center justify-center ">
                                <button class="inline-flex items-center justify-center p-1 px-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white" on:click={async () => {
                                    invalidate('user:imagelist')
                                }}>Refresh</button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {#each uploadedImages as image}
                    <tr class="border-y-[3px]">
                        <td>
                            <div class="p-4 flex justify-center items-center">
                                <div class="flex justify-center items-center rounded-xl w-20 h-20">
                                    <LazyImage src="/images/{image._id}" loadingClassname="w-6 h-6" className="rounded-xl w-full h-full" alt={image.description || "N/A"}/>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="p-4 flex justify-center items-center">
                                <span>{image.project.title}</span>
                            </div>
                        </td>
                        <td>
                            <div class="p-4 flex justify-center items-center">
                                <DescriptionEditor imageId={writable(image._id)} current={image.description || "N/A"} />
                            </div>
                        </td>
                        <td>
                            <div class="p-4 flex justify-center items-center">
                                <span>{image.createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </td>
                        <td>
                            <div class="p-4 flex justify-center items-center">
                                <span>{bytesToString(image.size)}</span>
                            </div>
                        </td>
                        <td>
                            <div class="p-4 flex justify-center items-center">
                                {#if image.status == UploadedImageStatus.Unchanged}
                                <button class="bg-red-500 hover:bg-red-600 py-2 px-4 text-red-50 rounded-lg flex items-center gap-2" on:click={() => deleteImage(image._id)}>
                                    <Icon src={Trash} size="1rem" color="white" />
                                    <span class="pt-[2px]">Delete</span>
                                </button>
                                {:else if image.status == UploadedImageStatus.Deleting}
                                <img src='/assets/loading.gif' class="w-4 h-4">
                                {:else}
                                <span>Deleted</span>
                                {/if}
                            </div>
                        </td>
                    </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</main>

<style>
    .overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;

        left: 0;
        top: 0;
        z-index: 9999;
        
        width: 100vw;
        height: 100vh;

        background: rgba(1, 1, 1, 0.2);
    }
</style>
