<template>
    <li>
        <span v-bind:class="{done: todo.completed}">
            <input type="checkbox"  v-on:change="todo.completed = !todo.completed">
            <strong> {{index + 1}} </strong>
            {{uppercase}}
        </span >
        <button class="rm" @click="onDelete">
            &times;</button>
    </li>
</template>

<script>
export default {
    props: {
        todo: {
            type: Object,
            required: true
        },
            
            index: Number,
    },
    computed: {
    uppercase() {
      return this.todo.title.toUpperCase()
    }
  },

    methods: {
    markCompleted() {
     this.$emit('update:completed', !this.todo.completed)
    },
    onDelete() {
        this.$emit('remove-todo', this.todo.id)
    }
  },
}
</script>

<style scoped>
  li {
    border: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    padding: .5rem 2rem;
    margin-bottom: 1rem;
  }

  .rm {
    background: red;
    color: #fff;
    border-radius: 50%;
    font-weight: bold;
  }

  input {
    margin-right: 1rem;
  }

  .done {
    text-decoration: line-through;
  }
</style>