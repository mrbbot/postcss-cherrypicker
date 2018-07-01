<template>
  <div class="my-class" v-for="i in 4" :title="someVar">
    <h1 class="something-else" @click="$emit('hi')">I'm a heading</h1>
  </div>
</template>

<script>
export default {
  name: "app"
}
</script>

<style>

</style>