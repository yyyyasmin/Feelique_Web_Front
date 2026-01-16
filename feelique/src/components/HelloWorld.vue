<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfuhhhhhlly created a project with
      <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
  </div>
</template>

<style scoped>
main {
  padding: 2rem 2rem 0 2rem; /* etwas Abstand zur Fensterkante */
  width: 100%;
  box-sizing: border-box;
}

/* Ab 1024px NICHT mehr auf Grid umstellen */
@media (min-width: 1024px) {
  main {
    padding: 3rem 3rem 0 3rem;
  }
}
</style>
