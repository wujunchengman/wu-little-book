---
title: Vue单文件组件
---

# Vue单文件组件


早些年的前端代码，Html、CSS、JavaScript都是在一个文件的，后来随着页面的内容越来越丰富，样式越来越复杂，便习惯将Html、CSS、JavaScript代码分开存放，这是一种低耦合思想的具体实践，对代码的维护有积极作用

随着前端的不断发展，页面的复杂度进一步提高，即使将Html、CSS、JavaScript分开存放，依然非常的难以管理，又随着前端模块化与打包工具发展，页面可以被分割成一块一块的小组件，不用再将所有的放在一起，而分割后的小组件本身变得不再复杂，且功能专一，因此再将一个小组件分为Html、CSS、JavaScript多个文件反而不利于开发与维护，于是Vue中提出了Vue单文件组件，将Html、CSS、JavaScript放在一起，这是一种高内聚的具体实践，至于评价则需要经过时间的检验

> 以上的介绍均来自个人臆想，看个乐子


Vue单文件组件以`.vue`为后缀，将一个组件的模板、样式、逻辑封装在同一个文件里

```vue

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

```

template是组件的模板，类似于原生网页的Html，决定页面的组件，绑定对应的数据与操作事件，style决定样式，script决定了行为逻辑，具体的用法与写法后面细说