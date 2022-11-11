<template>
  <el-dialog custom-class="custom-dialog" v-model="props.modelValue" @close="cancel" width="65vw">
    <template #header>商品详情</template>
    <Editor v-model="content"/>
    <template #footer>
      <el-button :loading="loading" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import Editor from '@/components/Editor.vue'
import {defineProps, defineEmits, ref, watch} from "vue";
import {updateGoodsDetail} from '@/request/api/goodManagement.js'
import {ElMessage} from "element-plus";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  detail: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue', 'refresh'])
const loading = ref(false)
//富文本内容
const content = ref('')
const id = ref(null)

watch(
    () => props.detail,
    () => {
      if (props.detail) {
        content.value = props.detail.content
        id.value = props.detail.id
      }
    },
    {
      immediate: true
    }
)

//关闭右侧抽屉
const cancel = () => {
  emit('update:modelValue')
}

const submit = async () => {
  loading.value = true
  const res = await updateGoodsDetail({id: id.value, content: content.value})
  if (res.code !== 200) {
    loading.value = false
    return ElMessage({
      message: res.msg + '!',
      type: 'error',
      dangerouslyUseHTMLString: true
    })
  }
  loading.value = false
  ElMessage.success('商品详情修改成功~')
  emit('update:modelValue')
  emit('refresh')
}

</script>

<style scoped></style>