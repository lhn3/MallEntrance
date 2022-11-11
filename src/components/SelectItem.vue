<template>
  <div class="item" :class="{'active': props.active}">
    <div class="truncate" @click="handelClick('title')">{{ props.title }}</div>
    <el-button v-if="!props.isComponent" class="ml-auto" type="text" style="font-size: 18px;height: 50px;" :icon="Edit" @click="handelClick('edit')"/>
    <el-button v-if="!props.isComponent" type="text" style="font-size: 18px;height: 50px;" :icon="Close" @click="handelClick('delete')"/>
  </div>
</template>

<script setup>
import {Edit, Close} from '@element-plus/icons-vue'
import {defineProps} from "vue";

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  },
  isComponent:{
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['handelTitle', 'handelEdit', 'handelDelete'])

const handelClick = (type) => {
  switch (type) {
    case 'title':
      emit('handelTitle')
      break
    case 'edit':
      emit('handelEdit')
      break
    case 'delete':
      emit('handelDelete')
      break
  }
}
</script>

<style scoped lang="less">
.item {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #f4f4f4;
  div {
    height: 50px;
    width: 100%;
    line-height: 50px;
    cursor: pointer;
  }
@apply flex items-center justify-between text-sm text-gray-600 p-4;
}
.item:hover, .active {
@apply bg-blue-50;
}
</style>