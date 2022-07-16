import { reactive } from 'vue'

const state = reactive({
  todoList: []
})

export function getTodoList() {
    return state.todoList
}
export function setTodoList(newTodoList) {
  state.todoList = newTodoList
}
export function addTodoItem(todo) {
    state.todoList.push(todo)
}

export function selectAllTodos(status) { 
  setTodoList(
    getTodoList().map(item => ({
        ...item, completed: status
        }))
    )
}