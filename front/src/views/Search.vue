<template>
    <div class="main">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" placeholder="Search by name" @keyup.enter="searchUser">
        <button @click="searchUser">Search</button>
      </div>
  
      <div v-if="userFound" class="user-card">
        <div class="avatar-section">
          <img :src="avatarUrl" alt="Avatar" class="avatar-pic" v-if="avatarUrl">
          <div v-else class="avatar-placeholder">No avatar</div>
        </div>
  
        <div class="name">@{{ name }}</div>
  
        <div class="bio-section">
          <div class="bio" v-if="bio">{{ bio }}</div>
          <div v-else>No bio available</div>
        </div>
  
        <div class="links-section">
          <div class="links" v-if="(links && links.length)">
            <div class="link-item" v-for="(link, index) in links" :key="index">
              <div class="link-box">{{ link }}</div>
            </div>
          </div>
          <div v-else>No social media links</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapActions, mapState } from 'vuex';
  
  export default {
    name: 'about-view',
    data() {
      return {
        avatarUrl: '',
        bio: '',
        links: [],
        searchQuery: '',
        userFound: false,
        name: ''
      };
    },
    computed: {
      ...mapState('stuff', ['data']),
      
    },
    methods: {
      ...mapActions('stuff', ['searchUserByName', 'getUserStuffByID']),
      async searchUser() {
        if (this.searchQuery.trim() !== '') {
            this.name = this.searchQuery
          await this.searchUserByName({ name: this.searchQuery });
          if (this.data) {
            await this.getUserStuffByID({id: this.data.id})
            if (this.data){
                this.avatarUrl = this.data.avatar_pic || '';
                this.bio = this.data.bio || '';
                this.links = this.data.links || [];
                this.userFound = true;
            }
            
          } else {
            this.userFound = false;
          }
        }
      }
    }
  };
  </script>
  
  <style>
  .main {
    width: 30%;
    border: 1px solid #ccc;
    padding: 5px 10px;
    padding-top: 40px;
    padding-bottom: 40px;
    border-radius: 5px;
    background-color: #f9f9f9;
    margin: auto;
  }
  
  .search-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .search-bar input {
    width: 70%;
    padding: 5px;
    font-size: 16px;
  }
  
  .search-bar button {
    padding: 5px 10px;
    font-size: 16px;
  }
  
  .user-card {
    margin-top: 20px;
  }
  
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .avatar-pic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
  }
  
  .avatar-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .name {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
  }
  
  .bio-section, .links-section {
    margin-top: 20px;
  }
  
  .bio {
    text-align: center;
    margin-bottom: 10px;
  }
  
  .links {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .link-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .link-box {
    border: 1px solid #ccc;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
    margin-right: 10px;
  }
  </style>
  