<template>
  <div>

    <md-card>
      <md-card-area md-inset>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Rentable Number 1</div>
            <div class="md-subhead">Lorem ipsum asdfj ;salkdfj skdfj ldskfj sl;dfj s;dfj </div>
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
            Buenzen, top locker
          </div>
          <div class="card-reservation">
            <md-icon>account_circle</md-icon>
            0x57385756238729485840938457
          </div>
        </md-card-content>
        <md-card-content>
          <div class="md-warn">
            <md-icon class="md-warn">info</md-icon>
            You are currently not the renter of this rentable
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button>Lock</md-button>
        </md-card-actions>
      </md-card-area>
    </md-card>

    <md-card style="margin-top:1em; margin-bottom:1em">
      <md-card-area md-inset>
        <md-card-content>
          <h3 class="md-subheading" style="display:flex;">Reservations</h3>
          <div class="card-reservation">
            <md-icon>access_time</md-icon> 10:00 - 22:00
            <md-icon style="margin-left: .5em;">account_circle</md-icon> 0x57385756238729485840938457
          </div>
          <div class="card-reservation">
            <md-icon>access_time</md-icon> 10:00 - 22:00
            <md-icon style="margin-left: .5em;">account_circle</md-icon> 0x57385756238729485840938457
          </div>
          <div class="card-reservation">
            <md-icon>access_time</md-icon> 10:00 - 22:00
            <md-icon style="margin-left: .5em;">account_circle</md-icon> 0x57385756238729485840938457
          </div>
        </md-card-content>
      </md-card-area>
      <md-card-actions>
	<md-button>Reserve</md-button>
      </md-card-actions>
    </md-card>


  </div>
</template>

<script>
  export default {
    name: 'RentableDetails'
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
