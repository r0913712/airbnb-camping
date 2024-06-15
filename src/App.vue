<template>
  <div id="app">
    <HeaderPage />
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderPage from './components/HeaderPage.vue';
//import Header from './components/HeaderPage.vue';
export default {
  name: 'App',
  components:{
    HeaderPage
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Roboto', sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* background: url('assets\img\indeximg.png'); */
  overflow: auto;
  /*display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5; */
}
</style>
