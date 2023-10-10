<script lang="ts">
    import DataImport from "@/client/components/DataUpload.svelte";
    import { studentDataUpload } from "@/lib/data-upload";
    import { teacherDataUpload } from "@/lib/data-upload";
    import { advisorLinkageDataUpload } from "@/lib/data-upload";
</script>

<DataImport dataUpload={studentDataUpload} endpoint="/admin/data-upload/students"/>
<DataImport dataUpload={teacherDataUpload} endpoint="/admin/data-upload/teachers"/>
<DataImport dataUpload={advisorLinkageDataUpload} endpoint="/admin/data-upload/advisor-linkage"/>

<style lang='scss'>

</style>