<template>
  <div class="home-info">
    <!--  头部开篇数据-->
    <TopCart v-permission="['getStatistics1,GET']"/>
    <!--  中间导航-->
    <TabCart/>
    <!--  可视化数据 -->
    <EchartsCart/>
  </div>
</template>

<script setup>
import TopCart from './cpns/TopCart.vue'
import TabCart from './cpns/TabCart.vue'
import EchartsCart from './cpns/EchartsCart.vue'
</script>

<style scoped lang="less">
.home-info {
  padding-top: 10px;
  //height: 100%;
  background-color: #f1f2f5;
}
</style>