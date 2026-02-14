<script setup lang="ts">
import Assess from "./pages/Assess.vue";
</script>

<template>
  <v-app>
    <nav>
      <RouterLink to="/">Assess</RouterLink>
      <RouterLink to="/admin">Admin</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </v-app>
</template>
