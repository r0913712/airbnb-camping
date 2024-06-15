<template>
  <div class="owner-camping-spots">
    <h1>My Camping Spots</h1>
    <div v-if="!campingSpots.length">
      <p>You have no camping spots.</p>
    </div>
    <div v-else>
      <div v-for="spot in campingSpots" :key="spot.camping_id" class="camping-spot">
        <h2>{{ spot.name }}</h2>
        <p>Description: {{ spot.description || 'No description available.' }}</p>
        <p>Price: ${{ spot.price }} /day</p>
        <!-- <p>Amenities:</p>
        <ul>
          <li v-for="amenity in spot.amenities" :key="amenity.amenities_id">{{ amenity.amenity }} ding dong</li>
        </ul> -->
        <button @click="goToUpdate(spot.camping_id)">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OwnerCampingSpots',
  data() {
    return {
      campingSpots: [],
      allAmenities: []
    };
  },
  created() {
    this.fetchCampingSpots();
    //this.fetchAllAmenities();
  },
  methods: {
    fetchCampingSpots() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user) {
        alert("User not logged in.");
        return;
      }

      fetch(`http://localhost:5022/api/Camping/${user.user_id}`)
        .then(response => response.json())
        .then(data => {
          this.campingSpots = data;
          //this.fetchCampingAmenities();
        })
        .catch(error => {
          console.error('Error fetching camping spots:', error);
        });
    },
    // fetchAllAmenities() {
    //   fetch(`http://localhost:5022/api/CampingAmenities`)
    //     .then(response => response.json())
    //     .then(data => {
    //       this.allAmenities = data;
    //     })
    //     .catch(error => {
    //       console.error('Error fetching amenities:', error);
    //     });
    // },
    // fetchCampingAmenities() {
    //   this.campingSpots.forEach(spot => {
    //     fetch(`http://localhost:5022/api/CampingAmenities/campingid/${spot.camping_id}`)
    //       .then(response => response.json())
    //       .then(amenitiesIds => {
    //         spot.amenities = this.allAmenities.filter(amenity => amenitiesIds.includes(amenity.amenities_id));
    //         console.log(spot.amenities);
    //       })
    //       .catch(error => {
    //         console.error(`Error fetching amenities for camping spot ${spot.camping_id}:`, error);
    //       });
    //   });
    // },
    goToUpdate(campingId) {
      this.$router.push({ name: 'UpdateCampingSpot', params: { id: campingId } });
    }
  }
};
</script>

<style scoped>
.owner-camping-spots {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.camping-spot {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(240, 240, 240, 0.8)); /* Decreased opacity */
}

.camping-spot ul {
  list-style-type: disc;
  padding-left: 20px;
}
</style>
