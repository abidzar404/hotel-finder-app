<script>
import { defineComponent } from 'vue'
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map'
import { useHotelStore } from '../stores/hotel.js'
import { mapActions, mapWritableState } from 'pinia'
import axios from 'axios'
import HotelCard from '../components/HotelCard.vue'

const baseUrl = 'https://challenge1-production-23af.up.railway.app'

export default defineComponent({
  data() {
    return {
      center: { lat: -6.223189, lng: 106.84785 },
      CE: {},
      NE: {},
      SW: {},
      mark: {
        position: {}
      },
      marks: [],
      hotelData: {
        name: '',
        price: 0,
        roomType: '',
        checkIn: '',
        checkOut: '',
        hotelClass: '',
        lat: 0,
        lng: 0
      }
    }
  },
  components: { GoogleMap, Marker, InfoWindow, HotelCard },
  computed: {},
  methods: {
    ...mapActions(useHotelStore, ['booking']),
    getCoordinates: function () {
      let mapDiv = document.getElementById('map')
      let mapOptions = {
        zoom: 17,
        zoomControl: false,
        center: new google.maps.LatLng(this.center.lat, this.center.lng)
      }
      let map = new google.maps.Map(mapDiv, mapOptions)

      google.maps.event.addListener(map, 'bounds_changed', () => {
        let bounds = map.getBounds(),
          northEast = {
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng()
          },
          southWest = {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng()
          },
          center = {
            lat: bounds.getCenter().lat(),
            lng: bounds.getCenter().lng()
          }

        this.NE = northEast
        this.SW = southWest
        this.CE = center
      })
    },
    showPoint: function (position) {
      let mapDiv = document.getElementById('map')
      let mapOptions = {
        zoom: 17,
        zoomControl: false,
        center: new google.maps.LatLng(position.lat, position.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      let map = new google.maps.Map(mapDiv, mapOptions)

      new google.maps.Marker({
        position: new google.maps.LatLng(position.lat, position.lng),
        map: map
      })

      google.maps.event.addListener(map, 'bounds_changed', () => {
        let bounds = map.getBounds(),
          northEast = {
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng()
          },
          southWest = {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng()
          },
          center = {
            lat: bounds.getCenter().lat(),
            lng: bounds.getCenter().lng()
          }
        this.NE = northEast
        this.SW = southWest
        this.CE = center
      })
    },
    getHotels: async function () {
      try {
        const options = {
          method: 'GET',
          url: 'https://travel-advisor.p.rapidapi.com/hotels/list-in-boundary',
          params: {
            bl_latitude: this.SW.lat,
            bl_longitude: this.SW.lng,
            tr_longitude: this.NE.lng,
            tr_latitude: this.NE.lat
          },
          headers: {
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
            'X-RapidAPI-Key': '253d42d414msh4d146002ed12dbbp1cf8bcjsn5a561bb3fd3a'
          }
        }
        const response = await axios.get(options.url, {
          params: options.params,
          headers: options.headers
        })
        let data = []
        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].photo) {
            data.push({
              name: response.data.data[i].name,
              photo: response.data.data[i].photo.images.original.url,
              position: {
                lat: Number(response.data.data[i].latitude),
                lng: Number(response.data.data[i].longitude)
              },
              hotelClass: response.data.data[i].hotel_class
            })
          }
        }
        this.marks = data
        let map = new google.maps.Map(document.getElementById('map'), {
          zoom: 17,
          zoomControl: false,
          center: new google.maps.LatLng(this.CE.lat, this.CE.lng),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        let infowindow = new google.maps.InfoWindow()
        let marker, i
        for (i = 0; i < data.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(data[i].position.lat, data[i].position.lng),
            map: map
          })
          google.maps.event.addListener(
            marker,
            'click',
            (function (marker, i) {
              return function () {
                infowindow.setContent(data[i].name)
                infowindow.open(map, marker)
              }
            })(marker, i)
          )
        }
        google.maps.event.addListener(map, 'bounds_changed', () => {
          let bounds = map.getBounds(),
            northEast = {
              lat: bounds.getNorthEast().lat(),
              lng: bounds.getNorthEast().lng()
            },
            southWest = {
              lat: bounds.getSouthWest().lat(),
              lng: bounds.getSouthWest().lng()
            },
            center = {
              lat: bounds.getCenter().lat(),
              lng: bounds.getCenter().lng()
            }
          this.NE = northEast
          this.SW = southWest
          this.CE = center
        })
      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: error.response.data.message,
          text: 'Something went wrong!'
        })
      }
    },
    bookHotelData: async function (data) {
      try {
        this.hotelData = {
          hotel: data.name,
          price: 300000,
          roomType: 'Suites',
          checkIn: new Date(),
          checkOut: new Date(),
          hotelClass: +data.hotelClass,
          lat: data.position.lat,
          lng: data.position.lng
        }
        await axios.post(`${baseUrl}/booking`, this.hotelData, {
          headers: {
            access_token: localStorage.access_token
          }
        })
        this.$swal.fire({
          icon: 'success',
          title: 'Booking confirmed, check your email for the detail'
        })
      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: error.response.data.message,
          text: 'Something went wrong!'
        })
      }
    },
    payment: async function (data) {
      try {
        this.hotelData = {
          hotel: data.name,
          price: 300000,
          roomType: 'Suites',
          checkIn: new Date(),
          checkOut: new Date(),
          hotelClass: +data.hotelClass,
          lat: data.position.lat,
          lng: data.position.lng
        }
        const response = await axios.post(`${baseUrl}/payment`, this.hotelData, {
          headers: {
            access_token: localStorage.access_token
          }
        })
        snap.pay(response.data.token, {
          onSuccess: function (result) {
            console.log('success')
            console.log(result)
          },
          onPending: function (result) {
            console.log('pending')
            console.log(result)
          },
          onError: function (result) {
            console.log('error')
            console.log(result)
          },
          onClose: function () {
            console.log('customer closed the popup without finishing the payment')
          }
        })
      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: error.response.data.message,
          text: 'Something went wrong!'
        })
      }
    }
  }
})
</script>

<template>
  <div style="display: flex; justify-content: center; align-items: center; width: 100%">
    <div
      class="hotelCard"
      style="
        height: calc(100vh - 80px);
        background: #fff;
        width: 40%;
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
        padding-bottom: 70px;
      "
    >
      <div
        style="
          position: fixed;
          display: flex;
          justify-content: space-around;
          background: rgb(255, 0, 0);
          width: 40%;
        "
      >
        <a
          @click.prevent="getCoordinates"
          style="margin: 10px; color: white; cursor: pointer; text-align: center"
          >Click to Start</a
        >
        <a
          @click.prevent="getHotels"
          style="margin: 10px; color: white; cursor: pointer; text-align: center"
        >
          Get Hotels
        </a>
      </div>

      <br />
      <HotelCard
        v-for="(hotel, index) in marks"
        :key="index"
        :hotel="hotel"
        @showPoint="showPoint"
        @bookHotelData="bookHotelData"
        @payment="payment"
      ></HotelCard>
      <h2 style="text-align: center; margin: 0px 50px" v-if="marks.length === 0">
        To Start, Press "Click to Start" Button 1x, then drag your map and push "Get Hotels" Button
      </h2>
    </div>
    <GoogleMap
      id="map"
      api-key="AIzaSyAwmrfceN1TNZ5CMl1iFtBTIqBvMQp5Z0I"
      style="width: 60%; height: calc(100vh - 80px)"
      :center="center"
      :zoom="17"
    >
    </GoogleMap>
  </div>
</template>
