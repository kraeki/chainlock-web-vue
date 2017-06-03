<template>
  <div>

    <!-- Show error -->
    <div v-if="currentRentable == null">
      <md-card>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Invalid rentable</div>
            <div class="md-subhead">{{rentableAddress}}</div>
          </md-card-header-text>

          <md-card-media>
            <md-icon class="md-size-3x md-warn">report_problem</md-icon>
          </md-card-media>
        </md-card-header>
      </md-card>
    </div>

    <!-- If currentRentable not set -->
    <div v-else>
      <md-card>
        <md-card-area md-inset>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{currentRentable.description}}</div>
              <div class="md-subhead">{{currentRentable.description}}</div>
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
              {{currentRentable.location}}
            </div>
            <div class="card-reservation">
              <md-icon>account_circle</md-icon>
              {{currentRentable.owner}}
            </div>
          </md-card-content>
          <md-card-content>
            <div class="md-warn">
              <md-icon class="md-warn">info</md-icon>
              You are currently not the renter of this rentable
            </div>
          </md-card-content>
          <md-card-actions>
            <md-button @click.native="lock" class="md-raised md-accent">Lock</md-button>
            <md-button @click.native="unlock" class="md-raised md-primary">Unlock</md-button>
          </md-card-actions>
        </md-card-area>
      </md-card>

      <md-card style="margin-top:1em; margin-bottom:1em">
        <md-card-area md-inset>
          <md-card-content>
            <h3 class="md-subheading" style="display:flex;">Reservations</h3>
            <div v-if="currentRentable.reservations.length == 0">
              No reservations found
            </div>
            <div class="card-reservation" v-for="reservation in currentRentable.reservations">
              <md-icon>access_time</md-icon> {{reservation.start | formatUnixTimeStamp}} - {{reservation.end | formatUnixTimeStamp}}
              <md-icon style="margin-left: .5em;">account_circle</md-icon> {{reservation.renter}}
            </div>
          </md-card-content>
        </md-card-area>
        <md-card-actions>
          <md-button @click.native="openDialog('reserveDialog')" class="md-raised md-accent">Reserve</md-button>
        </md-card-actions>
      </md-card>

      <md-dialog ref="reserveDialog">
        <md-dialog-title>Add reservation</md-dialog-title>
        <md-progress v-show="waiting" class="md-accent" md-indeterminate></md-progress>

        <md-dialog-content>
          <form v-on:submit.prevent="reserve">
            <md-input-container>
              <md-icon class="md-accent">event</md-icon>
              <label>Date</label>
              <md-input v-model="reserveDialog.fromDate" type="date" :disabled="waiting"></md-input>
            </md-input-container>
            <md-input-container>
              <md-icon class="md-accent">schedule</md-icon>
              <label>Time</label>
              <md-input v-model="reserveDialog.fromTime" type="time" :disabled="waiting"></md-input>
            </md-input-container>

            <md-layout md-gutter>
              <md-layout>
                <md-input-container>
                  <md-icon class="md-accent">update</md-icon>
                  <label>Duration</label>
                  <md-input v-model="reserveDialog.duration" type="number" :disabled="waiting"></md-input>
                </md-input-container>
              </md-layout>
              <md-layout md-flex="33" md-flex-offset="33">
                <md-input-container>
                  <label for="unit">Unit</label>
                  <md-select name="unit" id="unit" v-model="reserveDialog.unit" :disabled="waiting">
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
          <md-button :disabled="waiting" class="md-raised md-accent" @click.native="reserve">
            Reserve
            <md-progress v-show="waiting" class="md-accent" md-indeterminate></md-progress>
          </md-button>
        </md-dialog-actions>
      </md-dialog>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import {mapGetters} from 'vuex'

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
          action: {
            actionStart: (msg) => {
              this.waiting = true
            },
            actionUpdate: (msg) => { this.$toasted.info(msg) },
            actionComplete: (error, args) => {
              if (error) {
                this.$toasted.error(args.msg)
              } else {
                this.$toasted.success(args.msg)
                this.closeDialog('reserveDialog')
              }
              this.waiting = false
            }
          },
          rentableAddress: this.currentRentable.address,
          start: from.unix(),
          end: to.unix()
        })
      },
      lock: function () {
        this.$store.dispatch('lock', {
        })
      },
      unlock: function () {
        this.$store.dispatch('unlock', {
        })
      }
    },
    data: function () {
      return {
        rentableAddress: this.$route.params.address,
        waiting: false
      }
    },
    computed: {
      ...mapGetters([
        'currentRentable',
        'activeAccount'
      ]),
      reserveDialog () {
        const now = moment()
        return {
          fromDate: now.format('YYYY-MM-DD'),
          fromTime: now.format('HH:mm'),
          unit: 'Minutes',
          duration: 15
        }
      }
    },
    beforeCreate () {
      this.$store.dispatch('loadRentableByAddress', {rentableAddress: this.$route.params.address})
      .then((msg) => { this.$toasted.success(msg) })
      .catch((err) => { this.$toasted.error(err) })
    },
    beforeDestroy () {
      this.$store.dispatch('unloadRentableByAddress', {rentableAddress: this.currentRentable})
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
