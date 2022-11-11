<template>
  <div>
    <el-tag
        v-for="tag in tags"
        :key="tag"
        type="success"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
        style="margin: 0 10px 10px 0"
        effect="plain"
    >
      {{ tag }}
    </el-tag>
    <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model.trim="inputValue"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
        style="width: 80px"
        maxlength="10"
    />
    <el-button v-else size="small" @click="showInput">+ 规格值</el-button>
  </div>
</template>

<script setup>
import {nextTick, ref, defineProps, defineEmits, watch} from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['tagsChange'])
const inputValue = ref('')
const tags = ref([])
const inputVisible = ref(false)
const InputRef = ref()

watch(
    () => props.modelValue,
    () => {
      if (!props.modelValue) return
      tags.value = props.modelValue.split(',')
    },
    {
      immediate: true
    })

const handleClose = (tag) => {
  tags.value.splice(tags.value.indexOf(tag), 1)
  emit('update:modelValue', tags.value.toString())
}

//显示输入框并获取焦点
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

//输入内容提交
const handleInputConfirm = () => {
  if (inputValue.value) {
    tags.value.push(inputValue.value)
    emit('update:modelValue', tags.value.toString())
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<style scoped>

</style>