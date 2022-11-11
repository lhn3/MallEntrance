<template>
  {{ number.count.toFixed(1) }}
</template>

<script setup>
import {defineProps, onActivated, reactive, watch} from "vue";
import {gsap} from "gsap";

const props = defineProps({
  value: {
    type: Number,
    default: 0
  }
})

const number = reactive({
  count: 0
})

//将number中的count在一定时间内变成某个值
const func = () => {
  gsap.to(number, {
    duration: 0.5,
    count: props.value
  })
}
onActivated(() => {
  func()
})
watch(
    () => props.value,
    () => func(),
    {
      immediate: true
    }
)
</script>

<style scoped>

</style>