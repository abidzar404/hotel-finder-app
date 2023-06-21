import { defineStore } from 'pinia'
import axios from 'axios'

const baseUrl = 'https://challenge1-production-23af.up.railway.app'

export const useCustomerStore = defineStore({
  id: 'counter',
  state: () => ({
    isLogin: false,
    loginData: {
      email: '',
      password: ''
    },
    registerData: {
      username: '',
      email: '',
      password: '',
      phoneNumber: ''
    }
  }),
  getters: {},
  actions: {
    signOut: function () {
      localStorage.removeItem('access_token')
      this.isLogin = false
    },
    login: function () {
      return axios.post(`${baseUrl}/login`, this.loginData)
    },
    registration: function () {
      return axios.post(`${baseUrl}/register`, this.registerData)
    }
  }
})
