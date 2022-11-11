<template>
  <el-dialog custom-class="custom-dialog" v-model="props.modelValue" @close="cancel">
    <template #header>商品规格</template>
    <el-form :rules="[]">
      <el-form-item label="规格类型">
        <el-radio-group v-model="state.skuType">
          <el-radio :label="0" border>单规格</el-radio>
          <el-radio :label="1" border>多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="state.skuType === 0">
        <el-form-item label="市场价格">
          <el-input-number :controls="false" :min="0" :precision="2" v-model="state.skuValue.oprice"
                           style="width: 200px"
                           placeholder="请输入"/>
          <div class="unit-tip">元</div>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input-number :controls="false" :min="0" :precision="2" v-model="state.skuValue.pprice"
                           style="width: 200px"
                           placeholder="请输入"/>
          <div class="unit-tip">元</div>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input-number :controls="false" :min="0" :precision="2" v-model="state.skuValue.cprice"
                           style="width: 200px"
                           placeholder="请输入"/>
          <div class="unit-tip">元</div>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input-number :controls="false" :min="0" :precision="2" v-model="state.skuValue.weight"
                           style="width: 200px"
                           placeholder="请输入"/>
          <div class="unit-tip">kg</div>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input-number :controls="false" :min="0" :precision="2" v-model="state.skuValue.volume"
                           style="width: 200px"
                           placeholder="请输入"/>
          <div class="unit-tip">m²</div>
        </el-form-item>
      </div>

      <div v-else>
        <el-form-item label="添加规格">
          <div class="add-sku">
            <el-card shadow="never" class="box-card" v-for="(item,index) in state.goodsSkusCard" :key="index">
              <template #header>
                <div class="card-header">
                  <el-input v-model="item.name" style="width: 160px;" @change="changeSkuName(item)">
                    <template #append>
                      <!--弹出规格框-->
                      <el-popover placement="right" :width="300" trigger="click"
                                  style="height: 200px; overflow-y: auto">
                        <template #reference>
                          <el-icon style="width: 34px;height: 32px">
                            <MoreFilled/>
                          </el-icon>
                        </template>
                        <!--弹出规格框tab-->
                        <el-tabs v-model="activeName">
                          <el-tab-pane :label="skuItem.name" :name="skuItem.name" v-for="skuItem in skuList"
                                       :key="skuItem.id">
                            <el-tag
                                v-for="(tag, i) in skuItem.default"
                                :key="i"
                                style="margin: 3px; cursor: pointer"
                                :value="tag"
                                :label="tag"
                                @click="handleSku(item, tag)"
                            >
                              {{ tag }}
                            </el-tag>
                          </el-tab-pane>
                        </el-tabs>
                      </el-popover>
                    </template>
                  </el-input>

                  <!--头部右侧按钮-->
                  <div class="header-icon">
                    <el-icon :class="{'dis-icon': index === 0}" @click="changeIndex('up',index)">
                      <Top/>
                    </el-icon>
                    <el-icon :class="{'dis-icon': index === state.goodsSkusCard.length - 1}"
                             @click="changeIndex('down',index)">
                      <Bottom/>
                    </el-icon>
                    <el-icon @click="delMoreSku(item.id, index)">
                      <Delete/>
                    </el-icon>
                  </div>
                </div>
              </template>

              <!--内容标签-->
              <el-tag
                  v-for="(sku,indey) in item.goods_skus_card_value"
                  :key="sku.id"
                  type="success"
                  closable
                  :disable-transitions="false"
                  @close="delSku(item.goods_skus_card_value,indey)"
                  style="margin: 0 10px 10px 0"
                  effect="plain"
              >
                {{ sku.value }}
              </el-tag>
              <el-input
                  v-if="inputVisible === index"
                  :ref="`inputRef${index}`"
                  v-model.trim="inputValue"
                  size="small"
                  @keyup.enter="handleSku(item)"
                  @blur="handleSku(item)"
                  style="width: 80px"
                  maxlength="10"
              />
              <el-button v-else size="small" @click="showInput(index)">+ 规格值</el-button>
            </el-card>
            <el-button class="add-sku-btn" type="success" :loading="loading" size="small" style="width: 70px"
                       @click="addNewSku">添加规格
            </el-button>
          </div>
        </el-form-item>

        <!--表格内容-->
        <el-form-item label="规格设置">
          <el-table border :data="state.goodsSkusTable" style="width: 600px">
            <el-table-column label="商品规格" header-align="center" align="center" min-width="200">
              <el-table-column :label="item.name" header-align="center" align="center"
                               v-for="(item,index) in state.goodsSkusTable[0].skus">
                <template #default="{ row }">
                  {{ row.skus[index]?.value }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="sale_count" label="销售价" header-align="center" align="center" min-width="100">
              <template #default="{ row }">
                <el-input-number style="width: 100%" :controls="false" :precision="2" :min="0" v-model="row.pprice"
                                 @blur="row.pprice ? '' : row.pprice = 0"/>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="市场价" header-align="center" align="center" min-width="100">
              <template #default="{ row }">
                <el-input-number style="width: 100%" :controls="false" :precision="2" :min="0" v-model="row.oprice"
                                 @blur="row.oprice ? '' : row.oprice = 0"/>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="成本价" header-align="center" align="center" min-width="100">
              <template #default="{ row }">
                <el-input-number style="width: 100%" :controls="false" :precision="2" :min="0" v-model="row.cprice"
                                 @blur="row.cprice ? '' : row.cprice = 0"/>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" header-align="center" align="center" min-width="100">
              <template #default="{ row }">
                <el-input-number style="width: 100%" :controls="false" :precision="0" :min="0" v-model="row.stock"
                                 @blur="row.stock ? '' : row.stock = 0"/>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="体积" header-align="center" align="center" min-width="100">
              <template #default="{ row }">
                <el-input-number style="width: 100%" :controls="false" :precision="2" :min="0" v-model="row.weight"
                                 @blur="row.weight ? '' : row.weight = 0"/>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="重量" header-align="center" align="center" min-width="100">
              <template #default="{ row }">
                <el-input-number style="width: 100%" :controls="false" :precision="2" :min="0" v-model="row.volume"
                                 @blur="row.volume ? '' : row.volume = 0"/>
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="编码" header-align="center" align="center" min-width="100">
              <template #default="{ row }">
                <el-input v-model="row.code" style="text-align: center;width: 100%"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button :loading="loading" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {defineProps, defineEmits, ref, watch, reactive, nextTick, getCurrentInstance, onActivated} from "vue";
import {
  addGoodsMoreSku,
  updateGoodsSku,
  updateGoodsMoreSkuName,
  deleteGoodsMoreSku,
  sortGoodsMoreSku,
  createGoodsMoreSkuValue,
  deleteGoodsMoreSkuValue,
  getSkuList
} from '@/request/api/goodManagement.js'
import {ElMessage} from "element-plus";
import {messageBox} from "@/utils/message.js";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  skuObj: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue', 'refresh'])
const skuList = ref([])
const activeName = ref(null)
const loading = ref(false)
const inputValue = ref('')
const inputVisible = ref(null)
const {proxy} = getCurrentInstance()

const state = reactive({
  id: null,
  skuType: 0,
  skuValue: { //单规格数据
    // oprice: '',
    // pprice: '',
    // cprice: '',
    // weight: '',
    // volume: ''
  },
  goodsSkusCard: [],  //多规格规格数据
  goodsSkusTable: []  //多规格表格数据
})

watch(
    () => props.skuObj,
    () => {
      if (props.skuObj) {
        state.id = props.skuObj.id
        state.skuType = props.skuObj.skuType ? 1 : 0
        state.skuValue = props.skuObj.skuValue ? JSON.parse(JSON.stringify(props.skuObj.skuValue)) : {}
        state.goodsSkusCard = props.skuObj.goodsSkusCard ? JSON.parse(JSON.stringify(props.skuObj.goodsSkusCard)) : []
        state.goodsSkusTable = props.skuObj.goodsSkusTable ? JSON.parse(JSON.stringify(props.skuObj.goodsSkusTable)) : []
      }
    },
    {
      immediate: true,
      deep: true
    }
)

//获取sku列表
const getSku = async () => {
  const res = await getSkuList()
  if (res.code !== 200) {
    loading.value = false
    return ElMessage({
      message: res.msg + '!',
      type: 'error',
      dangerouslyUseHTMLString: true
    })
  }
  skuList.value = res.data.list.map(item => {
    return {
      id: item.id,
      name: item.name,
      default: item.default.split(',')
    }
  })
  activeName.value = skuList.value[0].name
}

onActivated(async () => {
  getSku()
})

//关闭右侧抽屉
const cancel = () => {
  emit('update:modelValue')
}

//添加规格
const addNewSku = async () => {
  const res = await addGoodsMoreSku({goods_id: state.id, type: 0, name: '规格名称', order: 50})
  if (res.code !== 200) {
    loading.value = false
    return ElMessage({
      message: res.msg + '!',
      type: 'error',
      dangerouslyUseHTMLString: true
    })
  }
  state.goodsSkusCard.push({...res.data, goods_skus_card_value: []})
  loading.value = false
  ElMessage.success('添加规格成功~')
  emit('refresh')
}

//修改规格名称
const changeSkuName = async item => {
  const res = await updateGoodsMoreSkuName({id: item.id, goods_id: item.goods_id, name: item.name, type: 0, order: 50})
  if (res.code !== 200) {
    emit('refresh')
    return ElMessage({
      message: res.msg + '!',
      type: 'error',
      dangerouslyUseHTMLString: true
    })
  }
  ElMessage.success('修改成功~')
  emit('refresh')
}

//删除多规格
const delMoreSku = (id, index) => {
  messageBox('确认删除？').then(async r => {
    if (!r) return
    let res = await deleteGoodsMoreSku(id)
    if (res.code !== 200) {
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    state.goodsSkusCard.splice(index, 1)
    ElMessage.success('删除成功~')
    emit('refresh')
  })
}

//向上向下调换位置
const changeIndex = async (type, index) => {
  let newCard = JSON.parse(JSON.stringify(state.goodsSkusCard))
  if (type === 'up') {
    if (index === 0) return
    //删除前一个值并同时将此位置的值插入到前一个位置(相当于将前一个位置的值变成自己)，再将删除的值赋值给当前位置，实现此位置前移
    newCard[index] = newCard.splice(index - 1, 1, newCard[index])[0]
  } else {
    if (index === state.goodsSkusCard.length - 1) return
    //删除后一个值并同时将此位置的值插入到后一个位置(相当于将后一个位置的值变成自己)，再将删除的值赋值给当前位置，实现此位置后移
    newCard[index] = newCard.splice(index + 1, 1, newCard[index])[0]
  }

  //后台需要的数据格式
  let formData = newCard.map((item, ind) => {
    return {
      id: item.id,
      order: ind + 1
    }
  })

  //发送请求，成功了再改变原来的数组
  const res = await sortGoodsMoreSku({sortdata: formData})
  if (res.code !== 200) {
    return ElMessage({
      message: res.msg + '!',
      type: 'error',
      dangerouslyUseHTMLString: true
    })
  }
  state.goodsSkusCard = newCard
  emit('refresh')
}

//显示输入框并获取焦点
const showInput = index => {
  inputVisible.value = index
  nextTick(() => {
    proxy.$refs[`inputRef${index}`][0].input.focus()
  })
}

//新增sku值,或选择某个sku
const handleSku = async (item, value = null) => {
  if (inputValue.value || value) {
    const res = await createGoodsMoreSkuValue({
      goods_skus_card_id: item.id,
      name: item.name,
      order: 50,
      value: value ? value : inputValue.value
    })
    if (inputValue.value) inputValue.value = ''
    if (res.code !== 200) {
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    item.goods_skus_card_value.push(res.data)
    emit('refresh')
    ElMessage.success('添加成功~')
  }
  inputVisible.value = null
}

//删除sku值
const delSku = async (item, index) => {
  const res = await deleteGoodsMoreSkuValue(item[index].id)
  if (res.code !== 200) {
    return ElMessage({
      message: res.msg + '!',
      type: 'error',
      dangerouslyUseHTMLString: true
    })
  }
  item.splice(index, 1)
  emit('refresh')
  ElMessage.success('删除成功~')
}

const submit = async () => {
  loading.value = true
  const res = await updateGoodsSku({
    id: state.id,
    sku_type: state.skuType,
    sku_value: state.skuValue
  })
  if (res.code !== 200) {
    loading.value = false
    return ElMessage({
      message: res.msg + '!',
      type: 'error',
      dangerouslyUseHTMLString: true
    })
  }
  loading.value = false
  ElMessage.success('商品规格修改成功~')
  emit('update:modelValue')
  emit('refresh')
}

</script>

<style scoped lang="less">
:deep(.el-card__header), :deep(.el-card__body) {
  width: 600px;
  padding: 10px;
}
.add-sku {
  display: flex;
  flex-direction: column;
  .box-card {
    margin-bottom: 10px;
    .card-header {
      display: flex;
      justify-content: space-between;
      .header-icon {
        width: 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #3f9dfe;
        cursor: pointer;
      }
      .dis-icon {
        cursor: not-allowed;
        color: #aaaaaa;
      }
    }
  }
  .add-sku-btn {
  }
}
:deep(.el-input-group__append) {
  padding: 0;
  cursor: pointer;
}
</style>