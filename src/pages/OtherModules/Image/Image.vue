<template>
  <el-container class="image-manager">
    <el-header class="image-header" v-if="!props.isComponent">
      <el-button type="success" text bg @click="openDrawer('classify')">新增图片分类</el-button>
      <el-button type="warning" text bg @click="openDrawer('image')">上传图片</el-button>
    </el-header>
    <el-container class="image-container">
      <el-aside class="image-aside" width="250px">
        <ClassifyList ref="classifyRef" @handelInfo="handelInfo" :is-component="props.isComponent"/>
      </el-aside>
      <el-main class="image-main">
        <ImageList ref="imageListRef" :multiple="multiple" :is-component="props.isComponent"
                   @chooseImageMiddle="chooseImageMiddle"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import ClassifyList from './cpns/ClassifyList.vue'
import ImageList from './cpns/ImageList.vue'
import {ref, defineProps, defineEmits} from "vue";

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
const emit = defineEmits(['chooseImage'])
const classifyRef = ref(null)
const imageListRef = ref(null)

//调用获取图片数据
const handelInfo = id => {
  imageListRef.value.state.classifyId = id
  imageListRef.value.getImage(id)
}

//打开右侧抽屉
const openDrawer = type => {
  if (type === 'classify') {
    classifyRef.value.formData.order = classifyRef.value.state.classify[0].order + 1
    classifyRef.value.formData.title = '新增分类'
    classifyRef.value.drawer = true
  } else {
    imageListRef.value.drawer = true
  }
}

const chooseImageMiddle = url => {
  emit('chooseImage', url)
}
</script>

<style scoped lang="less">
.image-manager {
  border: 1px solid #eeeeee;
  height: 100%;
  .image-header {
    height: 70px;
    border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
  }
  .image-container {
    height: calc(100% - 70px);
    .image-aside {
      border-right: 1px solid #eeeeee;
    }
    .image-main {
      padding: 0;
    }
  }
}

</style>