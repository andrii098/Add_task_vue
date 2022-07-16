<template>
  <div class="app">
    <TodoHeader />
    <router-view></router-view>
  </div>
</template>

<script>
import TodoHeader from '@/components/todo-header.vue'
export default {
  name: 'App',
  components: { TodoHeader }
}
</script>

<style>
.app {
  max-width: 450px;
  padding: 25px;
  margin: 10px auto 40px;
	box-shadow: 0 10px 20px 0 rgba(0, 179, 255, 0.2);
}
</style>