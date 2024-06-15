<template>
  <div class="owner-bookings">
    <h1>My Camping Spot Bookings</h1>
    <div v-if="!bookings.length">
      <p>You have no bookings for your camping spots.</p>
    </div>
    <div v-else>
      <div class="ongoing-bookings">
        <h2>Ongoing Bookings</h2>
        <div v-if="ongoingBookings.length === 0">
          <p>No ongoing bookings.</p>
        </div>
        <div v-else>
          <div v-for="booking in ongoingBookings" :key="booking.booking_id" class="booking">
            <h3>Camping Spot: {{ booking.campingSpot.name }}</h3>
            <p>Description: {{ booking.campingSpot.description || 'No description available.' }}</p>
            <p>Address: {{ booking.campingSpot.address }}</p>
            <p>Booked by User: {{ booking.userEmail }}</p>
            <p>Date Start: {{ booking.date_Start }}</p>
            <p>Date End: {{ booking.date_End }}</p>
            <p>Price: ${{ booking.price }}</p>
          </div>
        </div>
      </div>
      <div class="upcoming-bookings">
        <h2>Upcoming Bookings</h2>
        <div v-if="upcomingBookings.length === 0">
          <p>No upcoming bookings.</p>
        </div>
        <div v-else>
          <div v-for="booking in upcomingBookings" :key="booking.booking_id" class="booking">
            <h3>Camping Spot: {{ booking.campingSpot.name }}</h3>
            <p>Description: {{ booking.campingSpot.description || 'No description available.' }}</p>
            <p>Address: {{ booking.campingSpot.address }}</p>
            <p>Booked by User: {{ booking.userEmail }}</p>
            <p>Date Start: {{ booking.date_Start }}</p>
            <p>Date End: {{ booking.date_End }}</p>
            <p>Price: ${{ booking.price }}</p>
          </div>
        </div>
      </div>
      <div class="past-bookings">
        <h2>Past Bookings</h2>
        <div v-if="pastBookings.length === 0">
          <p>No past bookings.</p>
        </div>
        <div v-else>
          <div v-for="booking in pastBookings" :key="booking.booking_id" class="booking">
            <h3>Camping Spot: {{ booking.campingSpot.name }}</h3>
            <p>Description: {{ booking.campingSpot.description || 'No description available.' }}</p>
            <p>Address: {{ booking.campingSpot.address }}</p>
            <p>Booked by User: {{ booking.userEmail }}</p>
            <p>Date Start: {{ booking.date_Start }}</p>
            <p>Date End: {{ booking.date_End }}</p>
            <p>Price: ${{ booking.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OwnerBookings',
  data() {
    return {
      bookings: [],
    };
  },
  computed: {
    upcomingBookings() {
      const today = new Date();
      return this.bookings
        .filter(booking => new Date(booking.date_Start) >= today)
        .sort((a, b) => new Date(a.date_start) - new Date(b.date_Start));
    },
    ongoingBookings() {
      const today = new Date();
      return this.bookings
        .filter(booking => new Date(booking.date_Start) <= today && new Date(booking.date_End) >= today)
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
  },
  methods: {
    fetchBookings() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user) {
        alert("User not logged in.");
        return;
      }

      fetch(`http://localhost:5022/api/Bookings/GetBookingsByOwner/${user.user_id}`)
        .then(response => response.json())
        .then(bookings => {
          const bookingPromises = bookings.map(booking => {
            return fetch(`http://localhost:5022/api/Camping/GetCampingbyID/${booking.camping_id}`)
              .then(response => response.json())
              .then(campingSpot => {
                booking.campingSpot = campingSpot;
                return fetch(`http://localhost:5022/api/Users/${booking.user_id}`)
                  .then(response => response.json())
                  .then(userData => {
                    booking.userEmail = userData.email;
                    return fetch(`http://localhost:5022/api/Location/GetById/${campingSpot.location_id}`)
                      .then(response => response.json())
                      .then(locationData => {
                        booking.campingSpot.address = locationData.address + ", " + locationData.zip_Code + ", " + locationData.country;
                        //console.log(booking.campingSpot);
                        //console.log(campingSpot.location_id);
                        return booking;
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
    }
  }
};
</script>

<style scoped>
.owner-bookings {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.booking {
  border: 1px solid #ccc;
  background: linear-gradient(to bottom, #fff, #f0f0f0);
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 30px;
}
</style>
