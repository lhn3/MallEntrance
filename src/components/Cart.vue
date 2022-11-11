<template>
  <el-card shadow="hover" style="cursor: pointer">
    <template #header>
      <div class="cart-title">
        <span>{{ props.title }}</span>
        <el-tag v-if="props.tagInfo" :type="props.tagType" effect="plain">{{ props.tagInfo }}</el-tag>
        <slot name="header"/>
      </div>
    </template>
    <slot name="body"/>
  </el-card>
</template>

<script setup>
import {defineProps} from "vue";

let props = defineProps({
  title: {
    type: String,
    default: ''
  },
  tagType: {
    type: String,
    default: ''
  },
  tagInfo: {
    type: String,
    default: null
  },

})
</script>

<style scoped lang="less">
.cart-title {
@apply text-sm;
  display: flex;
  justify-content: space-between;
  line-height: 30px;
}

.cart-value {
@apply text-4xl font-bold text-gray-500;
  line-height: 70px;
}

.cart-bottom {
@apply text-sm text-gray-500;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
}
</style>