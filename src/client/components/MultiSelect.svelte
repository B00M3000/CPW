<script lang="ts">
    export let options: any[] = [];
    export let selectedValues: any[] = [];
    let searchQuery ="";
    let selectedValuesView: any[] = [];
    function addToSelected(someOption: any) {
        let optionKey = someOption.key;
        selectedValues = [...selectedValues, optionKey];
        selectedValuesView = [...selectedValuesView, someOption];
        options = options.filter((option) => option.key !== optionKey);
    }

    function removeSelected(selectedValue: any) {
        selectedValues = selectedValues.filter(
            (value) => value !== selectedValue.key
        );
        selectedValuesView = selectedValuesView.filter(
            (value) => value !== selectedValue
        );
        options = [...options, selectedValue];
    }

    function removeAllTags(){
        for(const option of selectedValuesView){
            removeSelected(option)
        }
    }
    $: displayedTags = options
            .filter((p) =>
                JSON.stringify(p).toLowerCase().includes(searchQuery.toLowerCase())
            );
</script>

<div class="multi-select">
    <div class="dropdown">
        <input id="search-tag" class="dropbtn" type="search" placeholder="Search Tags" bind:value={searchQuery}/> 
       
        <div class="dropdown-content">
            {#each displayedTags as option}
                <button class="option" on:click={() => {addToSelected(option)}}>
                    {option.value}
                </button>
            {/each}
        </div>
    </div>
    <button class="clearallbtn" on:click = {removeAllTags}> × </button>
    <div class="selected-container">
        <div class="selected-bubbles">
            {#each selectedValuesView as selectedValue}
                <div class="bubble">
                    {selectedValue.value}
                    <span
                        class="remove-icon"
                        on:click={() => removeSelected(selectedValue)}>×</span
                    >
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .multi-select {
        display: flex;
        flex-wrap: wrap;
    }
    
    .clearallbtn {
        
        background-color: transparent;
        border: 2px solid black;
        border-radius: 5px;
        align-items: center;
        text-align: center;
        vertical-align: middle;
    }
    .clearallbtn:hover {
        background-color: gray;
    }
    .option {
        cursor: pointer;
        display: block;
        color: #000000;
        padding: 5px;
        text-decoration: none;
        padding: 5px 30px;
        border: 0.5px solid;
        width:100%;
    }

    .option:hover {
        color: #0a0a23;
        background-color: #ddd;
        border-radius: 5px;
    }

    .selected-bubbles {
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;
        font-weight: 200;
        
    }

    .bubble {
        display: flex;
        align-items: center;
        background-color: #ddd;
        padding: 2px 4px;
        margin: 4px;
        border-radius: 3px;
        font-size: 14px;
    }

    .remove-icon {
        margin-left: 8px;
        cursor: pointer;
    }

    .dropbtn {
        background-color: #525252;
        color: white;
        padding: 2px;
        font-size: 16px;
        border-radius: 5px;
        border: 2px solid black;
        border-radius: 5px;
        margin-right: 2px;

    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        overflow: auto;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.4);
        z-index: 50;
        overflow-y: scroll;
        max-height: 30vh;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }
</style>
