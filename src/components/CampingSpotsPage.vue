<template>
  <div class="camping-spots">
    <h1>Camping Spots</h1>
    <div class="selection-section">
      <div>
        <label for="start-date">Start Date:</label>
        <input type="date" v-model="startDate" id="start-date">
      </div>
      <div>
        <label for="end-date">End Date:</label>
        <input type="date" v-model="endDate" id="end-date">
      </div>
      <div>
        <label for="zipcode">Filter by Zipcode:</label>
        <select v-model="zipcode" id="zipcode">
          <option v-for="zip in zipcodes" :key="zip" :value="zip">{{ zip }}</option>
        </select>
      </div>
      <div>
        <label for="amenities">Filter by Amenities:</label>
        <div v-for="amenity in amenities" :key="amenity.amenities_id">
          <input type="checkbox" :value="amenity.amenity" v-model="selectedAmenities">{{ amenity.amenity }}
        </div>
      </div>
      <button @click="fetchAvailableSpots">Search</button>
    </div>
    <div v-if="campingSpots.length === 0 && searchClicked">
      <p>No camping spots available.</p>
    </div>
    <div v-else class="camping-spot-list">
      <div v-for="spot in filteredCampingSpots" :key="spot.camping_id" class="camping-spot">
        <h2>{{ spot.name }}</h2>
        <div class="carousel">
          <div class="carousel-inner">
            <div v-for="(image, index) in getImagesForCampingId(spot.camping_id)" :key="index" class="carousel-item" :class="{ active: index === activeIndex[spot.camping_id] }">
              <img :src="image.src" :alt="'Image for camping ID ' + spot.camping_id" />
            </div>
          </div>
        </div>
        <p>{{ spot.description || 'No description available.' }}</p>
        <p>Price: ${{ spot.price }} /day</p>
        <p>Address: {{ spot.address }}</p>
        <div>
          <p>Amenities:</p>
          <ul>
            <li v-for="amenity in getAmenitiesForCampingId(spot.camping_id)" :key="amenity.amenities_id">{{ amenity.amenity }}</li>
          </ul>
        </div>
        <button @click="goToDetails(spot.camping_id)">More Info</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CampingSpots',
  data() {
    return {
      campingSpots: [],
      startDate: '',
      endDate: '',
      searchClicked: false,
      zipcode: '',
      zipcodes: [],
      amenities: [],
      selectedAmenities: [],
      campingImages: new Map(), // Map to store camping images by camping_id
      activeIndex: {}, // Object to store the active image index for each camping_id
      carouselInterval: null, // Store the interval ID
      campingAmenities: new Map(), // Map to store amenities by camping_id
      locationData: new Map() // Map to store location data by location_id
    };
  },
  methods: {
    fetchZipcodes() {
      fetch('http://localhost:5022/api/Location/GetAllZipcodes')
        .then(response => response.json())
        .then(data => {
          this.zipcodes = data;
        })
        .catch(error => {
          console.error('Error fetching zipcodes:', error);
        });
    },
    async fetchAvailableSpots() {
      if (!this.startDate || !this.endDate) {
        alert("Please select both start and end dates.");
        return;
      }
      this.searchClicked = true;
      this.campingSpots = [];
      let urlavailablespots = `http://localhost:5022/api/Availability/GetAvailableSpots?startDate=${this.startDate}&endDate=${this.endDate}`;
      if (this.zipcode) {
        urlavailablespots += `&zipcode=${this.zipcode}`;
      }

      try {
        const response = await fetch(urlavailablespots);
        const data = await response.json();
        //console.log(data);
        this.campingSpots = data;
        await this.fetchAllDetails();
        console.log(this.fetchAllDetails());
        this.initActiveIndex();
        console.log(this.initActiveIndex());
        if (this.filteredCampingSpots.length === 0) {
          alert('No camping spots have the selected amenities or are not available for the selected dates. Please choose different amenities or dates.');
        }
      } catch (error) {
        console.error('Error fetching available camping spots:', error);
      }
    },
    fetchImages() {
      return fetch('http://localhost:5022/api/CampingImage/all')
        .then((response) => response.json())
        .then((data) => {
          const campingImagesMap = new Map();
          data.forEach(img => {
            if (!campingImagesMap.has(img.camping_id)) {
              campingImagesMap.set(img.camping_id, []);
            }
            campingImagesMap.get(img.camping_id).push({
              src: `data:image/jpeg;base64,${img.camping_Image}`
            });
          });
          this.campingImages = campingImagesMap;
        })
        .catch((error) => {
          console.error('Error fetching images:', error);
        });
    },
    fetchAmenities() {
      return fetch('http://localhost:5022/api/Amenities')
        .then(response => response.json())
        .then(data => {
          this.amenities = data;
        })
        .catch(error => {
          console.error('Error fetching amenities:', error);
        });
    },
    fetchAllDetails() {
      const promises = this.campingSpots.map(spot => {
        return Promise.all([
          fetch(`http://localhost:5022/api/CampingAmenities/campingid/${spot.camping_id}`)
            .then(response => response.json())
            .then(data => {
              this.campingAmenities.set(spot.camping_id, data);
            }),
          fetch(`http://localhost:5022/api/Location/GetById/${spot.location_id}`)
            .then(response => response.json())
            .then(data => {
              spot.address = `${data.address}, ${data.zip_Code}, ${data.country}`;
            })
        ]);
      });

      return Promise.all(promises).then(() => {
        return this.fetchImages();
      }).catch(error => {
        console.error('Error fetching camping spot details:', error);
      });
    },
    getImagesForCampingId(campingId) {
      return this.campingImages.get(campingId) || [{ src: require('@/assets/img/nocampingimg.jpg') }];
    },
    goToDetails(campingId) {
      const amenities = this.getAmenitiesForCampingId(campingId).map(amenityObj => amenityObj.amenity);
      this.$router.push({
        name: 'CampingSpotDetail',
        params: {
          id: campingId,
          amenities: JSON.stringify(amenities)
        },
        query: {
          startDate: this.startDate,
          endDate: this.endDate
        }
      });
    },
    initActiveIndex() {
      this.campingSpots.forEach(spot => {
        this.$set(this.activeIndex, spot.camping_id, 0);
      });
      this.startCarousel();
    },
    startCarousel() {
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval);
      }
      this.carouselInterval = setInterval(() => {
        this.campingSpots.forEach(spot => {
          const images = this.getImagesForCampingId(spot.camping_id);
          if (images.length > 1) {
            this.$set(this.activeIndex, spot.camping_id, (this.activeIndex[spot.camping_id] + 1) % images.length);
          }
        });
      }, 3000);
    },
    hasSelectedAmenities(campingId) {
      const spotAmenities = this.campingAmenities.get(campingId) || [];
      if (this.selectedAmenities.length === 0) {
        return true;
      }
      return this.selectedAmenities.every(amenity =>
        spotAmenities.some(spotAmenity => spotAmenity.amenity === amenity)
      );
    },
    getAmenitiesForCampingId(campingId) {
      return this.campingAmenities.get(campingId) || [];
    }
  },
  computed: {
    filteredCampingSpots() {
      return this.campingSpots.filter(spot => this.hasSelectedAmenities(spot.camping_id));
    }
  },
  mounted() {
    this.fetchZipcodes();
    this.fetchAmenities();
  },
  beforeDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }
};
</script>


<style scoped>
.camping-spots {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: url('@/assets/img/indeximg.png') no-repeat center center fixed;
  background-size: cover;
}

.camping-spot-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.camping-spot {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  background-color: rgba(255, 255, 255, 0.9);
}

.camping-spot h2 {
  margin: 0;
  font-size: 1.5em;
}

.camping-spot p {
  margin: 10px 0;
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

.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-inner {
  display: flex;
  flex-wrap: nowrap;
  height: 400px;
}

.carousel-item {
  flex: 0 0 100%;
  transition: opacity 0.5s;
  opacity: 0;
  position: absolute;
}

.carousel-item.active {
  opacity: 1;
  position: relative;
}

.carousel img {
  max-width: 100%;
  height: 100%;
  display: block;
  margin-top: 10px;
  object-fit: cover;
}

.selection-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 20px;
}

.selection-section label {
  font-weight: bold;
}

.selection-section input[type="date"],
.selection-section select,
.selection-section div {
  width: 100%;
}

.selection-section div {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.selection-section div input[type="checkbox"] {
  margin-right: 10px;
}
</style>
