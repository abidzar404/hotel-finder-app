<script>
import { mapWritableState } from 'pinia'
import { useHotelStore } from '../stores/hotel'

export default {
  computed: {
    ...mapWritableState(useHotelStore, ['hotelData'])
  }
}
</script>

<template>
  <div
    style="
      width: 100%;
      height: calc(100vh - 80px);
      background: blue;
      display: flex;
      justify-content: center;
    "
  >
    <div
      style="
        width: 50%;
        height: calc(100vh - 80px);
        background: red;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      "
    >
      <div style="width: 80%; height: 30%; background: green"></div>
      <div style="width: 80%; height: 30%; background: yellow">
        <label>{{ hotelData.name }}</label>
      </div>
    </div>
  </div>
</template>
