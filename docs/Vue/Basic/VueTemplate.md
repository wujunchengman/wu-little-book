---
title: 模板
---

# Vue中的模板

Vue使用了template、style、script来定义一个组件，非常类似与原始和Html网页，因此从最开始的原始的Html操作DOM过度到Vue并不费事，也没有多少心智负担

template标签中依然使用Html代码，只是添加了许多的Vue指令的支持，Vue会根据对应的指令，从script和style中绑定对应的变量、计算显示的样式、对DOM进行操作……。这都是由Vue去自动完成的，并且Vue还会对操作进行优化，以尽量减少Dom操作的次数，提升速度

## 一个简单的Vue组件例子
```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(10);

</script>


<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-size: 72px;
  border: 1px red solid;
}
</style>

```
这是前面的Vue单文件组件的例子，在这里面定义了`template`，`template`中定义了一个button，button绑定了click事件和button的文本内容，文本内容使用双大括号绑定了script中声明的响应式变量count；click事件则是每次点击都给count的值+1

如果不使用Vue，就需要绑定Button的Click事件，然后在Click事件处理函数中去更改变量，然后又根据变量的值去改变DOM，使用Vue，只需要改变变量的值就行了，Vue会帮你处理好变量的值与页面的显示的

## 模板语法
