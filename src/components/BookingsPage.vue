<template>
  <div class="my-bookings">
    <h1>My Bookings</h1>
    <div v-if="!bookings.length">
      <p>You have no bookings.</p>
    </div>
    <div v-else>
      <div class="ongoing-bookings">
        <h2>Ongoing Bookings</h2>
        <div v-if="ongoingBookings.length === 0">
          <p>No ongoing bookings.</p>
        </div>
        <div v-else class="bookings-list">
          <div v-for="booking in ongoingBookings" :key="booking.booking_id" class="booking-card">
            <div class="carousel">
              <div class="carousel-inner">
                <div v-for="(image, index) in booking.images" :key="index" class="carousel-item" :class="{ active: index === activeIndex }">
                  <img :src="image.src" :alt="'Image for camping ID ' + booking.campingSpot.camping_id" />
                </div>
              </div>
            </div>

            <div class="booking-details">
              <h3>{{ booking.campingSpot.name }}</h3>
              <p>Description: {{ booking.campingSpot.description || 'No description available.' }}</p>
              <p>Booked by User: {{ booking.user_id }}</p>
              <p>Date Start: {{ formatDate(booking.date_Start) }}</p>
              <p>Date End: {{ formatDate(booking.date_End) }}</p>
              <p>Price: ${{ booking.price }}</p>
              <p>Address: {{ booking.campingSpot.address }}</p>
              <p>Amenities:</p>
              <ul>
                <li v-for="(amenity, index) in booking.campingSpot.amenities" :key="index">{{ amenity }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="upcoming-bookings">
        <h2>My Upcoming Bookings</h2>
        <div v-if="upcomingBookings.length === 0">
          <p>No upcoming bookings.</p>
        </div>
        <div v-else class="bookings-list">
          <div v-for="booking in upcomingBookings" :key="booking.id" class="booking-card">
            <div class="carousel">
              <div class="carousel-inner">
                <div v-for="(image, index) in booking.images" :key="index" class="carousel-item" :class="{ active: index === activeIndex }">
                  <img :src="image.src" :alt="'Image for camping ID ' + booking.campingSpot.camping_id" />
                </div>
              </div>
            </div>

            <div class="booking-details">
              <h3>{{ booking.campingSpot.name }}</h3>
              <p>Date Start: {{ formatDate(booking.date_Start) }}</p>
              <p>Date End: {{ formatDate(booking.date_End) }}</p>
              <p>Price: ${{ booking.price }}</p>
              <p>Address: {{ booking.campingSpot.address }}</p>
              <p>Amenities:</p>
              <ul>
                <li v-for="(amenity, index) in booking.campingSpot.amenities" :key="index">{{ amenity }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="past-bookings">
        <h2>My Past Bookings</h2>
        <div v-if="pastBookings.length === 0">
          <p>No past bookings.</p>
        </div>
        <div v-else class="bookings-list">
          <div v-for="booking in pastBookings" :key="booking.id" class="booking-card">
            <div class="carousel">
              <div class="carousel-inner">
                <div v-for="(image, index) in booking.images" :key="index" class="carousel-item" :class="{ active: index === activeIndex }">
                  <img :src="image.src" :alt="'Image for camping ID ' + booking.campingSpot.camping_id" />
                </div>
              </div>
            </div>

            <div class="booking-details">
              <h3>{{ booking.campingSpot.name }}</h3>
              <p>Date Start: {{ formatDate(booking.date_Start) }}</p>
              <p>Date End: {{ formatDate(booking.date_End) }}</p>
              <p>Price: ${{ booking.price }}</p>
              <p>Address: {{ booking.campingSpot.address }}</p>
              <p>Amenities:</p>
              <ul>
                <li v-for="(amenity, index) in booking.campingSpot.amenities" :key="index">{{ amenity }}</li>
              </ul>
              <review-section :bookingId="booking.id"></review-section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'BookingsPage',
  data() {
    return {
      bookings: [],
      images: [],
      activeIndex: 0
    };
  },
  computed: {
    ongoingBookings() {
      const today = new Date();
      return this.bookings
        .filter(booking => new Date(booking.date_Start) <= today && new Date(booking.date_End) >= today)
        .sort((a, b) => new Date(a.date_Start) - new Date(b.date_Start));
    },
    upcomingBookings() {
      const today = new Date();
      return this.bookings
        .filter(booking => new Date(booking.date_Start) >= today)
        .sort((a, b) => new Date(a.date_Start) - new Date(b.date_Start));
    },
    pastBookings() {
      const today = new Date();
      return this.bookings
        .filter(booking => new Date(booking.date_Start) < today)
        .sort((a, b) => new Date(b.date_Start) - new Date(a.date_Start));
    }
  },
  mounted() {
    this.fetchBookings();
    this.startCarousel();
  },
  methods: {
    fetchBookings() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user) {
        alert("User not logged in.");
        return;
      }

      fetch(`http://localhost:5022/api/Bookings/${user.user_id}`)
        .then(response => response.json())
        .then(bookings => {
          const bookingPromises = bookings.map(booking => {
            return fetch(`http://localhost:5022/api/Camping/GetCampingbyID/${booking.camping_id}`)
              .then(response => response.json())
              .then(campingSpot => {
                booking.campingSpot = campingSpot;
                return this.fetchLocation(campingSpot.location_id)
                  .then(locationData => {
                    booking.campingSpot.address = locationData.address + ", " + locationData.zip_Code + ", " + locationData.country;
                    return this.fetchAmenities(booking.camping_id)
                      .then(amenities => {
                        booking.campingSpot.amenities = amenities;
                        return this.fetchImages(booking.camping_id)
                          .then(images => {
                            booking.images = images;
                            return booking;
                          });
                      });
                  });
              });
          });

          return Promise.all(bookingPromises);
        })
        .then(bookingsWithDetails => {
          this.bookings = bookingsWithDetails;
        })
        .catch(error => {
          console.error('Error fetching bookings:', error);
        });
    },
    fetchImages(campingId) {
      return fetch(`http://localhost:5022/api/CampingImage/${campingId}`)
        .then(response => response.json())
        .then(data => {
          const images = data.map(img => ({ src: `data:image/jpeg;base64,${img.camping_Image}` }));
          this.images = images;
          return images;
        })
        .catch(error => {
          console.error('Error fetching images:', error);
          return [];
        });
    },
    fetchAmenities(campingId) {
      return fetch(`http://localhost:5022/api/CampingAmenities/campingid/${campingId}`)
        .then(response => response.json())
        .then(data => {
          return data.map(amenity => amenity.amenity);
        })
        .catch(error => {
          console.error('Error fetching amenities:', error);
          return [];
        });
    },
    fetchLocation(locationId) {
      return fetch(`http://localhost:5022/api/Location/GetById/${locationId}`)
        .then(response => response.json())
        .then(locationData => {
          return locationData;
        })
        .catch(error => {
          console.error('Error fetching location:', error);
          return {};
        });
    },
    startCarousel() {
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval);
      }
      this.carouselInterval = setInterval(() => {
        if (this.images.length > 1) {
          this.activeIndex = (this.activeIndex + 1) % this.images.length;
        }
      }, 3000);
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    }
  }
};
</script>

<style scoped>
.my-bookings {
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

h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #666;
}

.bookings-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.booking-card {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.carousel {
  width: 150px;
  height: 150px;
  overflow: hidden;
  margin-right: 20px;
}

.carousel-inner {
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
  position: relative;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.booking-details {
  text-align: left;
}

.booking-details h3 {
  margin: 0;
  font-size: 1.5em;
  color: #007bff;
}

.booking-details p {
  margin: 10px 0;
  font-size: 1em;
  color: #555;
}

.booking-details ul {
  padding-left: 20px;
  text-align: left;
}

.booking-details li {
  margin-bottom: 5px;
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
