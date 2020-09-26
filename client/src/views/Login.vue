<template>
  <div class="login">
    <h1>Login</h1>
    <v-alert dismissible dense outlined type="error" v-if="alertShow">{{this.alertMessage}}</v-alert>
    <form @submit.prevent="login">
      <v-text-field label="E-mail" color="black" v-model="email"></v-text-field>
      <v-text-field
        color="black"
        label="Senha"
        type="password"
        hint="Senha deve conter pelo menos 6 caracteres"
        v-model="password"
      ></v-text-field>
      <v-btn type="submit" dark><v-icon class="mr-1">mdi-login</v-icon>  Entrar</v-btn>
    </form>
    
    <v-progress-circular class="circle" v-if="circle"
      indeterminate
    ></v-progress-circular>
    <router-link class="router-link" to="/register">Ainda não tenho uma conta.</router-link>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      alertMessage: "",
      alertShow: false,
      circle: false
    };
  },
  methods: {
    async login() {
        this.circle = true;
      let user = {
        email: this.email,
        password: this.password,
      };
      await axios({
        url: "http://localhost:3000/login",
        data: user,
        method: "POST",
      })
        .then((res) => {
          console.log(res.data);
          this.$store.dispatch("login", res.data);
          this.$router.push("/");
        })
        .catch((err) => {
          this.$store.commit("logout");
          this.alertMessage = err.response.data;
          this.alertShow = true;
          setTimeout(() => {
            this.alertShow = false;
          }, 7000);
          this.circle = false
        });
    },
  },
};
</script>

<style>
.login {
  text-align: center;
  width: 50%;
  min-width: 370px;
  margin: 2rem auto;
  /* border: .1px solid gray; */
  display: flex;
  flex-direction: column;
}

.login .circle{
  margin: auto;
}

.login .v-text-field label {
  font-size: 1.5rem;
}

.login .v-text-field input {
  height: 2rem;
}

.login h1 {
  font-size: 3rem;
  /* background-color: #FF4433; */
}

.v-progress-circular{
    margin: 1rem auto;
}

.login form{
  padding: 2rem 2rem;
}

.v-alert{
  margin: 2rem  2rem;
}

.router-link{
  text-decoration: none;
  padding: 1rem 0;
}
</style>