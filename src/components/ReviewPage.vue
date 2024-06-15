<!-- <template>
    <div class="review-section">
      <div v-if="loading">
        Loading...
      </div>
      <div v-else>
        <div v-if="review">
          <h3>Your Review</h3>
          <p><strong>Rating:</strong> {{ review.Rate }}</p>
          <p><strong>Message:</strong> {{ review.Message }}</p>
        </div>
        <div v-else>
          <h3>Submit a Review</h3>
          <form @submit.prevent="submitReview">
            <label for="rate">Rating:</label>
            <input type="number" id="rate" v-model="rate" min="1" max="5" required />
  
            <label for="message">Message:</label>
            <textarea id="message" v-model="message"></textarea>
  
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      bookingId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        review: null,
        rate: null,
        message: '',
        loading: true
      };
    },
    mounted() {
      this.fetchReview();
    },
    methods: {
      async fetchReview() {
        try {
          const response = await fetch(`http://localhost:5022/api/reviews/booking/${this.bookingId}`);
          if (response.ok) {
            const data = await response.json();
            this.review = data;
          } else {
            this.review = null;
          }
        } catch (error) {
          console.error('Error fetching review:', error);
        } finally {
          this.loading = false;
        }
      },
      async submitReview() {
        try {
          const formData = new FormData();
          formData.append('Booking_ID', this.bookingId);
          formData.append('Rate', this.rate);
          formData.append('Message', this.message);
  
          const response = await fetch('http://localhost:5022/api/reviews/add', {
            method: 'POST',
            body: formData
          });
  
          if (response.ok) {
            alert('Review submitted successfully');
            this.fetchReview(); // Refresh the review section to display the new review
          } else {
            const error = await response.text();
            alert(`Error: ${error}`);
          }
        } catch (error) {
          console.error('Error submitting review:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .review-section {
    margin-top: 20px;
  }
  </style>
   -->