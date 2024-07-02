<script lang="ts">
    import { marked } from 'marked';
    import md from "@client/docs/home.md?raw";

    const markdownContents = md;
</script>

<main>
    <div class="markdown-content">
        {@html marked(markdownContents)}
    </div>
</main>

<style lang="scss" scoped>
    main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-self: center;
        align-items: center;
    }
    
    .markdown-content{
        margin: 5rem;
        padding-left: 10rem;
        padding-right: 10rem;
        max-width: 70rem;

    }


    .markdown-content :global(h1){
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .markdown-content :global(h2) {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
    }

    .markdown-content :global(h3) {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 12px;
    }

    .markdown-content :global(h4) {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
    }


    .markdown-content :global(p) {
        font-size: 16px;
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
