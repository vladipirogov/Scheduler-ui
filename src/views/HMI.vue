<template>
<div id="hmi">
   
</div>
</template>

<script>

export default {
    name: 'hmi',

    data: () => ({
       T1 : "T1"
    }),

    methods: {
       onClick() {
          console.log("HELLO")
          this.T1 = "T2"
       }
    }
    
}
</script>