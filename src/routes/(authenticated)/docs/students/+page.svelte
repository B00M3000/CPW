<script lang="ts">
    import { marked } from 'marked';
    import MainCollection from "@client/docs/students/searching.md?raw";
    import Gallery from "@client/docs/students/photogallery.md?raw";
    import ManageProjects from "@client/docs/students/manageprojects.md?raw";
    import ManagePhotos from "@client/docs/students/managephotos.md?raw";
    import Issues from "@client/docs/students/issues.md?raw";

    let markdownContents = MainCollection;
</script>

<main>

    <aside class="flex flex-col p-10">
        <h1>Student Documentation: </h1>
        <hr>
      <button on:click={() => {markdownContents = MainCollection}}> The Main Collection </button>
      <button on:click={() => {markdownContents = Gallery}}> The Gallery Page </button>
      <button on:click={() => {markdownContents = ManageProjects}}>  Manage Projects </button>
      <button on:click={() => {markdownContents = ManagePhotos}}>  Manage Photo </button>
      <button on:click={() => {markdownContents = Issues}}>  Fixing Issues </button>
    </aside>
    
    <div class="markdown-content">
        {@html marked(markdownContents)}
    </div>
</main>




<style lang="scss" scoped>
    h1{
        color: white;
        font-size: larger;
        font-weight: 600;
    }

    hr {
        margin-bottom:3rem;
        margin-top:1.5rem;
    }
    .markdown-content{
        overflow-y: auto;
        max-height: calc(100vh - var(--nav-bar-height));
        padding-left: 6rem;
        padding-right: 6rem;
        padding-top: 3rem;
        padding-bottom: 1rem;
    }
    main {
        display: flex;
        overflow: hidden;
        max-height: calc(100vh - var(--nav-bar-height));
        background: rgb(174, 174, 175);
        border-right: 1px;
    }

    aside {
        background-color: rgb(77, 76, 76);
        box-sizing: border-box;
        height: calc(100vh - var(--nav-bar-height));
        box-shadow: 2px 0px 5px var(--color-blue-grey-200);
    }



    button {
        display: block;
        text-decoration: none;
        color: #e9e9e9;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        transition: background-color 0.3s;
        border: none;
        text-align: left;
        cursor: pointer;
        background-color: transparent; 

        
        border-left: 3px solid #ddd; 
        padding-left: 15px; 
    }

    button:hover {
        background-color: #fafafa;
        transition: color 0.8s;
        color: black;
        font-weight: 800;
    }


    div {
        flex: 1;
        padding: 20px;
    }
    .markdown-content :global(h1){
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .markdown-content :global(hr){
        height: 0.2rem;
        border: none;
        background: gray;
        border-top: 3px double #8c8b8b;
        margin-top: 4rem;
    }


    .markdown-content :global(h2) {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 16px;
    }

    .markdown-content :global(h3) {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 16px;
        margin-top: 1.5rem;
    }

    .markdown-content :global(h4) {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
    }


    .markdown-content :global(p) {
        font-size: 17px;
        line-height: 1.5;
        margin-bottom: 12px;
    }


    .markdown-content :global(ul){
        list-style: disc;
        padding-left: 20px;
        margin-bottom: 12px;
    }

    .markdown-content :global(ol) {
        list-style: disc;
        padding-left: 20px;
        margin-bottom: 12px;
    }

    .markdown-content :global(li) {
        margin-bottom: 5px;
    }


    .markdown-content :global(em) {
        font-style: italic;
    }

    .markdown-content :global(strong) {
    font-weight: bold;
    }



    .markdown-content :global(blockquote) {
        font-style: italic;
        border-left: 5px solid #eee;
        padding: 8px;
        margin-bottom: 16px;
    }


    .markdown-content :global(a) {
        color: #007bff;
        text-decoration: none;
        transition: color 0.2s ease-in-out;
    }

    .markdown-content :global(a:hover) {
        color: #0056b3;
        text-decoration: underline;
    }


    .markdown-content :global(hr) {
        border: none;
        border-top: 1px solid #ccc;
        margin-bottom: 20px;
    }


    .markdown-content :global(img) {
        max-width: 100%;
        margin-bottom: 12px;
    }


    .markdown-content :global(table) {
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 16px;
    }
 
</style>
