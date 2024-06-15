<template>
  <div class="create-camping-spot">
    <h1>Create a New Camping Spot</h1>
    <form @submit.prevent="createCampingSpot">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="name" id="name" required>
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="description" id="description"></textarea>
      </div>
      <div>
        <label for="price">Price per day:</label>
        <input type="number" v-model="price" step="0.01" id="price" required>
      </div>
      <div>
        <h3>Amenities:</h3>
        <div v-for="amenity in amenities" :key="amenity.amenities_id">
          <input type="checkbox" :value="amenity.amenities_id" v-model="selectedAmenities">
          <label>{{ amenity.amenity }}</label>
        </div>
      </div>
      <div>
        <label for="address">Address:</label>
        <input type="text" v-model="address" id="address" required>
      </div>
      <div>
        <label for="zip-code">Zip Code:</label>
        <input type="number" v-model="zipCode" id="zip-code" required>
      </div>
      <div>
        <label for="country">Country:</label>
        <select v-model="country" id="country" required>
          <option value="Belgium">Belgium</option>
        </select>
        <p class="note">We are only available in Belgium as of right now.</p>
      </div>
      <div>
        <label for="images">Images:</label>
        <input type="file" id="images" multiple @change="handleFileUpload" accept="image/*" required>
        <p v-if="imageFiles.length < 2" class="note">Please upload at least 2 images.</p>
      </div>
      <button type="submit" :disabled="imageFiles.length < 2 || imageFiles.length > 10">Create Camping Spot</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateCampingSpotPage',
  data() {
    return {
      name: '',
      description: '',
      price: '',
      amenities: [],
      selectedAmenities: [],
      address: '',
      zipCode: '',
      country: '',
      imageFiles: []
    };
  },
  created() {
    this.fetchAmenities();
  },
  methods: {
    fetchAmenities() {
      fetch('http://localhost:5022/api/Amenities')
        .then(response => response.json())
        .then(data => {
          this.amenities = data;
        })
        .catch(error => {
          console.error('Error fetching amenities:', error);
        });
    },
    handleFileUpload(event) {
      this.imageFiles = Array.from(event.target.files);
    },
    dataURLtoBlob(dataurl) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    // printFormData(formData) {
    //   for (let pair of formData.entries()) {
    //     console.log(`${pair[0]}: ${pair[1]}`);
    //   }
    // },
    async createCampingSpot() {
      const user = JSON.parse(localStorage.getItem('currentUser'));

      if (!user) {
        alert("User not logged in.");
        return;
      }

      try {
        // Register location
        const locData = new FormData();
        locData.append('Address', this.address);
        locData.append('ZipCode', this.zipCode);
        locData.append('Country', this.country);

        //console.log("Location FormData:");
        //this.printFormData(locData);

        const locResponse = await fetch('http://localhost:5022/api/Location/New Location', {
          method: 'POST',
          body: locData
        });
        const location = await locResponse.json();

        // Register camping spot
        const formData = new FormData();
        formData.append('User_ID', user.user_id);
        formData.append('Location_ID', location.locationId);
        formData.append('Name', this.name);
        formData.append('Description', this.description || "No description available");
        formData.append('Price', this.price);

        //console.log("Camping FormData:");
        //this.printFormData(formData);

        const campingResponse = await fetch('http://localhost:5022/api/Camping/New Camping', {
          method: 'POST',
          body: formData
        });
        const camping = await campingResponse.json();

        // Register amenities
        const amenityPromises = this.selectedAmenities.map(amenityId => {
          const amenityData = new FormData();
          amenityData.append('Camping_ID', camping.camping_ID);
          amenityData.append('Amenities_ID', amenityId);

          //console.log("Amenity FormData:");
          //this.printFormData(amenityData);

          return fetch('http://localhost:5022/api/CampingAmenities/register', {
            method: 'POST',
            body: amenityData
          });
        });

        await Promise.all(amenityPromises);

        // Register images
        const imagePromises = this.imageFiles.map(file => {
          const reader = new FileReader();
          return new Promise((resolve, reject) => {
            reader.onload = () => {
              const dataUrl = reader.result;
              const imageData = new FormData();
              imageData.append('Camping_ID', camping.camping_ID);
              imageData.append('Image', this.dataURLtoBlob(dataUrl));

              //console.log("Image FormData:");
              //this.printFormData(imageData);

              fetch('http://localhost:5022/api/CampingImage/register', {
                method: 'POST',
                body: imageData
              }).then(resolve).catch(reject);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        await Promise.all(imagePromises);

        alert('Camping spot created successfully!');
        this.$router.push('/home');
      } catch (error) {
        console.error('Error creating camping spot:', error);
        alert('Failed to create camping spot.');
      }
    }
  }
};
</script>

<style scoped>
.create-camping-spot {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

form > div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
textarea,
select {
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

.note {
  font-size: 0.9em;
  color: #777;
}
</style>
