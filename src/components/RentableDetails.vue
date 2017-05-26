<template>
  <div>
    <md-card>
      <md-card-header>
	<md-card-header-text>
	  <div class="md-title">Rentable Number 1</div>
          <div class="md-subhead">Address {{ $route.params.address }}</div>
	  <div class="md-subhead">Location Buenzen</div>
	  <div class="md-subhead">Description: bla bla</div>
	</md-card-header-text>

	<md-card-media>
	  <img src="static/lokkit_icon_100.png" alt="logo">
	</md-card-media>
      </md-card-header>

      <md-card-actions>
	<md-button>Action</md-button>
	<md-button>Action</md-button>
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
</style>
