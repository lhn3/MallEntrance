<template>
  <el-dialog :model-value="props.modelValue" title="导出订单" width="30%" draggable @close="cancel">
    <el-form v-if="props.modelValue" ref="formRef" :model="state.formData" :rules="state.rules" label-width="100px">
      <el-form-item prop="tab" label="订单类型">
        <el-select v-model="state.formData.tab" placeholder="请选择" filterable clearable>
          <el-option v-for="item in props.tabs" :key="item.name" :label="item.label" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="daterange" label="时间范围">
        <el-date-picker
            v-model="state.formData.daterange"
            type="daterange"
            range-separator="到"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD"
            clearable
            :editable="false"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel" :loading="state.loading">取消</el-button>
      <el-button type="primary" @click="submit" :loading="state.loading">确定导出</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, reactive, ref, watch} from 'vue'
import {exportOrder} from '@/request/api/OrderManagement.js'
import {ElMessage} from "element-plus";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  tabs: {
    type: Array,
    default: () => ([])
  }
})
const emit = defineEmits(['update:modelValue'])
const formRef = ref()
const state = reactive({
  loading: false,
  formData: {
    tab: '',
    daterange: null
  },
  rules: {
    tab: {required: true, message: '请选择必填项', trigger: 'blur'}
  }
})

watch(
    () => props.modelValue,
    newValue => {
      if (newValue) {
        state.loading = false
        state.formData.tab = ''
        state.formData.daterange = null
      }
    }
)
//取消
const cancel = () => {
  emit('update:modelValue')
}

//确定导出
const submit = () => {
  formRef.value.validate(async isValid => {
    if (!isValid) return
    state.loading = true
    let formData = {
      tab: state.formData.tab,
      starttime: state.formData.daterange ? state.formData.daterange[0] : undefined,
      endtime: state.formData.daterange ? state.formData.daterange[1] : undefined,
    }
    let res = await exportOrder(formData)
    if (res.code !== 200) {
      state.loading = false
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    //处理blob数据转成blob链接
    let blobUrl = window.URL.createObjectURL(new Blob([res]))

    //创建a标签下载blob数据
    let a = document.createElement('a')
    a.style.display = 'none'
    a.href = blobUrl
    let filename = (new Date()).getTime() + '.xlsx'
    a.setAttribute('download', filename) //设置a标签为下载标签并设置下载文件名
    document.body.appendChild(a)
    a.click()

    state.loading = false
    ElMessage.success('导出成功~')
    emit('update:modelValue')
  })
}

</script>

<style scoped>

</style>