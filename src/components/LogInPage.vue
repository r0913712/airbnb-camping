<template>
  <div class="login-page">
    <h1>Log In to Sophago</h1>
    <form @submit.prevent="logIn">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email_input" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password_input" required>
      </div>
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';

export default {
  name: "LoginPage",
  data() {
    return {
      email_input: '',
      password_input: '',
    };
  },
  methods: {
    async logIn() {
      try {
        const response = await fetch(`http://localhost:5022/api/Users/email/${this.email_input}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const user = await response.json();
        //console.log(user);
        //console.log(this.password_input);
        //console.log(bcrypt.compare(this.password_input, user.password));
        if (user && await bcrypt.compare(this.password_input, user.password)) {
          //console.log(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
          //console.log(user);
          localStorage.setItem('userToken', user.token);
          this.$router.push('/home').catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              throw err;
            }
          });
        } else {
          alert('Login failed: Invalid email or password.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.login-page {
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
