<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/equipment">Оборудование</router-link>
    <router-link to="/shooting">Съёмка</router-link>
    <!-- <router-link v-if="isAuth" to="/card">My card</router-link>  -->
    <!-- <router-link to="/about">About</router-link>  -->
    <!-- <router-link  to="/search">Look up someone else's card</router-link>  -->
    <!-- <router-link v-if="!isAuth" to="/register">Register</router-link>  -->
    <!-- <router-link v-if="!isAuth" to="/login">Login</router-link>
    <a v-if="isAuth" @click="logout()">Logout</a> -->
  </nav>
  <router-view/>
</template>

<script>
import {mapActions, mapState} from 'vuex';
export default{

  methods:{
    ...mapActions({
      logout:'auth/logout'
    })
  },
  mounted() {
    const uid = localStorage .getItem('uid')
    uid ? this.$store.commit('auth/setAuth', true) : this.$store.commit('auth/setAuth', false)
  },
  computed:{
    ...mapState({
      isAuth: state => state.auth.isAuth
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  display: flex;
  flex-direction: row;
  column-gap: 20px;
  margin: auto;
  justify-content: center;
  width:20vw;
  margin-top: 50px;
  margin-bottom: 50px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
