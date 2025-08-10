<script>
    import toast, { Toaster } from 'svelte-french-toast';

    import "@/app.css";
</script>

<svelte:head>
    <meta property="og:title" content="Project Week Database" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://cpw.tzhou.xyz" />
    <meta property="og:image" content="https://cpw.tzhou.xyz/assets/CommonwealthSchool.jpg" />
    <meta property="og:description" content="This is the database housing records of Project Week projects. Find inspiration from and look at projects completed in previous years." />
    <meta property="og:determiner" content="the" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:site_name" content="Commonwealth School" />

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@commschool">
    <meta name="twitter:title" content="Project Week Database">
    <meta name="twitter:description" content="This is the database housing records of Project Week projects. Find inspiration from and look at projects completed in previous years.">
    <meta name="twitter:image" content="https://cpw.tzhou.xyz/assets/CommonwealthSchool.jpg">
</svelte:head>

<Toaster />
<slot />
