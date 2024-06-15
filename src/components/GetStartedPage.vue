<template>
  <div class="get-started-page">
    <h1>Get Started with Sophago</h1>
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="firstname">First Name</label>
        <input type="text" id="firstname" v-model="firstName" required>
      </div>
      <div class="form-group">
        <label for="lastname">Last Name</label>
        <input type="text" id="lastname" v-model="lastName" required>
      </div>
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" v-model="phoneNumber" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="isOwner">Are you a camping spot owner?</label>
        <input type="checkbox" id="isOwner" v-model="isOwner">
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
//import axios from 'axios';
import bcrypt from 'bcryptjs';

export default {
  name: "GetStartedPage",
  data() {
    return {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      isOwner: false,
      defaultImageBlob: null
    };
  },
  // mounted(){
  //   fetch(require('@/assets/img/pfp/default.jpg'))
  //     .then(response => response.blob())
  //     .then(blob => {
  //       this.defaultImageBlob = blob;
  //     })
  //     .catch(error => {
  //       console.error('Error fetching default image:', error);
  //     });
  // },
  methods:{
    registerUser() {
      if (this.password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }

      // Hash the password
      bcrypt.hash(this.password, 10)
        .then((hashedPassword) => {
          const formData = new FormData();
          formData.append('F_Name', this.firstName);
          formData.append('L_Name', this.lastName);
          formData.append('Phone_Number', this.phoneNumber);
          formData.append('Email', this.email);
          formData.append('Password', hashedPassword);
          formData.append('Is_Owner', this.isOwner);
          //formData.append('Image', this.defaultImageBlob);


          fetch('http://localhost:5022/api/Users/newuser', {
            method: 'POST',
            body: formData
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(user => {
            // Store user details in local storage or handle response as needed
            localStorage.setItem('currentUser', JSON.stringify(user));
            //console.log(localStorage('currentUser'));
            //console.log('grape success')
            // Redirect to homepage or handle response as needed
            
            this.$router.push('/home');
          })
          .catch(error => {
            console.error('Error registering user:', error);
            alert('An error occurred during registration. Please try again.');
          });
        });
    }
  }
}
</script>

<style scoped>
.get-started-page {
  font-family: 'Roboto', sans-serif;
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>