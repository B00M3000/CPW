<script lang="ts">
    import { AccessLevel, AccountType } from "@/lib/enums";
    export let data;

    const user = data.user;
    $: ({ projectCountNotPublished, projectCount, imageCount } = data)
    

    let totalProjects = 15
    let pendingProjects = 20
</script>

<main>
    <div class="dashboard">
              
        <div class="account-details">
            <div class="profile">
                <div class="profile-picture">
                    <img src={user?.picture} alt="pfp">
                </div>
                <div class="student-info">
                    <h1 class="title">{user?.name}</h1>
                    <h1 class="title">{user?.email}</h1>
                    <h2 class="title"> {AccountType[user.accountType]} - {AccessLevel[user.accessLevel]}</h2>
                </div>
            </div>
          </div>
          
        <div class="panel">
          <h2>Projects</h2>
          <p>Total projects: {projectCount}</p>
        </div>
      
        <div class="panel">
          <h2>Pending Projects</h2>
          <p>Pending projects: {projectCountNotPublished}</p>
        </div>

        <div class="panel">
            <h2> Photos </h2>
            <p> Number of Photos: {imageCount}</p>
        </div>
        
      
        <div class="button-panel">
          <a class="button" href="/manage-projects"> Manage Projects </a>
          <a class="button" href="/manage-projects"> Manage Photos </a>
        </div>
    

      </div>
</main>

<style lang="scss">
   .dashboard {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .panel {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 20px;
    margin: 10px;
    width: 28vw; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .button-panel {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 20px;
    margin: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .button {
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    margin-top: 10px;
  }

  .account-details {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 20px;
    margin: 10px;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .profile {
        justify-content: center;
        font-weight: 900;
        color: #333;
        font-size: 0.5rem;
        align-items: center;
        padding: 20px;
        display: flex;
        gap: 20px;
        border-radius: 10px;
    }

    img {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        object-fit: cover;
    }

    .profile-picture {
        flex-shrink: 0; 
    }

    .title {
        text-align: left;
        margin: 0.1rem;
    }

    .student-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

</style>
