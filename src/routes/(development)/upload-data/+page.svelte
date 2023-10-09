<script lang="ts">
    import DataImport from "@/client/components/DataImport.svelte";
    import { studentDataImport } from "@/lib/data-import";
</script>

<DataImport dataImport={studentDataImport} endpoint="/admin/data-import/students"/>

<style lang='scss'>

</style>