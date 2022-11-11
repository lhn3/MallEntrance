<template>
  <div class="buySetting">
    <el-tabs v-model="activeName">
      <el-form ref="formRef" :model="state.formInline" :rules="state.rules" label-width="100px">
        <el-tab-pane label="支付设置" name="payment">
          <el-table height="calc(100vh - 240px)" border :data="state.dataList" style="width: 100%">
            <el-table-column prop="title" label="支付方式">
              <template #default="{ row }">
                <div style="display: flex;padding: 5px;width: 100%">
                  <el-image :src="row.image" fit="cover" style="width: 50px;height: 50px;border-radius: 10px"/>
                  <div style="padding-left: 10px;line-height: 25px;color: #000000;font-size: 14px;width: 100%">
                    <div>{{ row.title }}</div>
                    <div style="font-size: 13px;color: #868686">{{ row.message }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixe="left" width="80px" align="center" header-align="center">
              <template #default="{ row }">
                <el-button type="text" @click="handelClick(row)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="购物设置" name="shopping">
          <el-form-item prop="close_order_minute" label="未支付订单">
            <el-input-number v-model="state.formInline.close_order_minute" :controls="false" :min="0" :precision="0"
                             placeholder="请输入" style="width: 220px"/>
            <div class="unit-tip">分钟后自动关闭</div>
            <el-popover placement="right" title="提示" :width="200" trigger="hover" content="订单下单未付款，n分钟后自动关闭，设置0不自动关闭">
              <template #reference>
                <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer"><QuestionFilled/></el-icon>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item prop="after_sale_day" label="已发货订单">
            <el-input-number v-model="state.formInline.after_sale_day" :controls="false" :min="0" :precision="0"
                             placeholder="请输入" style="width: 220px"/>
            <div class="unit-tip">天后自动确认收货</div>
            <el-popover placement="right" title="提示" :width="200" trigger="hover" content="系统自动完成收货时间，设置0不自动收货">
              <template #reference>
                <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer"><QuestionFilled/></el-icon>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item prop="auto_received_day" label="已完成订单">
            <el-input-number v-model="state.formInline.auto_received_day" :controls="false" :min="0" :precision="0"
                             placeholder="请输入" style="width: 220px"/>
            <div class="unit-tip">天内允许申请售后</div>
            <el-popover placement="right" title="提示" :width="200" trigger="hover" content="订单完成后，用户在n天内可以发起售后申请，设置0不允许申请售后">
              <template #reference>
                <el-icon :size="16" style="margin-left: 10px;color: #9e9e9e;cursor: pointer"><QuestionFilled/></el-icon>
              </template>
            </el-popover>
          </el-form-item>
          <el-button :loading="state.loading" type="primary" style="margin-left: 200px" @click="submit">保存</el-button>
        </el-tab-pane>
      </el-form>
    </el-tabs>

    <PaymentDialog v-model="state.dialogVisible" :detail="state.clickRow" />
  </div>
</template>


<script setup>
import {onMounted, reactive, ref} from "vue";
import {getBaseSetting,setBaseSetting} from '@/request/api/systemSettings.js'
import {ElMessage} from "element-plus";
import alipayImg from '../../../../public/alipay.png'
import wxpayImg from '../../../../public/wepay.png'
import PaymentDialog from './cpns/PaymentDialog.vue'

const activeName = ref('payment')
const formRef = ref()

//表格数据
const state = reactive({
  loading: false,
  dialogVisible: false, //弹窗
  clickRow: {},
  formInline: {
    close_order_minute: 0, //未支付订单自动关闭时间
    after_sale_day: 0, //已发货订单自动确认收货时间
    auto_received_day: 0, //已完成订单允许申请售后时间
  },
  dataList: [
    {type: 'alipay', image: alipayImg, title: '支付宝支付', message: '该系统支持即时到账接口'},
    {type: 'wxpay', image: wxpayImg, title: '微信支付', message: '该系统支持微信网页支付和扫码支付'}
  ],
  rules: {
    close_order_minute: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    after_sale_day: [{required: true, message: '请输入必填项', trigger: 'blur'}],
    auto_received_day: [{required: true, message: '请输入必填项', trigger: 'blur'}]
  }
})

const getInfo = async () => {
  let res = await getBaseSetting()
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  //插入对应数据
  state.dataList[0].alipay = res.data.alipay
  state.dataList[1].wxpay = res.data.wxpay

  state.formInline.close_order_minute = res.data.close_order_minute
  state.formInline.after_sale_day = res.data.after_sale_day
  state.formInline.auto_received_day = res.data.auto_received_day
}

onMounted(() => {
  getInfo()
})

//配置
const handelClick  = row => {
  state.clickRow = row
  state.dialogVisible = true
}

//保存购物设置
const submit = () => {
  formRef.value.validate(async isValid => {
    if (!isValid) return
    state.loading = true
    let res = await setBaseSetting(state.formInline)
    if (res.code !== 200) {
      ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
      await getInfo()
      state.loading = false
      return
    }
    state.loading = false
    ElMessage.success('修改成功~')
  })
}

</script>

<style scoped lang="less">
.buySetting {
  padding: 20px;
}
</style>