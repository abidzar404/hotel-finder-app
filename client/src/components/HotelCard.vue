<script>
export default {
  props: ['hotel'],
  emits: ['showPoint', 'bookHotelData']
}
</script>

<template>
  <div
    style="
      width: 100%;
      height: 420px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 80px;
      margin-bottom: 0px;
    "
  >
    <div
      style="
        width: 90%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        background: antiquewhite;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        box-shadow: 5px 5px 10px #222;
        align-items: center;
      "
    >
      <a
        style="
          width: 10%;
          align-items: center;
          color: red;
          font-weight: bold;
          margin-left: 10px;
          cursor: pointer;
        "
        @click.prevent="this.$emit('bookHotelData', hotel)"
        >Book</a
      >
      <p
        style="
          color: black;
          text-align: center;
          height: 50px;
          width: 45%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
          margin-bottom: 10px;
        "
        @click="this.$emit('showPosition', hotel.position)"
      >
        {{ hotel.name }} ({{ hotel.hotelClass }})
      </p>
      <a
        style="
          width: 10%;
          align-items: center;
          color: red;
          font-weight: bold;
          margin-right: 10px;
          cursor: pointer;
        "
        @click.prevent="this.$emit('payment', hotel)"
        >Pay</a
      >
      <img :src="hotel.photo" style="width: 100%; height: 400px; object-fit: cover" />
    </div>
  </div>
</template>
