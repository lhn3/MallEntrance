<template>
  <div class="imageList" v-show="props.show">
    <template v-if="props.modelValue?.length > 0">
      <div class="image imageControl" v-for="(item,index) in props.modelValue" :key="index">
        <el-image :src=item fit="cover" style="width: 100%;height: 100%"/>
        <div class="cover">
          <el-icon style="cursor: pointer" @click="imageDialog(item)">
            <ZoomIn/>
          </el-icon>
          <el-icon v-if="!props.multiple" style="cursor: pointer" @click="chooseImageVisible = true">
            <Refresh/>
          </el-icon>
          <el-icon style="cursor: pointer" @click="imageDelete(index)">
            <Delete/>
          </el-icon>
        </div>
      </div>
    </template>
    <div class="image imagePlus" style="cursor: pointer" v-if="props.modelValue?.length === 0 || props.multiple"
         @click="chooseImageVisible = true">
      <el-icon>
        <Plus/>
      </el-icon>
    </div>
  </div>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl"/>
  </el-dialog>

  <!--  选择图片弹窗-->
  <el-dialog width="70vw" custom-class="custom-dialog" v-model="chooseImageVisible" title="图片选择">
    <Image v-if="chooseImageVisible" :multiple="multiple" :is-component="true" @chooseImage="chooseImage"/>
    <template #footer>
      <el-button @click="chooseImageVisible = false">取消</el-button>
      <el-button type="primary" v-if="props.multiple" @click="chooseImages">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, defineProps, defineExpose, watch} from "vue";
import Image from '@/pages/OtherModules/Image/Image.vue'
import {Refresh, Plus, ZoomIn, Delete} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  show: {
    type: Boolean,
    default: true
  },
  limit: {
    type: Number,
    default: 9
  }
})
const emit = defineEmits(['update:modelValue'])
const chooseImageVisible = ref(false)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const selectList = ref([]) //多选的值

//上传的头像查看大图
const imageDialog = item => {
  dialogImageUrl.value = item
  dialogVisible.value = true
}

//选择头像
const chooseImage = urlList => {
  if (props.multiple) {
    selectList.value = urlList
  } else {
    emit('update:modelValue', urlList)
    chooseImageVisible.value = false
  }
}

//选择多图片
const chooseImages = () => {
  if (props.show) {
    if ((props.modelValue.length + selectList.value.length) > props.limit) return ElMessage.error(`最多只能添加${props.limit}张图片`)
    emit('update:modelValue', [...props.modelValue, ...selectList.value])
  } else {
    //提交才执行回调
    callback.value(selectList.value)
  }
  chooseImageVisible.value = false
}

//删除头像
const imageDelete = index => {
  let newList = props.modelValue.filter((item, i) => {
    return i !== index
  })
  emit('update:modelValue', newList)
}

//富文本专用回调
const callback = ref(null) //先找个变量接收回调函数
const editorFunc = func => {
  callback.value = func
  chooseImageVisible.value = true
}

watch(
    () => chooseImageVisible.value,
    () => {
      selectList.value = []
    }
)
defineExpose({
  editorFunc
})
</script>

<style scoped lang="less">
.imageList {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.image {
  margin: 0 10px 10px 0;
  width: 150px;
  height: 150px;
  border: 1px dashed #c3c4c8;
  border-radius: 6px;
}
.imagePlus {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6f5f5;
  font-size: 34px;
  color: #aaaaaa;
  cursor: pointer;
}
.imagePlus:hover {
  background-color: #ececec;
  color: #807f7f;
}
.imageControl {
  position: relative;
  overflow: hidden;
  .cover {
    width: 150px;
    height: 150px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 24px;
    display: none;
    justify-content: space-around;
    align-items: center;
    color: #ffffff;
    padding: 0 20px;
  }
}
.imageControl:hover {
  .cover {
    display: flex;
  }
}
</style>