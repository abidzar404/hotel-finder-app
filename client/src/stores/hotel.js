import { defineStore } from 'pinia'
import axios from 'axios'

const baseUrl = 'https://challenge1-production-23af.up.railway.app'

export const useHotelStore = defineStore({
  id: 'counter',
  state: () => ({
    center: { lat: -6.223189, lng: 106.84785 },
    CE: {},
    NE: {},
    SW: {},
    mark: {
      position: {}
    },
    marks: []
  }),
  getters: {},
  actions: {
    booking: function (data) {
      return axios.post(`${baseUrl}/booking`, data, {
        headers: {
          access_token: localStorage.access_token
        }
      })
    }
  }
})
