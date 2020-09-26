<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app v-if="isLoggedIn">
      <v-list dense>
        <v-list-item>
          <v-list-item-title>{{getEmail}}</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/" v-if="isLoggedIn">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/createpost" v-if="isAdmin">
          <v-list-item-action>
            <v-icon>mdi-tooltip-edit</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Escrever</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin" v-if="isAdmin">
          <v-list-item-action>
            <v-icon>mdi-account-key</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/profile" v-if="isLoggedIn">
          <v-list-item-action>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Conta</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout" v-if="isLoggedIn">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="red">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="isLoggedIn"></v-app-bar-nav-icon>
      <v-toolbar-title><a class="router-link-home" href="/">Blog</a></v-toolbar-title>
      <v-btn class="ml-auto" to="/login" text v-if="!isLoggedIn">
        <span>Login</span>
      </v-btn>
      <v-btn to="/register" text v-if="!isLoggedIn">
        <span>Register</span>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import store from './store/index';
import router from './router/index';
export default {
  name: "App",

  components: {},

  data: () => ({
    drawer: false,
  }),
  methods: {
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    isAdmin(){
      return this.$store.getters.isAdmin;
    },
    getEmail(){
      return this.$store.state.user.email;
    }
  },
  mounted() {
    if(localStorage.getItem('token')){
      axios
      .get("http://localhost:3000/auth/token", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status !== 201) {
          this.$store.dispatch("logout");
          this.$router.push("/login");
        }
      })
      .catch(() => {
        this.$store.dispatch("logout");
        this.$router.push("/login");
      });
    }
  },
};

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (403 === error.response.status) {
       alert('Token expirado')
       localStorage.clear()
       store.commit('logout');
       router.push('/login')
    } else {
        return Promise.reject(error);
    }
});

</script>

<style scoped>
  .router-link-home{
    text-decoration: none;
    font-size:2rem;
    color: black;
  }
  .v-list-item{
    margin: 1rem 0;
  }
</style>