<template>
  <md-card>
    <md-card-area md-inset>
      <md-card-content>
        <h3 class="md-subheading">Action</h3>
        <div v-if="currentReservation != null">
          <md-icon class="md-accent">info</md-icon>
          Your ownerchip will end <md-chip>{{endingIn}}</md-chip>.
        </div>
        <div v-else>
            <md-icon class="md-warn">info</md-icon>
            You are currently not the renter of this rentable.
        </div>
        <div>
          <md-icon class="md-primary">info</md-icon>
          Next reservation is <md-chip>{{comingUp}}</md-chip>.
        </div>
      </md-card-content>
      <md-card-actions v-if="currentReservation != null">
        <md-button @click.native="unclaim" class="">Unclaim</md-button>
        <span style="flex: 1"></span>
        <md-button @click.native="lock" class="md-raised md-accent">Lock</md-button>
        <md-button @click.native="unlock" class="md-raised md-primary">Unlock</md-button>
      </md-card-actions>
    </md-card-area>
  </md-card>
</template>

<script>
  import moment from 'moment'
  import {mapGetters} from 'vuex'

  export default {
    name: 'LockUnlockCard',
    components: {},
    methods: {
      lock: function () {
        this.$store.dispatch('lock')
      },
      unlock: function () {
        this.$store.dispatch('unlock')
      },
      unclaim: function () {
        // TODO: ask for confirmation
        this.$store.dispatch('unclaim')
      },
      updateComingUp () {
        const r = this.nextReservation
        if (!r) {
          this.comingUp = 'no upcoming reservations'
        } else {
          this.comingUp = moment.unix(r.start).fromNow()
        }
      },
      updateEndingIn () {
        const r = this.currentReservation
        if (!r) {
          this.endingIn = 'You are current not the renter of this rentable'
        } else {
          this.endingIn = moment.unix(r.end).fromNow()
        }
      }
    },
    data: function () {
      return {
        comingUp: null,
        endingIn: null,
        timerId: null
      }
    },
    computed: {
      ...mapGetters([
        'nextReservation',
        'currentReservation'
      ])
    },
    mounted () {
      const self = this
      this.timerId = setInterval(() => {
        self.updateComingUp()
        self.updateEndingIn()
      }, 5000)
    },
    beforeDestroy () {
      clearInterval(this.timerId)
    }
  }
</script>

<style scoped>
</style>
