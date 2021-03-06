<template>
  <div>
    <md-dialog-confirm
      :md-active.sync="confirm"
      md-title="Are you confirm the acction?"
      :md-content.sync="action"
      md-confirm-text="Agree"
      md-cancel-text="Disagree"
      @md-cancel="onCancel"
      @md-confirm="onConfirm" />

    <md-dialog :md-active.sync="active" :md-backdrop="false">
      <md-dialog-content>
        <md-dialog-actions>
        <md-button class="md-icon-button" @click="active = false">
          <md-icon>close</md-icon>
        </md-button>
         </md-dialog-actions>
         <div>
            <h3>{{ inner.name }}</h3>  
         </div>
          <md-button class="md-fab md-primary" @click="onWatering">
            <md-icon>alarm_off</md-icon>
          </md-button>
          <md-button class="md-fab-top-right" @click="onState">
            <md-icon>history</md-icon>
          </md-button>
          <div>{{state}}</div>
          <div>Expired at: {{dt}}</div>
        <div>
          <md-field>
                <label>Schedule name</label>
                <md-input v-model="scheduleName" placeholder="Input name"></md-input>
            </md-field>
          <md-checkbox v-model="activeSchedule">Active</md-checkbox>
        </div>
        <div>
            <VueCronEditorBuefy v-model="cronExpression"/>
            {{cronExpression}}
        </div>
        
        <md-dialog-actions>
        <md-button class="md-icon-button" @click="confirm = true; action = 'on-delete'; active = false">
            <md-icon>delete</md-icon>
        </md-button>
          <md-button class="md-raised md-primary" @click="onSave">Save</md-button>
        </md-dialog-actions>
      </md-dialog-content>
    </md-dialog>

    <md-card class="md-card-example">
      <md-card-area md-inset>
         
        <md-card-media md-ratio="16:9">
          <img src="@/assets/plants.jpg" alt="Funny plant" />
        </md-card-media>

        <md-card-header>
          <md-field>
                <label>Plant name</label>
                <md-input v-model="inner.name" placeholder="Input name"></md-input>
            </md-field>
        </md-card-header>

        <md-card-content> 
        <md-button class="md-icon-button">
          <md-badge v-if ="inner.expired > 0" class="md-primary" :md-content="inner.expired" md-dense></md-badge>
          <md-icon>home</md-icon>
        </md-button>

        </md-card-content>
      </md-card-area>

     <md-card-expand>
      <md-card-expand-content>
          <md-card-content>
        <h3 class="md-subheading">Schedule</h3>
        <div class="card-reservation">

          <md-icon>access_time</md-icon>

            <md-button class="md-icon-button" @click="onAddSchedule">
                <md-icon>add</md-icon>
            </md-button>

          <div class="md-button-group">
            <div class="md-layout">
            <md-button
              v-for="(schedule, i) of inner.schedules"
              v-bind:key="i"
              v-bind:schedule="schedule"
              v-bind:class="{ 'md-raised md-primary': schedule.activeSchedule, 'md-accent':schedule.expired}"
              @click="onDialog(schedule.cronExpression, i)">
              {{ schedule.scheduleName }}
              </md-button>
            </div>
          </div>
        </div>
          </md-card-content>
      </md-card-expand-content>

      <md-card-actions md-alignment="space-between">
          <md-card-expand-trigger>
            <md-button class="md-icon-button">
              <md-icon>keyboard_arrow_down</md-icon>
            </md-button>
          </md-card-expand-trigger>
        </md-card-actions>
     </md-card-expand>

      <md-card-actions>
           <md-button class="md-icon-button" @click="confirm = true; action = 'on-card-delete';">
            <md-icon>delete</md-icon>
        </md-button>

        <md-button class="md-primary" @click="onSend()">Save</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
