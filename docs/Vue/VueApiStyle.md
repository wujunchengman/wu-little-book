---
title: Vue的API风格
---


# Vue的API风格

> Vue目前的版本是3，但是Vue2依然使用广泛，这有点类似与Python2到Python3，也许他们会一直共存很多年

之前说了Vue组件有三个部分：template、style、script

其中script控制着页面逻辑，Vue的API风格指的就是script的写法

## 选项式风格

```vue

<script>
export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      count: 0
    }
  },

  // methods 是一些用来更改状态与触发更新的函数
  // 它们可以在模板中作为事件监听器绑定
  methods: {
    increment() {
      this.count++
    }
  },

  // 生命周期钩子会在组件生命周期的各个不同阶段被调用
  // 例如这个函数就会在组件挂载完成后被调用
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>

```

在选项式API中，数据、方法、生命周期函数都是分门别类的，如果模板中绑定了一个变量，会在`data`中进行查找，如果绑定了一个方法，则会在`methods`中查找，`methods`中的方法可以通过`this`加`data`中的变量名获取到定义的变量进行操作，Vue会在变量的位置找变量，在方法的地方找方法

## 组合式API

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 用来修改状态、触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>

```
组合式API在script标签中添加了一个setup，它是一个标识，告诉Vue这是一个组合式API，应该按照组合式API的处理逻辑进行处理

组合式API不再要求方法放在哪里，变量放在哪里，而是都在`script`标签内，模板中绑定的变量会在`script`中查找声明的变量，模板中绑定的方法会在`script`中查找声明的方法，选项式API中的生命周期函数由直接定义的同名函数变成了传递一个箭头函数

选项式API和组合式API并无本质区别，只是写法上的不同

## 选项式API还是组合式API

在Vue2中，只能使用选项式API，在Vue3中则是可选的，除了选项式API还有组合式API，相对来说，我个人比较喜欢组合式API，因为选项式API中要操作对应的数据，需要用到this，而这个this真的让人困惑；并且组合式API也更随意一些，有谁喜欢被这些条条框框束缚呢