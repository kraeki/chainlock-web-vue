<template>
  <div>
    <md-list class="md-double-line">
      <md-list-item v-for="rentable in rentables" :key="rentable.address">
        <md-avatar class="md-avatar-icon">
          <md-icon style="margin-top:-.13em;"><i class="mdi mdi-qrcode"></i></md-icon>
        </md-avatar>
        <div class="md-list-text-container">
          <span>{{rentable.description}}</span>
          <p>
            <md-icon md-iconset="mdi mdi-qrcode" />{{rentable.address}}
            <md-icon style="margin-left: .5em;">location_on</md-icon>{{rentable.location}}
          </p>
        </div>
        <md-button :href="'#/rentable/' + rentable.address" class="md-icon-button md-list-action">
          <md-icon>info</md-icon>
        </md-button>
        <md-divider class="md-inset"></md-divider>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Root',
  props: {},
  components: {},
  computed: mapGetters({
    rentables: 'getRentables'
  })
}
</script>

<style scoped>
</style>