import VueCronEditorBuefy from 'vue-cron-editor-buefy';
export default {
  name: "Card",
  mounted() {
      this.inner = this.input
  },

  props: {
    input: Object,
  },

computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
},

  data: () => ({
    state:'',
    dt: null,
    url: process.env.VUE_APP_URL,
    active: false,
    confirm: false,
    action: '',
    activeSchedule: false,
    index: 0,
    cronExpression: "* * * * *",
    scheduleName: '',
    inner: {
        name: '',
        schedules: [],
        id:0,
        expired: 0
    }
  }),
  components: {
      VueCronEditorBuefy
  },

  methods: {

      correctDayOfWeek(expression, isFrom) {
          let cron = expression.split(" ")
          if(cron[4] ==="*")
            return expression

          let result = [cron[0], cron[1], cron[2], cron[3]]
          let dayOfWeek = isFrom == true ? parseInt(cron[4]) + 1 : parseInt(cron[4]) - 1
          result.push(dayOfWeek.toString())
          return result.join(' ')
      },

      onState() {
        let id = this.inner.schedules[this.index].id
        fetch(`${this.url}job?id=${id}`, {
          method: 'GET',
        })
        .then(response => response.json())
        .then(json => {
          this.state = json
        }).catch((e) => alert(e.message));
      },

      onSend() {

        if(this.inner.id == null) {
          if(this.inner.name == null) {
              alert('Please input the plant name!')
              return
          }

          this.$emit('send-schedule', 'plant', 'POST', this.inner)
        }
          else
              this.$emit('send-schedule', 'plant', 'PUT', this.inner)
      },

      onSave() {
          let method = null
          if(this.inner.schedules[this.index] == null) {
              this.inner.schedules.push({})
              this.inner.schedules[this.index].plantId = this.inner.id 
              this.inner.schedules[this.index].expired = false 
              method = 'POST'
          } else {
              method = 'PUT'
          }

          this.inner.schedules[this.index].cronExpression = this.correctDayOfWeek(this.cronExpression, false)
          this.inner.schedules[this.index].activeSchedule = this.activeSchedule
          this.inner.schedules[this.index].scheduleName = this.scheduleName
          this.onScheduleSend(method, this.inner.schedules[this.index])
          this.active = false
      },

    onScheduleSend(method, object) {
      console.log(object)
      fetch(`${this.url}/plants/schedule`, {
      method: method,
       headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(object)
       })
      .then(response => response.json())
      .then(json => {
        //console.log("json:")
        console.log(json)
        switch (method) {
          case 'POST':
            this.inner.schedules[this.index].id = json.id
            break;
          case 'DELETE':
            if(this.inner.schedules[this.index].expired == true)
              this.inner.expired --
            this.inner.schedules.splice(this.index, 1);
            break
        
          default:
            break;
        }
      })
      .catch((e) => alert(e.message));
    },

      onDialog(cronExpression, index) {
          this.state = ''
          this.dt = this.inner.schedules[index].dt
          this.cronExpression = this.correctDayOfWeek(cronExpression, true)
          this.scheduleName = this.inner.schedules[index].scheduleName
          this.activeSchedule = this.inner.schedules[index].activeSchedule
          this.index = index
          this.active = true 
      },

      onWatering() {
          let schedule = this.inner.schedules[this.index]
          schedule.expired = false
          if(this.inner.expired > 0) {
            this.inner.expired --
          }
          this.active = false
          schedule.dt = null
          this.onScheduleSend('PUT', schedule)
      },

      onAddSchedule() {
        if(this.inner.id == null) {
          this.confirm = true
          this.action = 'Save the card to database before adding a schedule!'
          return
        }
          this.index = this.inner.schedules.length
          this.cronExpression = ''
          this.scheduleName = ''
          this.activeSchedule = false
          this.active = true 
      },

      onDeleteSchedule() {
        this.onScheduleSend('DELETE', this.inner.schedules[this.index])
        this.active = false
      },

      onDeleteCard() {
        if(this.inner.schedules != null)
          if(this.inner.schedules.length != 0) {
            alert('Please delete all related schedules before!')
            return;
          }

          this.$emit('on-delete-card', this.inner.id)
      },

      onConfirm () {
        switch (this.action) {
            case 'on-delete':
                this.onDeleteSchedule()
                break;
            case 'on-card-delete':
                this.onDeleteCard()
                break;
        
            default:
                break;
        }
        this.confirm = false
      },
      onCancel () {
        switch (this.action) {
            case 'on-delete':
                this.active = true
                break;
            case 'on-card-delete':
                break;
        
            default:
                this.confirm = false
                break;
        }
      }

  }
};
</script>

<style lang="scss" scoped>
.md-card {
  width: 320px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}

.md-card-example {
  .md-subhead {
    .md-icon {
      $size: 16px;

      width: $size;
      min-width: $size;
      height: $size;
      font-size: $size !important;
    }

    span {
      vertical-align: middle;
    }
  }

  .card-reservation {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .md-icon {
      margin: 8px;
    }
  }

  .md-button-group {
    display: flex;

    .md-button {
      min-width: 60px;
      border-radius: 2px;
    }
  }

  .demo-badge {
    > div {
      margin-bottom: 16px;
    }
  }

}
</style>