<script setup lang="ts">
import Assess from "./pages/Assess.vue";
</script>

<template>
  <v-app>
    <nav>
      <RouterLink to="/">Assess</RouterLink>
      <RouterLink to="/admin">Admin</RouterLink>
    </nav>
    <v-container>
      <main>
        <RouterView />
      </main>
    </v-container>
  </v-app>
</template>
