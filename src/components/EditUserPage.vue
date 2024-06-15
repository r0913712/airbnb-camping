<template>
    <div class="user-info-change">
      <h1>Change User Information</h1>
      <form @submit.prevent="submitForm">
        <div>
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" v-model="firstName" />
        </div>
        <div>
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" v-model="lastName" />
        </div>
        <div>
          <label for="phoneNumber">Phone Number:</label>
          <input type="text" id="phoneNumber" v-model="phoneNumber" />
        </div>
        <div>
          <label for="newPassword">New Password:</label>
          <input type="password" id="newPassword" v-model="newPassword" />
        </div>
        <div>
          <label for="profilePicture">Profile Picture:</label>
          <input type="file" id="profilePicture" accept="image/*" @change="handleFileUpload" />
          <img v-if="previewImage" :src="previewImage" alt="Profile Picture Preview" />
          <img v-else :src="defaultImage" alt="Default Profile Picture" />
        </div>
        <button type="submit">Save Changes</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import bcrypt from 'bcryptjs';
  export default {
    data() {
      return {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        newPassword: '',
        profilePicture: null,
        previewImage: null,
        errorMessage: '',
        defaultImage: '../assets/img/pfp/default-frontend.jpg' // Set the default image path
      };
    },
    created() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        this.firstName = user.f_Name;
        this.lastName = user.l_Name;
        this.phoneNumber = user.phone_Number;
        // Assuming the backend sends the image as a base64 string
        //console.log(this.previewImage);
        this.previewImage = user.image ? `data:image/jpeg;base64,${user.image}` : null;
        //console.log(this.previewImage);
      } else {
        this.$router.push('/login');
      }
    },
    methods: {
      printFormData(formData) {
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    },
      submitForm() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const formData = new FormData();
        formData.append('User_ID', user.user_id);
        formData.append('F_Name', this.firstName);
        formData.append('L_Name', this.lastName);
        formData.append('Phone_Number', this.phoneNumber);
  
        if (this.newPassword === '') {
          this.newPassword = user.password;
        } else {
          this.newPassword = bcrypt.hashSync(this.newPassword, 10);
        }
        formData.append('Password', this.newPassword);
        if (this.profilePicture) {
          formData.append('Image', this.profilePicture);
        } else if (user.image) {
          // Append existing image if no new image is selected
          formData.append('Image', this.dataURLtoBlob(this.previewImage));
        }
        this.printFormData(formData);
  
        fetch('http://localhost:5022/api/Users/updateuser', {
          method: 'PUT',
          body: formData,
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(updatedUser => {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.$router.push('/home');
          })
          .catch(error => {
            console.error('Error updating user:', error);
            alert('An error occurred while updating user information. Please try again.');
          });
      },
      handleFileUpload(event) {
        this.profilePicture = event.target.files[0];
        if (!this.profilePicture) {
          // If no image is selected, use the current profile picture
          this.previewImage = this.previewImage || this.defaultImage;
        } else {
          // If an image is selected, show the preview
          this.previewImage = URL.createObjectURL(this.profilePicture);
        }
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
      }
    }
  };
  </script>
  
  <style scoped>
  .user-info-change {
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
  
  form > div {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="password"],
  input[type="file"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
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
  
  button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
  }
  
  button:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  img {
    margin-top: 10px;
    max-width: 150px;
    border-radius: 50%;
  }
  
  .error-message {
    color: red;
    margin-top: 15px;
  }
  </style>
  