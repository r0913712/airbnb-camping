<template>
  <transition name="slide-up">
    <div class="landing-page">
      <div class="content">
        <h1>Camping spot? Sophago.</h1>
        <div class="buttons">
          <button @click="goToGetStarted">Get Started</button>
          <button @click="goToLogIn">Log In</button>
        </div>
      </div>
    </div>
  </transition>
</template>
  
  <script>
  export default {
    name: 'LandingPage',
    methods: {
      goToGetStarted() {
        this.$router.push('/get-started');
      },
      goToLogIn() {
        this.$router.push('/login');
      },
    },
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  
  .landing-page {
  font-family: 'Roboto', sans-serif;
  text-align: center;
  /* background: url('..\assets\img\indeximg.png') no-repeat center center fixed; */
  background-size: cover;
  height: 100vh; /* Full viewport height */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 20px;
  box-sizing: border-box; /* Ensure padding is included in element width/height */
  }
  
  .content h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
  }
  
  .buttons {
    display: flex;
    justify-content: space-around;
  }
  
  button {
    padding: 10px 20px;
    font-size: 1.2em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .slide-up-enter-active, .slide-up-leave-active {
    transition: all 1s;
  }
  
  .slide-up-enter, .slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
  </style>
  