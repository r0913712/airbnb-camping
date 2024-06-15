<template>
  <div class="home-page">
    <button @click="logout">Logout</button>
    <header class="header">
      <div class="user-info">
        <img :src="profileImageUrl" alt="Profile Picture" class="profile-picture">
        <span @click="goToEditUser">Edit my profile</span>
      </div>
    </header>
    <h1>Welcome, {{ user.f_Name }}!</h1>
    <div class="actions">
      <button @click="goToBookings">My Bookings</button>
      <button @click="goToCampingSpots">View Camping Spots</button>
      <button v-if="user.is_Owner" @click="goToOwnerBookings">Owner Bookings</button>
      <button v-if="user.is_Owner" @click="goToCreateCampingSpot">Create Camping Spot</button>
      <button v-if="user.is_Owner" @click="goToManageCampingSpots">Manage my Camping Spots</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      user: null,
    };
  },
  computed: {
    profileImageUrl() {
      if (this.user && this.user.image) {
        //console.log(this.user.image);
        return `data:image/jpeg;base64,${this.user.image}`;
      } else {
        return require('@/assets/img/pfp/default-frontend.jpg');
      }
    }
  },
  created() {
    const user = localStorage.getItem('currentUser');
    //console.log(user);
    if (user) {
      this.user = JSON.parse(user);
      //console.log(this.user);
    } else {
      // Redirect to login if no user is found
      this.$router.push('/login');
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/');
    },
    goToBookings() {
      this.$router.push('/bookings');
    },
    goToOwnerBookings() {
      this.$router.push('/owner-bookings');
    },
    goToCampingSpots() {
      this.$router.push('/camping-spots');
    },
    goToCreateCampingSpot() {
      this.$router.push('/create-camping-spot');
    },
    goToManageCampingSpots(){
      this.$router.push('/owner-camping-spots');
    },
    goToEditUser(){
      this.$router.push(`/edit-user/${this.user}`);
    }
  }
}
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 50px 20px;
  background: linear-gradient(to bottom, #fff, #f0f0f0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-width: 800px;
  margin: 50px auto;
  font-family: 'Arial', sans-serif;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #333;
}

.profile-picture-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.actions button {
  margin: 10px;
  padding: 15px 30px;
  font-size: 1.2em;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.actions button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
}

.actions button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
