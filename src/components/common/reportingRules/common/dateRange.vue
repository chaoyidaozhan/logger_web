<template>
  <div>
    <i class="icon-arrow-left"></i>
    <span>{{ start }} 至 {{ end }}</span>
    <i class="icon-arrow-right"></i>
  </div>
</template>

<script>
export default {
  data () {
    return {
      start: '2011-11-11',
      end: '2011-11-11'
    }
  }
}
</script>