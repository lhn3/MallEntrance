<template>
  <div class="shipSetting">
    <el-form ref="formRef" :model="formInline" :rules="rules" label-width="120px">
      <el-form-item prop="ship" label="物流查询key">
        <el-input v-model="formInline.ship" placeholder="请输入" clearable style="width: 60%"/>
        <el-popover placement="right" title="提示" :width="200" trigger="hover"
                    content="用于查询物流信息，接口申请(仅供参考)">
          <template #reference>
            <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer">
              <QuestionFilled/>
            </el-icon>
          </template>
        </el-popover>
      </el-form-item>
    </el-form>
    <el-button style="margin-left: 60%" type="primary" @click="submit">保存</el-button>
  </div>
</template>

<script setup>
import {getBaseSetting, setBaseSetting} from "@/request/api/systemSettings.js";
import {ElMessage} from "element-plus";
import {onMounted, reactive, ref} from "vue";

const formRef = ref()
const loading = ref(false)

//数据信息
const formInline = reactive({ship: ''})
const rules = {ship: [{required: true, message: '请输入必填项', trigger: 'blur'}],}

const getInfo = async () => {
  let res = await getBaseSetting()
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  formInline.ship = res.data.ship
  console.log(formInline.ship)
}

onMounted(() => {
  getInfo()
})

//保存购物设置
const submit = () => {
  formRef.value.validate(async isValid => {
    if (!isValid) return
    loading.value = true
    let res = await setBaseSetting(formInline)
    if (res.code !== 200) {
      ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
      await getInfo()
      loading.value = false
      return
    }
    loading.value = false
    ElMessage.success('修改成功~')
  })
}
</script>

<style scoped>
.shipSetting {
  padding: 20px;
}
</style>