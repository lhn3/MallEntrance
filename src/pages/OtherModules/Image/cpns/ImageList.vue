<template>
  <div class="main-list">
    <el-row :gutter="20">
      <el-col v-for="item in state.imageList" :key="item.id" :span="6">
        <el-card shadow="hover" :body-style="{ padding: '0px' }" class="image-cart">
          <el-image class="image-cart-image" :src="item.url" fit="cover" :preview-src-list="[item.url]"/>
          <div class="image-cart-title">{{ item.name }}</div>
          <div class="image-cart-btns" v-if="!props.isComponent">
            <el-button type="text" class="image-cart-btn1" @click="rename(item)">重命名</el-button>
            <el-button type="text" class="image-cart-btn2" @click="delImage(item.id)">删除</el-button>
          </div>
          <div class="image-cart-btns" style="cursor:pointer;" @click="chooseImage([item.url])"
               v-if="props.isComponent && !props.multiple">
            <el-button type="text">选择图片</el-button>
          </div>
          <div class="image-cart-btns" style="cursor:pointer;" v-if="props.isComponent && props.multiple">
            <el-checkbox size="large" @change="value => chooseImages(value, item.url)"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div class="main-pages">
    <el-pagination
        background
        :current-page="state.currentPage"
        :page-size="state.pageSize"
        :total="state.totalCount"
        layout="prev, pager, next"
        @current-change="pageCurrentChangeHandle"
    />
  </div>
  <!--    图片抽屉-->
  <FormDrawer v-model="drawer" title="图片上传" :show-btn="false" destroy-on-close close-on-click-modal>
    <el-upload drag action="/api/admin/image/upload" multiple :headers="{token: $store.state.manager.token}"
               :before-upload="beforeUpload" :on-success="uploadSuccess" :on-error="uploadError"
               :data="{image_class_id: state.classifyId}" name="img"
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        拖动文件到这里或者<em>点击上传</em>
      </div>
      <template #file></template>
    </el-upload>
  </FormDrawer>
</template>

<script setup>
import FormDrawer from "@/components/FormDrawer.vue"
import {UploadFilled} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {reactive, ref, defineExpose, defineProps, defineEmits} from "vue";
import {getImageList, renameImage, delImages} from "@/request/api/otherModules.js";
import {ElLoading} from 'element-plus/lib'
import {inputMessageBox, messageBox} from "@/utils/message.js";

const props = defineProps({
  isComponent: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['chooseImageMiddle'])

let bodyLoading = null
const drawer = ref(false)
let state = reactive({
  classifyId: null,
  currentPage: 1,
  pageSize: 10,
  imageList: [], //图片列表
  totalCount: 0, //图片总数
  selectList: [], //多选的图片列表
})

//获取图片列表
const getImage = async (id) => {
  state.selectList = []
  let res = await getImageList({id, page: state.currentPage, limit: state.pageSize})
  if (res.code !== 200) {
    return ElMessage.error(res.msg + '!')
  }
  state.imageList = res.data.list
  state.totalCount = res.data.totalCount
}

// 点击分页
const pageCurrentChangeHandle = val => {
  state.currentPage = val
  getImage(state.classifyId)
}

//重命名
const rename = (item) => {
  inputMessageBox('重命名', item.name).then(async value => {
    if (!value) return
    let res = await renameImage({id: item.id, name: value})
    if (res.code !== 200) {
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    ElMessage.success('重命名成功~')
    getImage(state.classifyId)
  })
}

//删除图片
const delImage = (id) => {
  messageBox('确认删除？').then(async r => {
    if (!r) return
    let res = await delImages({ids: [id]})
    if (res.code !== 200) {
      return ElMessage({
        message: res.msg + '!',
        type: 'error',
        dangerouslyUseHTMLString: true
      })
    }
    ElMessage.success('删除成功~')
    getImage(state.classifyId)
  })
}

//图片上传之前
const beforeUpload = () => {
  bodyLoading = ElLoading.service({
    lock: true,
    text: '正在上传图片...',
    background: 'rgba(0,0,0,0.2)'
  })
  drawer.value = false
}

//图片上传成功
const uploadSuccess = () => {
  bodyLoading?.close()
  ElMessage.success('上传成功！')
  getImage(state.classifyId)
}

//图片上传失败
const uploadError = error => {
  bodyLoading?.close()
  ElMessage.error(JSON.parse(error.message).msg || '上传失败')
}

//单选图片
const chooseImage = (url) => {
  emit('chooseImageMiddle', url)
}

//多选图片
const chooseImages = (value, url) => {
  if (value) {
    state.selectList.push(url)
  } else {
    state.selectList = state.selectList.filter(item => {
      return item !== url
    })
  }
  emit('chooseImageMiddle', state.selectList)
}

defineExpose({
  getImage,
  state,
  drawer
})
</script>

<style scoped lang="less">
.main-list {
  overflow: auto;
  overflow-x: hidden;
  height: calc(100% - 50px);
  .image-cart {
    position: relative;
    margin-bottom: 20px;
    .image-cart-image {
      width: 100%;
      height: 160px;
    }
    .image-cart-title {
      position: absolute;
      top: 130px;
      padding: 0 10px;
      line-height: 30px;
      height: 30px;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .image-cart-btns {
      padding: 10px;
      text-align: center;
      .image-cart-btn1 {
        color: #409dfe;
        margin-right: 20px;
      }
      .image-cart-btn2 {
        color: #f46c6c;
        margin-left: 20px;
      }
    }
  }
}
.main-pages {
  height: 50px;
  border-top: 1px solid #eeeeee;
@apply flex items-center justify-center;
}
</style>