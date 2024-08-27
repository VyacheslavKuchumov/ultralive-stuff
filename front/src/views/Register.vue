<template>
    <div class="home">
        <form @submit.prevent="go_register()">
            <input type="email" class="form-input" placeholder="Введите email" v-model="email">
            <input type="password" class="form-input" placeholder="Введите пароль" v-model="password">
            <input type="text" class="form-input" placeholder="Введите имя" v-model="name">
            <button type="submit" class="form-btn">Регистрация</button>
            <span>Уже есть аккаунт? <a href="/login">Войти</a></span>
        </form>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    name: 'register',
    data() {
        return {
            email: '',
            password: '',
            name: ''
        }
    },
    methods: {
        ...mapActions({
            register: 'auth/register'
        }),
        go_register() {
            const formData = {
                email: this.email,
                password: this.password,
                name: this.name
            }
            this.register(formData)
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