<template>
  <div>

    <md-card>
      <md-card-area md-inset>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{rentable.description}}</div>
            <div class="md-subhead">{{rentable.description}}</div>
          </md-card-header-text>
          <md-card-media>
            <img src="static/lokkit_icon_100.png" alt="logo">
          </md-card-media>
        </md-card-header>

        <md-card-content>
          <div class="card-reservation">
            <md-icon md-iconset="mdi mdi-qrcode"></md-icon>
            {{ $route.params.address }}
          </div>
          <div class="card-reservation">
            <md-icon>location_on</md-icon>
            {{rentable.location}}
          </div>
          <div class="card-reservation">
            <md-icon>account_circle</md-icon>
            {{rentable.owner}}
          </div>
        </md-card-content>
        <md-card-content>
          <div class="md-warn">
            <md-icon class="md-warn">info</md-icon>
            You are currently not the renter of this rentable
          </div>
        </md-card-content>
        <md-card-actions>
	  <md-button v-if="!rentable.locked" @click.native="lock">Lock</md-button>
	  <md-button v-if="rentable.locked" @click.native="unlock">Unlock</md-button>
        </md-card-actions>
      </md-card-area>
    </md-card>

    <md-card style="margin-top:1em; margin-bottom:1em">
      <md-card-area md-inset>
        <md-card-content>
          <h3 class="md-subheading" style="display:flex;">Reservations</h3>
          <div class="card-reservation" v-for="reservation in rentable.reservations">
            <md-icon>access_time</md-icon> {{reservation.start}} - {{reservation.end}}
            <md-icon style="margin-left: .5em;">account_circle</md-icon> {{reservation.renter}}
          </div>
        </md-card-content>
      </md-card-area>
      <md-card-actions>
	<md-button @click.native="reserve">Reserve</md-button>
      </md-card-actions>
    </md-card>


  </div>
</template>

<script>
  export default {
    name: 'RentableDetails',
    methods: {
      reserve: function () {
        this.$store.dispatch('reserve', {
          rentableAddress: this.rentable.address,
          start: '23:00',
          end: '24:00',
          account: '0x99'
        })
      },
      lock: function () {
        this.$store.dispatch('lock', {
          rentableAddress: this.rentable.address,
          account: '0x99'
        })
      },
      unlock: function () {
        this.$store.dispatch('unlock', {
          rentableAddress: this.rentable.address,
          account: '0x99'
        })
      }
    },
    computed: {
      rentable () {
        return this.$store.state.rentables.find((i) => {
          return i.address === this.$route.params.address
        })
      }
    }
  }
</script>

<style scoped>
  .card-reservation {
    margin-top: 8px;

    .md-icon {
      margin: 28px;
      color: rgba(#000, .54) !important;
    }

    .md-button {
      border-radius: 2px !important;
    }
  }
</style>
