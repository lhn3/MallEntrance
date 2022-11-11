<template>
  <el-drawer
      ref="drawerRef"
      v-model="props.moduleValue"
      :title="props.title"
      direction="rtl"
      :close-on-click-modal="props.closeOnClickModal"
      :before-close="cancel"
      :size="props.width"
      :destroy-on-close="props.destroyOnClose"
      :close-on-press-escape="props.closeOnPressEscape"
  >
    <div class="main">
      <div class="body">
        <slot/>
      </div>
      <div class="btn" v-if="props.showBtn">
        <el-button class="w-[60px]" type="default" @click="cancel">取消</el-button>
        <el-button :loading="props.loading" class="w-[60px]" color="#6366f1" type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import {defineEmits, defineProps, ref} from "vue";

const props = defineProps({
  moduleValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '默认标题'
  },
  width: {
    type: String,
    default: '30%'
  },
  destroyOnClose: { //控制是否在关闭 Drawer 之后将子元素全部销毁
    type: Boolean,
    default: false
  },
  closeOnPressEscape: { //是否可以通过按下 ESC 关闭 Drawer
    type: Boolean,
    default: true
  },
  closeOnClickModal: { //是否可以通过点击 modal 关闭 Drawer
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  showBtn: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['handleClose', 'onSubmit'])
const drawerRef = ref()

//取消
const cancel = () => {
  emit('handleClose')
  drawerRef.value.close()
}
//提交
const confirm = () => {
  emit('onSubmit')
}
</script>

<style scoped lang="less">
.main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .body {
    flex: 1;
    overflow-y: auto;
  }
  .btn {
    height: 40px;
    display: flex;
    align-items: center;
  }
}
</style>