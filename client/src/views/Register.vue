<template>
  <div class="register">
      <h1>Registrar</h1>
      <v-alert
      dismissible
      dense
      outlined
      type="error"
      v-if="alertShow"
    >
          {{this.alertMessage}}
    </v-alert>
      <form @submit.prevent="register">
          <v-text-field color="black" label="Nome" hint="Nome que aparecerá nos comentários" v-model="name" ></v-text-field>
          <v-text-field color="black" label="E-mail" v-model="email" ></v-text-field>
          <v-text-field color="black" label="Senha" type="password" hint="Senha deve conter pelo menos 6 caracteres" v-model="password" ></v-text-field>
          <v-text-field color="black" label="Confirmar senha" type="password" v-model="checkpassword" ></v-text-field>
          <v-btn type="submit" dark>Cadastrar</v-btn>
      </form>
      <router-link class="router-link" to="/login">Já sou cadastrado.</router-link>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Register',
    data(){
        return {
            name:'',
            email:'',
            password:'',
            checkpassword:'',
            alertMessage: '',
            alertShow: false
        }
    },
    methods: {
        register(){
            let user = {
                name : this.name,
                email : this.email,
                password : this.password,
                checkpassword : this.checkpassword
            }

            axios({url: 'http://localhost:3000/register', data: user, method: 'POST' }).then( () => {
                    this.$router.push('/login')
            }).catch( err => {
                this.alertMessage = err.response.data
                this.alertShow = true
                setTimeout( () => {
                    this.alertShow = false
                }, 7000)
            })
        }
    }
}
</script>

<style>
.register {
  text-align: center;
  width: 50%;
  min-width: 370px;
  margin: 2rem auto;
  /* border: .1px solid gray; */
  display: flex;
  flex-direction: column;
}

.register h1{
  /* background-color: #F44330; */
}

.register .v-text-field label {
  font-size: 1.5rem;
}

.register .v-text-field input {
  height: 2rem;
}

.register h1 {
  font-size: 3rem;
}

.register form{
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