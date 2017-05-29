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
            <md-icon>access_time</md-icon> {{reservation.start | formatUnixTimeStamp}} - {{reservation.end | formatUnixTimeStamp}}
            <md-icon style="margin-left: .5em;">account_circle</md-icon> {{reservation.renter}}
          </div>
        </md-card-content>
      </md-card-area>
      <md-card-actions>
	<md-button @click.native="openDialog('reserveDialog')">Reserve</md-button>
      </md-card-actions>
    </md-card>

    <md-dialog ref="reserveDialog">
      <md-dialog-title>Add reservation</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-input-container>
            <md-icon>event</md-icon>
            <label>Date</label>
            <md-input v-model="reserveDialog.fromDate" type="date"></md-input>
          </md-input-container>
          <md-input-container>
            <md-icon>schedule</md-icon>
            <label>Time</label>
            <md-input v-model="reserveDialog.fromTime" type="time"></md-input>
          </md-input-container>

          <md-layout md-gutter>
            <md-layout>
              <md-input-container>
                <md-icon>update</md-icon>
                <label>Duration</label>
                <md-input v-model="reserveDialog.duration" type="number"></md-input>
              </md-input-container>
            </md-layout>
            <md-layout md-flex="33" md-flex-offset="33">
              <md-input-container>
                <label for="unit">Unit</label>
                <md-select name="unit" id="unit" v-model="reserveDialog.unit">
                  <md-option value="Minutes">Minutes</md-option>
                  <md-option value="Hours">Hours</md-option>
                  <md-option value="Days">Days</md-option>
                  <md-option value="Weeks">Weeks</md-option>
                  <md-option value="Months">Months</md-option>
                  <md-option value="Years">Years</md-option>
                </md-select>
              </md-input-container>
            </md-layout>
          </md-layout>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click.native="closeDialog('reserveDialog')">Cancel</md-button>
        <md-button class="md-primary" @click.native="reserve">Reserve</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'RentableDetails',

    methods: {
      openDialog: function (dialog) {
        this.$refs[dialog].open()
      },
      closeDialog: function (dialog) {
        this.$refs[dialog].close()
      },
      reserve: function () {
        // calculate from and to using parameters given by the reserveDialog
        const from = moment(this.reserveDialog.fromDate + ' ' + this.reserveDialog.fromTime)
        const to = from.clone().add(this.reserveDialog.duration, this.reserveDialog.unit)

        this.$store.dispatch('reserve', {
          rentableAddress: this.rentable.address,
          start: from.unix(),
          end: to.unix(),
          account: '0x99'
        })
        this.closeDialog('reserveDialog')
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
    data: function () {
      const now = moment()
      return {
        reserveDialog: {
          fromDate: now.format('YYYY-MM-DD'),
          fromTime: now.format('HH:mm'),
          unit: 'Minutes',
          duration: 15
        }
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
