<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <el-tag class="ml-2" type="success"
                v-if="isCompleted && !isCanceled">Completed</el-tag>
        <el-tag class="ml-2" type="danger"
                v-if="isCanceled">Canceled</el-tag>
      </template>
      <div
        v-if="!isActive"
      > 
        <div
        @dblclick="onDbClick">
          <el-checkbox
            v-if="!isCanceled"
            v-model="isCompleted"
            @change="$emit('on-change', isCompleted)"
          />
          {{ inputValue }}
          <el-button
            v-if="!isCanceled"
            type="danger" round
            @click.prevent="isCanceled = true; $emit('on-cancel', true)">
            Cancel
          </el-button>
          <el-button
            v-if="isCanceled"
            type="info" round
                    @click.prevent="isCanceled = false; $emit('on-cancel', false)">
            Restore
          </el-button>
        </div>
        <div
            v-if="isDescriptionActive"
          >
            <el-input
              v-model="description"
              :rows="2"
              ref="dinputElement"
              type="textarea"
              placeholder="Please input some comments"
              @blur="onDescriptionBlur"
            />
        </div>
        <div v-else
          @dblclick="onDescriptionDbClick">
          <h3>Comment</h3>
          {{description}}
          <span v-if="!description.length">
            Double click to edit
          </span>
        </div>
      </div>
      <el-input 
        v-else
        data-test="todo-elem__input"
        ref="inputElement"
        v-model="inputValue"
        @blur="onBlur"
      />
    </el-card>
    <br>
  </div>
</template>

<script>
import { nextTick, reactive, ref, toRefs, watch } from 'vue'
export default {
  name: 'TodoElem',
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    }
  },
  emits: ['update:model-value', 'on-change', 'on-cancel', 'on-description-changed'],
  setup (props, { emit }) {
    const inputElement = ref(null)
    const dinputElement = ref(null)
    const state = reactive({
      isActive: false,
      isDescriptionActive: false,
      inputValue: '',
      isCompleted: false,
      isCanceled: false,
      description: ''
    })
    watch(
      () => props.modelValue, 
      () => {
        state.inputValue = props.modelValue.name
        state.isCompleted = props.modelValue.completed
        state.isCanceled = props.modelValue.canceled
        state.description = props.modelValue.description
      }, 
      { immediate: true }
    )
    const onDescriptionBlur = () => {
      state.isDescriptionActive = false
      emit('on-description-changed', state.description)
    }
    const onBlur = () => {
      state.isActive = false
      emit('update:model-value', state.inputValue)
    }
    const onDbClick = () => {
      state.isActive = true
      nextTick(() => inputElement.value.focus())
    }
    const onDescriptionDbClick = () => {
      console.log('1')
      state.isDescriptionActive = true
      nextTick(() => dinputElement.value.focus())
    }
    return { ...toRefs(state), dinputElement, inputElement, onBlur, onDbClick, onDescriptionBlur, onDescriptionDbClick }
  }
}
</script>