<!--
 Created on Fri Oct 15 2023

 Copyright (c) 2023 Thomas Zhou
-->

<script lang="ts">
    import DataImport from "@/client/components/DataUpload.svelte";
    import { studentDataUpload } from "@/lib/data-upload";
    import { teacherDataUpload } from "@/lib/data-upload";
    import { advisorLinkageDataUpload } from "@/lib/data-upload";
</script>

<DataImport dataUpload={studentDataUpload} endpoint="/admin/data-upload/students"/>
<DataImport dataUpload={teacherDataUpload} endpoint="/admin/data-upload/teachers"/>
<DataImport dataUpload={advisorLinkageDataUpload} endpoint="/admin/data-upload/advisor-linkages"/>