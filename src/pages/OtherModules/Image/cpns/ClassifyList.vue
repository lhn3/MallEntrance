<template>
  <div class="classify-list">
    <SelectItem v-for="item in state.classify" :key="item.id" :title="item.name"
                @handelEdit="handelEdit(item)"
                @handelDelete="handelDelete(item.id)" :active="item.id === state.selectItemId"
                @handelTitle="handelTitle(item.id)" :is-component="props.isComponent"/>
  </div>
  <div class="classify-pages">
    <el-pagination
        background
        :current-page="state.currentPage"
        :page-size="state.pageSize"
        :total="state.totalCount"
        layout="prev, next"
        @current-change="pageCurrentChangeHandle"
    />
  </div>

  <!--  分类抽屉-->
  <FormDrawer v-model="drawer" :title="formData.title" :loading="loading" @handleClose="drawerClose"
              @onSubmit="drawerSubmit">
    <el-form ref="formRef" :model="formData" :rules="formData.rules" label-width="100px">
      <el-form-item prop="name" label="分类名称：">
        <el-input v-model.trim="formData.name" placeholder="请输入分类名称"/>
      </el-form-item>
      <el-form-item prop="order" label="排序：">
        <el-input-number v-model="formData.order" min="0" precision="0"/>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import SelectItem from '@/components/SelectItem.vue'
import FormDrawer from "@/components/FormDrawer.vue"
import {onMounted, reactive, ref, defineEmits, defineProps} from "vue";
import {messageBox} from "@/utils/message.js";
import {addClassify, delClassify, getImageClassify, updateClassify} from "@/request/api/otherModules.js";
import {ElMessage} from "element-plus";

const props = defineProps({
  isComponent:{
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['handelInfo'])
const drawer = ref(false)
const loading = ref(false)
const formRef = ref(null)
const state = reactive({
  currentPage: 1,
  pageSize: 10,
  selectItemId: null,//被选中的分类id
  classify: [], //分类列表
  totalCount: 0 //分类总数
})
//新增修改分类数据
let formData = reactive({
  title: '',
  id: null,
  name: '',
  order: 0,
  rules: {
    name: {required: true, message: '请输入分类名称', trigger: 'blur'},
    order: {required: true, message: '请输入排序', trigger: 'blur'}
  }
})

//获取分类
const getClassify = async (first = false) => {
  let res = await getImageClassify({page: state.currentPage, limit: state.pageSize})
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  state.classify = res.data.list
  state.totalCount = res.data.totalCount
  //第一次加载需要请求图片和设置id
  if (first) {
    state.selectItemId = state.classify[0].id
    emit('handelInfo', state.selectItemId)
  }
}

//初始化数据
onMounted(() => {
  getClassify(true)
})

// 点击分页
const pageCurrentChangeHandle = val => {
  state.currentPage = val
  getClassify()
}

//分类被点击
const handelTitle = id => {
  if (state.selectItemId === id) return
  state.selectItemId = id
  state.currentPage = 1
  emit('handelInfo', id)
}

//关闭右侧抽屉
const drawerClose = () => {
  formData.title = ''
  formData.id = null
  formData.name = ''
  formData.order = 0
  formRef.value.resetFields()
}

//提交侧抽屉
const drawerSubmit = () => {
  formRef.value.validate(async isValid => {
    if (!isValid) return
    loading.value = true
    let res = formData.id
        ? await updateClassify({id: formData.id, name: formData.name, order: formData.order})
        : await addClassify({name: formData.name, order: formData.order})
    if (res.code !== 200) {
      loading.value = false
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    ElMessage.success(formData.id ? '修改成功~' : '新增成功~')
    //清空数据
    drawerClose()
    loading.value = false
    drawer.value = false
    getClassify()
  })
}

//编辑按钮
const handelEdit = item => {
  formData.title = '修改分类'
  formData.id = item.id
  formData.name = item.name
  formData.order = item.order
  drawer.value = true
}

//删除按钮
const handelDelete = id => {
  messageBox('确认删除？').then(async r => {
    if (!r) return
    let res = await delClassify(id)
    if (res.code !== 200) {
      loading.value = false
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    ElMessage.success('删除成功~')
    getClassify()
  })
}
defineExpose({
  drawer,
  state,
  formData
})
</script>

<style scoped lang="less">
.classify-list {
  overflow: auto;
  overflow-x: hidden;
  height: calc(100% - 50px);
}
.classify-pages {
  height: 50px;
  border-top: 1px solid #eeeeee;
@apply flex items-center justify-center;
}
</style>