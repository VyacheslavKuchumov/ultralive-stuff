<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title @click=" this.$router.push('/')">UltraliveDatabase</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- <v-btn v-if="isAuth" text to="/">Главная</v-btn>
      <v-btn v-if="isAuth" text to="/drafts">Шаблоны</v-btn>

      <v-btn v-if="isAuth" text to="/equipment_sets"
        >Комплекты оборудования</v-btn
      >

      <v-btn v-if="isAuth" text to="/projects">Съёмки</v-btn>
      <v-btn v-if="isAuth" @click="logout()">Выйти</v-btn> -->
      <v-app-bar-nav-icon v-if="isAuth" @click="drawer = !drawer" />
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      app
      temporary
    >
      <v-list>
          <v-list-item  to="/">
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item>
          <v-list-item  to="/projects">
            <v-list-item-title>Съёмки</v-list-item-title>
          </v-list-item>
          <v-list-item  to="/drafts">
            <v-list-item-title>Шаблоны</v-list-item-title>
          </v-list-item>
          <v-list-item  to="/equipment_sets">
            <v-list-item-title>Комплекты оборудования</v-list-item-title>
          </v-list-item>
          <v-list-item  to="/set_types">
            <v-list-item-title>Виды комплектов</v-list-item-title>
          </v-list-item>
          <v-list-item  to="/warehouses">
            <v-list-item-title>Склады</v-list-item-title>
          </v-list-item>
          <v-list-item  to="/project_types">
            <v-list-item-title>Площадки</v-list-item-title>
          </v-list-item>
          
          <v-list-item v-if="isAuth" @click="logout()">
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { useRouter, useRoute } from "vue-router";
export default {
  data() {
    return {
      username: null,
      drawer: false,
    };
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
    }),
  },
  mounted() {
    const uid = localStorage.getItem("uid");
    uid
      ? this.$store.commit("auth/setAuth", true)
      : this.$store.commit("auth/setAuth", false);
  },

  computed: {
    ...mapState({
      isAuth: (state) => state.auth.isAuth,
    }),
  },
};
</script>

<style></style>
