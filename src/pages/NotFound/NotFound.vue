<template>
  <div class="main">
    <el-result
        icon="warning"
        title="404"
        sub-title="你所访问的页面不存在~"
    >
      <template #extra>
        <el-button type="primary" @click="home">去首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'

const router = useRouter()
const home = () => {
  router.replace('/')
}
</script>

<style scoped>
.main {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
</style>