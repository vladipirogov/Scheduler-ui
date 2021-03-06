<template>
    <div>

     <!-- <router-link to="/todos">Todos</router-link> -->

<!-- <md-button @click="getPlants" class="md-primary">Plants</md-button> -->
<div class="button-panel">
<md-button class="md-fab md-primary" @click="onAddPlant">
                <md-icon>add</md-icon>
            </md-button>
</div>

<div class="md-layout md-gutter md-alignment-top-center" :key="uniq">
 <Card   v-for="plant of plants"
         v-bind:key="plant.id"
         v-bind:input="plant"
         v-on:send-schedule="onSend"
         v-on:on-delete-card="onDeleteCard"
         class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
 />
</div>
     </div>
</template>



<script>
import Card from '@/components/Card'

export default {
  name: 'Home',

  sockets: {
        connect: function () {
            // console.log('socket connected')
        },
        customEmit: function () {
            // console.log(data)
        }}, 

  mounted() {
    this.getPlants(),

    this.sockets.subscribe('message', (data) => {
      this.plants.forEach(plant => {
        if(plant.id == data.plantId) {
          plant.expired = 0
          plant.schedules.forEach((schedule) => {
            if(schedule.id == data.id) {
              schedule.expired = true
              schedule.dt = data.dt
            }
            if(schedule.expired == true) {
              plant.expired ++
           }
          }) 
        }
      })
    });
  },

  data() {
     return {
      url: process.env.VUE_APP_URL,
      plants: [],
      uniq:0,
      plantId:0,
     }
  },

  methods: {

    onAddPlant() {
      this.plants.push({})
    },

    onDeleteCard(plantId) {
       this.plantId = plantId
       this.onSend('plant', 'DELETE', {id:plantId})
    },

    onSend(url, method, object) {
      console.log(object)
      fetch(`${this.url}plants/${url}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(object)
       })
      .then(response => response.json())
      .then(json => {
        switch (method) { 
          case 'POST':
            if(json != null)
              this.getPlants()
            break;
          case 'DELETE':
            if(json != null)
              this.plants = this.plants.filter(plant => plant.id !== this.plantId)
            break
        
          default:
            break;
        }
      })
      .catch((e) => alert(e.message));
    },

    /**
     * Get plants from datasource
     */
    getPlants() {
        fetch(`${this.url}plants`)
        .then(response => response.json())
        .then(json => {
          this.plants = []
          json.forEach(element => {
            let plant = {
              id: element.id,
              name: element.name,
              schedules: element.schedules,
              expired:0,
            }
            plant.schedules.forEach(element => {
              if(element.expired)
                plant.expired++
            })
            this.plants.push(plant)
          });
          console.log(this.plants)
           this.uniq++

         })
         .catch((e) => alert(e.message));
    },

  },

  components: {
    Card
  }
}
</script>

<style lang="scss" scoped>
 @import "~vue-material/dist/theme/engine";

 .button-panel {
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
  }

</style>
