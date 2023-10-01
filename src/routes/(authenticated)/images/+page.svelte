<script lang="ts">
    let form: HTMLFormElement;

    async function upload(e: SubmitEvent) {
        e.preventDefault()

        const formData = new FormData(form)

        formData.set('projectId', "65010b92ba52f61ee697f518")

        fetch('/images', {
            method: "PUT",
            body: formData
        })
    }
</script>

<form bind:this={form} on:submit={upload}>
    <input type="file" name="image" multiple={false} accept="image/png,image/jpeg,image/gif" />
    <input type="text" name="description">
    <button type="submit">Upload</button>
</form>

