<template>
    <div class="main">
      <div class="avatar-section">
        <img :src="avatarUrl" alt="Avatar" class="avatar-pic" v-if="avatarUrl">
        <div v-else class="avatar-placeholder">No avatar</div>
        <input type="file" @change="uploadAvatar" class="avatar-upload">
        <button @click="changeAvatar">Change Avatar</button>
      </div>
  
      <div class="name">@{{ user.name }}</div>
  
      <div class="bio-section">
        <div class="bio" v-if="bio">{{ bio }}</div>
        <div v-else>No bio available</div>
        <button @click="editBio">Edit Bio</button>
      </div>
  
      <div class="links-section">
        <div class="links" v-if="(links && links.length)">
          <div class="link-item" v-for="(link, index) in links" :key="index">
            <div class="link-box">{{ link }}</div>
            <button @click="deleteLink(index)" class="delete-link-btn">Delete</button>
          </div>
        </div>
        <div v-else>No social media links</div>
        <button @click="addLink">Add Link</button>
      </div>
  
      <button @click="saveChanges" class="save-changes-btn">Save Changes</button>
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
        avatarFile: null
      };
    },
    computed: {
      ...mapState('stuff', ['data']),
      user() {
        return this.$store.state.user.user;
      }
    },
    methods: {
      ...mapActions('stuff', ['getUserStuff', 'postUserStuff']),
      uploadAvatar(event) {
        const file = event.target.files[0];
        this.avatarFile = file;
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.avatarUrl = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      changeAvatar() {
        document.querySelector('.avatar-upload').click();
      },
      editBio() {
        const newBio = prompt('Enter new bio:', this.bio);
        if (newBio !== null) {
          this.bio = newBio;
        }
      },
      addLink() {
        const newLink = prompt('Enter social media link:');
        if (newLink) {
          this.links.push(newLink);
        }
      },
      deleteLink(index) {
        this.links.splice(index, 1);
      },
      async saveChanges() {
        await this.postUserStuff({
          bio: this.bio,
          links: this.links,
          avatar: null
        });
      }
    },
    async beforeMount() {
      await this.getUserStuff();
      if (this.data) {
        this.avatarUrl = this.data.avatar_pic || '';
        this.bio = this.data.bio || '';
        this.links = this.data.links || [];
      }
    }
  };
  </script>
  
  <style>
  
  .main{
    width: 30%;
    border: 1px solid #ccc;
    padding: 5px 10px;
    padding-top: 40px;
    padding-bottom: 40px;
    border-radius: 5px;
    background-color: #f9f9f9;
    margin: auto;
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
  
  .avatar-upload {
    display: none;
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
  
  .delete-link-btn {
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .delete-link-btn:hover {
    background-color: #ff1a1a;
  }
  
  .save-changes-btn {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .save-changes-btn:hover {
    background-color: #218838;
  }
  </style>
  