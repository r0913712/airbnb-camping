<template>
  <div class="camping-spot-detail">
    <h1>{{ campingSpot.name }}</h1>
    <div v-if="images.length > 0" class="carousel">
      <div class="carousel-inner">
        <div v-for="(image, index) in images" :key="index" class="carousel-item" :class="{ active: index === activeIndex }">
          <img :src="image.src" :alt="'Image for camping ID ' + campingSpot.camping_id" />
        </div>
      </div>
    </div>
    <div class="details">
      <p>{{ campingSpot.description }}</p>
      <p>Price: ${{ campingSpot.price }}/day</p>
      <p>Address: {{ campingSpot.address }}</p>
      <div>
        <label for="start-date">Start Date:</label>
        <span>{{ startDate }}</span>
      </div>
      <div>
        <label for="end-date">End Date:</label>
        <span>{{ endDate }}</span>
      </div>
      <div>
        <p>Amenities:</p>
        <ul>
          <li v-for="(amenity, index) in amenities" :key="index">{{ amenity }}</li>
        </ul>
      </div>
      <button @click="bookCampingSpot">Book Now</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CampingSpotDetail",
  data() {
    return {
      campingSpot: {},
      startDate: this.$route.query.startDate,
      endDate: this.$route.query.endDate,
      images: [],
      activeIndex: 0,
      carouselInterval: null, // Store the interval ID
      amenities: JSON.parse(this.$route.params.amenities || '[]') // Parse amenities from route params
    };
  },
  mounted() {
    this.fetchCampingSpot();
  },
  beforeDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval); // Clear the interval when the component is destroyed
    }
  },
  methods: {
    fetchCampingSpot() {
      const id = this.$route.params.id;
      fetch(`http://localhost:5022/api/Camping/GetCampingbyID/${id}`)
        .then((response) => response.json())
        .then((data) => {
          this.campingSpot = data;
          return fetch(`http://localhost:5022/api/Location/GetById/${data.location_id}`);
        })
        .then((response) => response.json())
        .then((locationData) => {
          this.campingSpot.address = `${locationData.address}, ${locationData.zip_Code}, ${locationData.country}`;
          this.fetchImages();
        })
        .catch((error) => {
          console.error("Error fetching camping spot details:", error);
          alert("An error occurred while fetching the camping spot details. Please try again later.");
        });
    },
    fetchImages() {
      const id = this.$route.params.id;
      fetch(`http://localhost:5022/api/CampingImage/${id}`)
        .then(response => response.json())
        .then(data => {
          this.images = data.map(img => ({ src: `data:image/jpeg;base64,${img.camping_Image}` }));
          this.startCarousel();
        })
        .catch(error => {
          console.error('Error fetching images:', error);
        });
    },
    bookCampingSpot() {
      const days = (new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24) + 1;
      const totalPrice = this.campingSpot.price * days;
      const user = JSON.parse(localStorage.getItem('currentUser'));

      const booking_Data = new FormData();
      booking_Data.append('User_ID', user.user_id);
      booking_Data.append('Camping_ID', this.campingSpot.camping_id);
      booking_Data.append('Date_Start', this.startDate);
      booking_Data.append('Date_End', this.endDate);
      booking_Data.append('Price', totalPrice);

      const availability_data = new FormData();
      availability_data.append('Camping_ID', this.campingSpot.camping_id);
      availability_data.append('Date_Start', this.startDate);
      availability_data.append('Date_End', this.endDate);

      fetch('http://localhost:5022/api/Bookings/register', {
        method: 'POST',
        body: booking_Data
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Booking registration failed');
        }
        return fetch('http://localhost:5022/api/Availability/register', {
          method: 'POST',
          body: availability_data
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Availability update failed');
        }
        alert('Booking successful!');
        this.$router.push('/home');
      })
      .catch(error => {
        console.error('Error during booking process:', error);
        alert(error.message);
      });
    },
    startCarousel() {
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval); // Clear the previous interval
      }
      this.carouselInterval = setInterval(() => {
        if (this.images.length > 1) {
          this.activeIndex = (this.activeIndex + 1) % this.images.length;
        }
      }, 3000);
    }
  }
};
</script>

<style scoped>
.camping-spot-detail {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: url('@/assets/img/indeximg.png') no-repeat center center fixed;
  background-size: cover;
  color: #333;
}

.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 20px;
}

.carousel-inner {
  display: flex;
  flex-wrap: nowrap;
  height: 400px; /* Fixed height for the carousel */
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
  height: 100%; /* Set the height to 100% of the carousel-inner */
  object-fit: cover; /* Ensure the image covers the entire area */
  display: block;
}

.details {
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.details p {
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
</style>

<style scoped>
.camping-spot-detail {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: url('@/assets/img/indeximg.png') no-repeat center center fixed;
  background-size: cover;
  color: #333;
}

.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 20px;
}

.carousel-inner {
  display: flex;
  flex-wrap: nowrap;
  height: 400px; /* Fixed height for the carousel */
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
  height: 100%; /* Set the height to 100% of the carousel-inner */
  object-fit: cover; /* Ensure the image covers the entire area */
  display: block;
}

.details {
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.details p {
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
</style>
