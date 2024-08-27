<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    interface Mentor {
        _id: string;
        name: string;
    }

    let { mentor }: { mentor: Mentor } = $props();
</script>

<a href="/mentor/{mentor._id}" class="flex gap-2 p-2 px-3 bg-gray-400 rounded-l-full rounded-r-full items-center">
    <span class="text-sm text-center">{mentor.name || "Mentor Not Found!"}</span>
</a>
