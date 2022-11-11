<template>
  <div class="distributionSetting">
    <el-form ref="formRef" :model="state.formInline" :rules="state.rules" label-width="150px">
      <div class="set-title">基础设置</div>
      <el-form-item prop="distribution_open" label="分销启用">
        <el-radio-group v-model="state.formInline.distribution_open">
          <el-radio :label="1" border>是</el-radio>
          <el-radio :label="0" border>否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="spread_banners" label="分销海报">
        <ImageSelect v-model="state.formInline.spread_banners" multiple :limit="9"/>
      </el-form-item>

      <div class="set-title">返佣设置</div>
      <el-form-item prop="store_first_rebate" label="一级返佣比例">
        <el-input-number :controls="false" :min="0" :precision="0" v-model="state.formInline.store_first_rebate"
                         placeholder="请输入" style="width: 220px"/>
        <div class="unit-tip">%</div>
        <el-popover
            placement="right"
            title="提示"
            :width="300"
            trigger="hover"
            content="订单交易成功后给上级返佣的比例0-100，例：5 = 返订单金额的5%"
        >
          <template #reference>
            <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer">
              <QuestionFilled/>
            </el-icon>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item prop="store_second_rebate" label="二级返佣比例">
        <el-input-number :controls="false" :min="0" :precision="0" v-model="state.formInline.store_second_rebate"
                         placeholder="请输入" style="width: 220px"/>
        <div class="unit-tip">%</div>
        <el-popover
            placement="right"
            title="提示"
            :width="300"
            trigger="hover"
            content="订单交易成功后给上级返佣的比例0-100，例：5 = 返订单金额的5%"
        >
          <template #reference>
            <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer">
              <QuestionFilled/>
            </el-icon>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item prop="is_self_brokerage" label="自购返佣">
        <el-radio-group v-model="state.formInline.is_self_brokerage">
          <el-radio :label="1" border>是</el-radio>
          <el-radio :label="0" border>否</el-radio>
        </el-radio-group>
        <el-popover
            placement="right"
            title="提示"
            :width="300"
            trigger="hover"
            content="是否开启自购返佣（开启：分销员自己购买商品，享受一级返佣，上级享受二级返佣；关闭：分销员自己购买商品没有返佣）"
        >
          <template #reference>
            <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer">
              <QuestionFilled/>
            </el-icon>
          </template>
        </el-popover>
      </el-form-item>

      <div class="set-title">结算设置</div>
      <el-form-item prop="settlement_days" label="结算时间">
        <el-input-number :controls="false" :min="0" :precision="0" v-model="state.formInline.settlement_days"
                         placeholder="请输入" style="width: 220px"/>
        <div class="unit-tip">天</div>
        <el-popover
            placement="right"
            title="提示"
            :width="300"
            trigger="hover"
            content="预估佣金结算后无法进行回收，请谨慎设置结算天数"
        >
          <template #reference>
            <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer">
              <QuestionFilled/>
            </el-icon>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item prop="brokerage_method" label="佣金到账方式">
        <el-radio-group v-model="state.formInline.brokerage_method">
          <el-radio label="hand" border>手动到账</el-radio>
          <el-radio label="wx" border>自动到微信零钱</el-radio>
        </el-radio-group>
        <el-popover
            placement="right"
            title="提示"
            :width="300"
            trigger="hover"
            content="佣金到账方式支持先下转账和微信零钱自动转账，手动转账更安全，自动转账更方便"
        >
          <template #reference>
            <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer">
              <QuestionFilled/>
            </el-icon>
          </template>
        </el-popover>
      </el-form-item>
    </el-form>
    <el-button type="primary" :loading="loading" style="margin-left: 150px" @click="submit">保存</el-button>
  </div>
</template>

<script setup>
import ImageSelect from '@/components/ImageSelect.vue'
import {onMounted, reactive, ref} from "vue";
import {getDistSetting,setDistSetting} from "@/request/api/DistributionModule.js";
import {ElMessage} from "element-plus";

const loading = ref(false)
const formRef = ref()
const state = reactive({
  formInline: {
    distribution_open: 1, //分销启用
    spread_banners: [], //分销海报
    store_first_rebate: null, // 一级返佣比例
    store_second_rebate: null, //二级返佣比例
    is_self_brokerage: 1, //自动返佣
    settlement_days: null, //结算时间
    brokerage_method: 'hand', //佣金到账方式
  },
  rules: {
    spread_banners: [{required: true, message: '请选择必填项', trigger: 'blur'}],
    store_first_rebate: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    store_second_rebate: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    settlement_days: [{required: true, message: '请输入必填项', trigger: 'blur'}]
  }
})

const getInfo = async () => {
  let res = await getDistSetting()
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  state.formInline = res.data
}

onMounted(() => {
  getInfo()
})

const submit = () => {
  formRef.value.validate(async isValid => {
    if (!isValid) {
      return ElMessage.error('请输入必填项！')
    }
    loading.value = true
    let res = await setDistSetting(state.formInline)
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

<style scoped lang="less">
.distributionSetting {
  padding: 20px;
  .set-title {
    height: 50px;
    width: 100%;
    border-radius: 5px;
    background-color: #f1f2f5;
    color: #5f5f5f;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
    padding-left: 10px;
    margin: 20px 0;
  }
}
</style>