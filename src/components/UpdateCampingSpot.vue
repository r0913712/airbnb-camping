<template>
  <div class="update-camping-spot">
    <h1>Update Camping Spot</h1>
    <form @submit.prevent="updateCampingSpot">
      <div class="form-section">
        <label for="name">Name:</label>
        <input type="text" v-model="name" id="name" required>
      </div>
      <div class="form-section">
        <label for="description">Description:</label>
        <textarea v-model="description" id="description"></textarea>
      </div>
      <div class="form-section">
        <label for="price">Price:</label>
        <input type="number" v-model="price" step="0.01" id="price" required>
      </div>
      <div class="form-section">
        <label for="amenities">Amenities:</label>
        <div class="amenities-list">
          <div v-for="(amenity, index) in allAmenities" :key="index" class="amenity-item">
            <input type="checkbox" :id="'amenity-' + amenity.amenities_id" :value="amenity.amenities_id" v-model="selectedAmenities">
            <label :for="'amenity-' + amenity.amenities_id">{{ amenity.amenity }}</label>
          </div>
        </div>
      </div>
      <button type="submit">Update</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      campingId: null,
      name: '',
      description: '',
      price: 0,
      allAmenities: [], // Array of all amenities
      selectedAmenities: [] // Array of selected amenity IDs
    };
  },
  created() {
    this.campingId = this.$route.params.id;
    this.fetchCampingSpot();
    this.fetchAllAmenities();
  },
  methods: {
    fetchCampingSpot() {
      fetch(`http://localhost:5022/api/Camping/GetCampingbyID/${this.campingId}`)
        .then(response => response.json())
        .then(data => {
          this.name = data.name;
          this.description = data.description;
          this.price = data.price;
          this.fetchSelectedAmenities(); // Ensure selected amenities are fetched after camping spot data
        })
        .catch(error => {
          console.error('Error fetching camping spot:', error);
        });
    },
    fetchAllAmenities() {
      fetch(`http://localhost:5022/api/CampingAmenities`)
        .then(response => response.json())
        .then(data => {
          this.allAmenities = data;
        })
        .catch(error => {
          console.error('Error fetching amenities:', error);
        });
    },
    fetchSelectedAmenities() {
      fetch(`http://localhost:5022/api/CampingAmenities/campingid/${this.campingId}`)
        .then(response => response.json())
        .then(data => {
          this.selectedAmenities = data.map(amenity => amenity.amenities_id);
        })
        .catch(error => {
          console.error('Error fetching selected amenities:', error);
        });
    },
    updateCampingSpot() {
      // Update camping spot details
      const spotData = new FormData();
      spotData.append('Name', this.name);
      spotData.append('Description', this.description);
      spotData.append('Price', this.price);

      fetch(`http://localhost:5022/api/Camping/UpdateCampingSpot/${this.campingId}`, {
        method: 'PUT',
        body: spotData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update camping spot details');
        }
      })
      .catch(error => {
        console.error('Error updating camping spot:', error);
        alert('Failed to update camping spot details.');
      });

      // Update amenities
      const amenitiesData = new FormData();
      this.selectedAmenities.forEach((amenityId) => {
        amenitiesData.append('amenities', amenityId);
      });

      fetch(`http://localhost:5022/api/CampingAmenities/update/${this.campingId}`, {
        method: 'PUT',
        body: amenitiesData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update amenities');
        }
        alert('Camping spot updated successfully!');
        this.$router.push('/owner-camping-spots');
      })
      .catch(error => {
        console.error('Error updating amenities:', error);
        alert('Failed to update amenities.');
      });
    }
  }
};
</script>

<style scoped>
.update-camping-spot {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

form div {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.form-section {
  background-color: rgba(255, 255, 255, 0.8); /* Mildly opaque background */
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1); /* Mildly opaque border */
  border-radius: 5px;
  margin-bottom: 10px;
}

.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.amenity-item {
  display: flex;
  align-items: center;
}

.amenity-item input {
  margin-right: 5px;
}
</style>
