<script lang="ts">
    import { marked } from 'marked';
    import home from "@/client/help/home.md?raw";
</script>

<main class="flex flex-col items-center w-full">
    <div class="markdown mx-8 sm:max-w-[65vw] my-12 sm:my-24">
        {@html marked(home)}
    </div>
</main>

<style type=scss scoped>
    @import "./markdown.scss";
</style>
