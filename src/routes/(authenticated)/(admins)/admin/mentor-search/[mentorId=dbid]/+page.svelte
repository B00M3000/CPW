<script lang="ts">
    import InformationBox from '@/client/components/InformationBox.svelte';
    import { onMount } from 'svelte';

 
    export let data;
    interface MentorInformation {
      mentorId: string;
      firstName: string;
      lastName: string;
      organization: string;
      email: string;
      phoneNumber: string;
    }

    
    $: ({mentor: originalMentor, mentorId} = data)

    let mentor: MentorInformation = {
      mentorId: "",
      firstName: "",
      lastName: "",
      name: "",
      organization: "",
      email: "",
      phoneNumber: "",
    };


    let mentorFirst: string;
    let mentorLast: string;
    let mentorOrg: string;
    let mentorEmail: string;
    let mentorPhone: string;
    let name: string;

    onMount(() => {
        mentor = originalMentor;
    })

    let success = false
    async function updateMentorInfo(){
        mentor.name = mentor.firstName + " " + mentor.lastName;
        const res = await fetch(`/admin/mentor-search/${mentorId}`, {
            method: "POST",
            body: JSON.stringify({mentor})
        });

        if(res.ok){
            success = true;
        }
    }
</script>

<main>
    <div class="form-container">
        <div class="input-container">
            <h4>Update First Name</h4>
            <input bind:value={mentor.firstName}/>
        </div>

        <div class="input-container">
            <h4>Update Last Name</h4>
            <input bind:value={mentor.lastName}/>
        </div>

        <div class="input-container">
            <h4>Update Organization</h4>
            <input bind:value={mentor.organization}/>
        </div>

        <div class="input-container">
            <h4>Update Email</h4>
            <input bind:value={mentor.email}/>
        </div>

        <div class="input-container">
            <h4>Update Phone Number</h4>
            <input bind:value={mentor.phoneNumber}/>
        </div>

        <button on:click={updateMentorInfo}>Save</button>
        {#if success}
            <div class="overlay">
            <div class="info-box">
                <InformationBox 
                    backgroundColor="var(--color-green-100)" 
                    borderColor="var(--color-green-600)" 
                    textColor="var(--color-green-600)" 
                    headingColor="var(--color-green-500)" 
                    heading="Success!!" 
                    text={"Mentor was updated! You should see the changes reflected accordingly."}
                />
                
            </div>
            <div class="info-box-button-submit"> <a data-sveltekit-reload href="/admin/mentor-search" > Got It! </a> </div>
            </div>
        {/if}
    </div>
</main>

<style lang="scss">
    main {
        display: flex;
        justify-content: center;
        .form-container{
            
            padding: 1.5rem;
            margin-bottom: 2rem;
            input {
                padding: 0.8rem 0.9rem;
                border: 1px solid #000;
                border-radius: 0.1rem;
                outline: none;
                transition: box-shadow 0.2s, border-color 0.2s;
                color: black;
                width: 300px;
                background-color: white;
            }

            button{
                width: 80px;
                padding: 10px 20px;
                background-color: var(--color-blue-500);
                border: transparent;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                cursor: pointer;
            }


            button:hover{
                background-color: var(--color-blue-400);
            }
            
            .input-container{
                margin-bottom: 1.5rem;
                h4{
                    margin: 10px 0px;
                }
            }

            .overlay {
                position:fixed;
                margin: 0;
                top:0;
                left:0;
                right:0;
                bottom:0;
                background-color:rgba(0, 0, 0, 0.85);
                z-index:9999;
            }
            .info-box{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 25vh;
            }

            .info-box-button-submit a{
                margin-top: 0.2rem;
                text-decoration: none;
                border: var(--color-green-600) 3px solid;
                border-radius: 0%;
                color: white;
                background-color: transparent;
                padding: 0.5em;
                font-size: 16px;
                border-radius: 4px;
                
            }

            .info-box-button-submit a:hover{
                background-color: rgba(35, 161, 39, 0.35);
                
            }

            .info-box-button-submit{
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>