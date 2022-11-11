<template>
  <div class="flex">
    <el-icon v-if="props.modelValue" :size="18" style="margin-right: 10px">
      <component :is="props.modelValue"/>
    </el-icon>

    <el-select v-model="props.modelValue" placeholder="请选择" filterable clearable @change="changeSelect">
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <template #default>
          <div class="flex">
            <el-icon :size="16" style="margin-right: 10px">
              <component :is="item"/>
            </el-icon>
            <span>{{ item }}</span>
          </div>
        </template>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import {defineProps,ref,defineEmits} from "vue";
import * as iconList from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])
const  icons = ref(Object.keys(iconList))

const changeSelect = value => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.flex{
  display: flex;
  align-items: center;
}

</style>