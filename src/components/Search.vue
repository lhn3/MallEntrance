<template>
  <div>
    <el-collapse-transition>
      <div ref="searchRef" v-show="showSearch">
        <div class="sub-search">
          <div class="search-item">
            <slot name="search"/>
          </div>
          <div class="search-btn">
            <el-button type="primary" @click="emit('search')">搜索</el-button>
            <el-button @click="emit('reset')">重置</el-button>
          </div>
        </div>
      </div>
    </el-collapse-transition>
    <div ref="btnRef" class="sub-button" v-show="showButton">
      <div>
        <slot name="button"/>
      </div>
      <div>
        <el-tooltip effect="dark" content="刷新" placement="top-start">
          <el-button type="text" style="font-size: 16px" :icon="Refresh" @click="emit('refresh')"/>
        </el-tooltip>
        <div style="display: inline-block;margin-left: 10px" v-if="!!slots.search">
          <el-button type="text" @click="showSearch = false" v-if="showSearch">收起&ensp;<el-icon>
            <ArrowUp/>
          </el-icon>
          </el-button>
          <el-button type="text" @click="showSearch = true" v-if="!showSearch">展开&ensp;<el-icon>
            <ArrowDown/>
          </el-icon>
          </el-button>
        </div>
      </div>
    </div>
    <div class="sub-table">
      <slot name="table"/>
    </div>
    <div ref="pagRef" class="sub-pagination">
      <slot name="pagination"/>
    </div>
  </div>
</template>

<script setup>
import {defineEmits, onMounted, ref, useSlots, watch, defineProps, nextTick} from "vue";
import {Refresh} from '@element-plus/icons-vue'
import {useResizeObserver} from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  subtractHeight: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['reset', 'search', 'refresh', 'update:modelValue'])
const slots = useSlots()
const showSearch = ref(false)
const showButton = ref(false)

const searchRef = ref()
const btnRef = ref()
const pagRef = ref()

const searchHeight = ref(0)
const otherHeight = ref(0) //除了表格的高度
const tableHeights = ref(0) //除了表格的高度

// 计算表格高度
const calculation = () => {
  // height: calc(100vh - 182px);啥也没有也要减去182

  searchHeight.value = searchRef.value.offsetHeight //记录搜索高度
  otherHeight.value  = searchRef.value.offsetHeight + btnRef.value.offsetHeight + pagRef.value.offsetHeight
  tableHeights.value = `calc(100vh - 182px - ${otherHeight.value}px - ${props.subtractHeight}px)`
  console.log(tableHeights.value)
  emit('update:modelValue', tableHeights.value)
}

onMounted(() => {
  showSearch.value = !!slots.search
  showButton.value = !!slots.button

  // 计算表格高度
  nextTick(() => {
    calculation()
  })
})

watch(
    () => showSearch.value,
    newValue => {
      if (newValue) {
        otherHeight.value += searchHeight.value
      } else {
        otherHeight.value -= searchHeight.value
      }
      console.log(otherHeight.value)
    }
)

//改变页面大小
useResizeObserver(searchRef, () => {
  calculation()
})

</script>

<style scoped lang="less">
.sub-search {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .search-item {
    display: flex;
    flex-wrap: wrap;
    :deep(.el-form-item) {
      margin-right: 20px;
      :deep(.el-input__wrapper) {
        width: 200px;
      }
    }
  }
  .search-btn {
    display: flex;
    height: 50px;
    width: 140px;
  }
}
.sub-button {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}
.sub-table {
  width: 100%;
}
.sub-pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>