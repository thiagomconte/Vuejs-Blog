import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {
      id: '',
      email: '',
      isAdmin: false,
      name: '',
    },
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
    },
    auth_success(state, payload) {
      state.status = 'success';
      state.token = payload.token;
      state.user = payload.user;
    },
    auth_failure(state) {
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.user = {id: '' ,email: '', isAdmin: false, name: ''};
    },
  },
  actions: {
    login({commit}, data) {
      commit('auth_request');

      var token = data.token;
      let payload = {
        token: token,
        user: data.user,
      };
      commit('auth_success', payload);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      axios.defaults.headers.common['Authorization'] = token;
    },
    logout({commit}) {
      commit('logout');
      localStorage.clear();
      delete axios.defaults.headers.common['Authorization'];
    },
  },
  modules: {},
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    isAdmin: (state) => state.user.isAdmin,
  },
});
