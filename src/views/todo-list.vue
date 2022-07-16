<template>
  <main>
    <div>
      <el-input v-model="newTodo" type="text" autofocus @keydown="onInputKeyDown"
                placeholder="Put something and press enter to create new task" />
    </div>
    <div>
      <div>
        <hr>
        <el-tag>
          {{ todoList.length }}
          <span>{{ counterLabel }} {{ $route.name == 'home' ? '' : $route.name.replace('-', ' ') }}</span>
        </el-tag>
        <hr>
      </div>
      <el-row class="mb-4">
        <router-link :to="{ name: 'home' }" custom v-slot="{ navigate }">
          <el-button type="primary" @click="navigate" @keypress.enter="navigate">
            All
          </el-button>
        </router-link>
        <router-link :to="{ name: 'in-progress' }" custom v-slot="{ navigate }">
          <el-button type="warning" @click="navigate" @keypress.enter="navigate">
            In Progress
          </el-button>
        </router-link>
        <router-link :to="{ name: 'completed' }" custom v-slot="{ navigate }">
          <el-button type="success" @click="navigate" @keypress.enter="navigate">
            Completed
          </el-button>
        </router-link>
        <router-link :to="{ name: 'canceled' }" custom v-slot="{ navigate }">
          <el-button type="danger" @click="navigate" @keypress.enter="navigate">
            Canceled
          </el-button>
        </router-link>
      </el-row>
    </div>
    <br>
    <el-input v-model="searchFilter" placeholder="Search filter" autofocus @change="filterTodos"/>

    <div v-if="todoList.length">
      <el-checkbox class="todo-list__header-checkbox" v-model="mainCheckbox"
        @change="onSelectAll" />
      Select All
    </div>
    <todo-elem v-for="(todo, index) in todoList" :key="index" :model-value="todo" type="text"
      @update:model-value="value => onChangeName(value, index)" @on-change="value => onSelect(value, index)"
      @on-description-changed="value => onChangeDescription(value, index)"
      @on-cancel="value => onCancel(value, index)" />
  </main>
</template>

<script>
import { reactive, toRefs, watch, computed } from 'vue'
import TodoElem from '@/components/todo-elem.vue'
import { getTodoList, selectAllTodos, setTodoList, addTodoItem } from '@/storage/todoList'
export default {
  name: 'TodoList',
  components: { TodoElem },
  props: {
    filter: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const state = reactive({
      todoList: [],
      mainCheckbox: false,
      newTodo: '',
      todoValue: '',
      searchFilter: '',
      showCompletedButton: false,
      showCanceledButton: false,
      counterLabel: computed(() => {
        const label = state.todoList.length === 1 ? 'todo' : 'todos'
        return ` ${label} `
      })
    })
    watch(
      () => state.todoList,
      list => {
        state.showCompletedButton = list.some(({
          completed
        }) => completed)
        state.mainCheckbox = list.every(
          ({ completed }) => completed
        )
        state.showCanceledButton = list.some(({
          canceled
        }) => canceled);
      },
      {
        deep: true
      }
    )
    watch(
      () => props.filter,
      () => filterTodos()
    )
    const onCancel = (value, index) => {
      const todoList = getTodoList();
      todoList[index].canceled = value;
      state.todoList[index].canceled = value;
      setTodoList(todoList);
      filterTodos();
    };
    const onInputKeyDown = event => {
      if (event.keyCode === 13 && state.newTodo) {
        addTodoItem({ name: state.newTodo, completed: false, canceled: false, description: '' })
        state.todoList = getTodoList()
        state.newTodo = ''
        filterTodos()
      }
    };
    const onSelect = (value, index) => {
      const todoList = getTodoList();
      todoList[index].completed = value
      state.todoList[index].completed = value
      setTodoList(todoList);
      filterTodos()
    };
    const onChangeDescription = (value, index) => {
      const todoList = getTodoList();
      todoList[index].description = value;
      state.todoList[index].description = value;
      setTodoList(todoList)
    }
    const onChangeName = (value, index) => {
      const todoList = getTodoList();
      if (!value) value = `Task${index}`
      todoList[index].name = value
      state.todoList[index].name = value
      setTodoList(todoList)
    };
    const filterTodos = () => {
      if (!props.filter && !state.searchFilter) return state.todoList = getTodoList()
      state.todoList = getTodoList().filter(({ completed, canceled, name, description }) => {
        if (!(new RegExp(state.searchFilter)).test(name)
        && !(new RegExp(state.searchFilter)).test(description)) {
          return false;
        }
        if (props.filter === 'canceled') {
          return canceled;
        }
        if (props.filter === 'in-progress') {
          return !completed && !canceled;
        }
        if (props.filter === 'completed') {
          return completed && !canceled;
        }
        return true;
      })
    };
    const onSelectAll = () => {
      selectAllTodos(state.mainCheckbox)
      state.todoList = getTodoList()
    };
    return {
      filterTodos,
      onCancel,
      onInputKeyDown,
      onSelectAll,
      onChangeName,
      onChangeDescription,
      onSelect,
      ...toRefs(state),
    };
  }
}
</script>
