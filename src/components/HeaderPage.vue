<template>
  <header class="header" v-if="showHomeButton">
    <button @click="goHome">Home</button>
  </header>
</template>

<script>
export default {
  computed: {
    showHomeButton() {
      return this.$route.meta.showHomeButton !== false;
    }
  },
  methods: {
    goHome() {
      this.$router.push('/home');
    }
  }
};
</script>
  
  <style scoped>
  .header {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
  border-bottom: 1px solid #ccc;
}
  
  button {
    padding: 10px 20px;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    transition: all 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  