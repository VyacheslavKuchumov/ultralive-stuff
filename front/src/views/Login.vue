<template>
    <div class="home">
        <form @submit.prevent="go_login">
            <my-input type="email" class="form-input" placeholder="Введите email" v-model:value="email"></my-input>
            <my-input type="password" class="form-input" placeholder="Введите пароль" v-model:value="password"></my-input>
            <my-button type="submit" class="form-btn">Войти</my-button>
            <span>Нет аккаунта? <a href="/register">Зарегистрироваться</a></span>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';


export default {
    name: 'login',
    data() {
        return {
            
            email: '',
            password: '',
            
            
        }
    },
    methods: {
        ...mapActions({
            login: 'auth/login'
        }),
        go_login() {
            console.log("email: " + this.email)
            console.log("password: " + this.password)
            const formData = {
                email: this.email,
                password: this.password
            }
            this.login(formData)
        }

    }
}
</script>

<style>
.home {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100svh;
    justify-content: center;
    align-items: center;
}

form {
    display: flex;
    padding: 20px;
    flex-direction: column;
    width: 400px;
    row-gap: 20px;
}
</style>