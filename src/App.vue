<template>
  <div id="app">
   <div  class="md-layout-column">
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">Plants schedule</span>

    </md-toolbar>

    <md-drawer :md-active.sync="showNavigation" md-swipeable style="width: 200px;">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Menu</span>
      </md-toolbar>

      <md-list>
        <md-list-item to="/">
               <md-icon>move_to_inbox</md-icon>
                <span class="md-list-item-text">Plants</span>
        </md-list-item>

        <md-list-item to="/todos">
          <md-icon>send</md-icon>
          <span class="md-list-item-text">Todos</span>
        </md-list-item>

             <md-list-item to="/hmi">
          <md-icon>send</md-icon>
          <span class="md-list-item-text">HMI</span>
        </md-list-item>
      </md-list>
    </md-drawer>

  </div>

    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'Temporary',
    data: () => ({
      showNavigation: false,
      showSidepanel: false
    })
  }
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */


  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-content {
    padding: 16px;
  }
</style>
