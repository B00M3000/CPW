<!--
 Created on Fri Oct 13 2023

 Copyright (c) 2023 Thomas Zhou
-->

<div class="fixed left-0 top-0 w-screen h-screen bg-cover bg-center blur-sm scale-110 bg-[url('/assets/CommonwealthSchool.jpg')]"></div>

<main class="flex justify-center items-center h-full bg-[#00000008] absolute z-10 w-full">
    <div class="flex flex-col items-center justify-center text-white">
        <h1 class="text-5xl font-bold [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)] max-sm:text-4xl text-center">Commonwealth Project Week</h1>

        <form class="search-bar m-2 mt-8" action="/projects" >
            <input type="text" class="search-input text-black" placeholder="Search projects..."  name="q">
            <button class="search-button" type="submit">Search</button>
        </form>

        <div class="grid grid-cols-1 sm:grid-cols-2 mx-4 ">
            <a class="btn text-center p-3 px-10 shadow-md" href="/projects">View Projects</a>
            <a class="btn text-center p-3 px-10 shadow-md" href="/images">Browse Photos</a>
        </div>
    </div>
</main>


<style lang="scss">
    .btn {
        display: inline-block;
        background-color: rgba(0, 0, 0, 0.3);
        color: white;
        border-radius: 5px;
        text-decoration: none;
        font-size: 1.1rem;
        transition: background-color 100ms;
        margin: 10px;
        cursor: pointer;

        &:hover {
            background-color: rgba(0, 0, 0, 0.6);
        }
    }

    .subtitle {
        font-size: 1.4rem;
        padding-bottom: 1rem;
        text-align: center;
    }

    .search-bar {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45vw;
    }

    .search-input {
        width: 55vw;
        padding: 15px;
        font-size: 1rem;
        // border: 1px solid var(--color-blue-600);
        border-radius: 5px 0 0 5px;
        outline: none;
    }

    .search-button {
        background-color: var(--color-blue-500);
        color: white;
        padding: 15px 30px;
        border: none;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s;
    }

    .search-button:hover {
        background-color: var(--color-blue-400);
    }

    .subtitle {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 20px;
    }


    .primary {
        padding: 20px;
    }

    .subtitle {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 5px;
        margin-top: 1.4rem;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        color:white;
    }


    .proj-container {
        background-color: transparent;
        padding: 20px;
        margin: 3rem;
        margin-top: 5px;
        margin-bottom: 2rem;
        padding: 1rem;
    }

    .project-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }
</style>
