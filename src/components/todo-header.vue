<template>
  <header class="todo-header">
    <img alt="Todo list logo" class="todo-header" :src="require('@/assets/preview.png')" />
    <h1>My Todo List</h1>
  </header>
</template>

<script>
export default {
  name: 'todo-header'  
}
</script>

<style>
.todo-header {
  display: block;
  margin: 0 auto;
  width: 100%;
}
</style>