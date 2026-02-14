<script setup lang="ts">
import { useI18nStore } from "./stores/i18n";

const i18n = useI18nStore();
</script>

<template>
  <v-app>
    <!-- Premium App Bar -->
    <v-app-bar flat class="border-b px-4" color="white" height="72">
      <v-container class="d-flex align-center pa-0 fill-height" fluid>
        <!-- Logo Section -->
        <div class="d-flex align-center logo-container cursor-pointer" @click="$router.push('/')">
          <div class="logo-box d-flex align-center justify-center mr-3">
            <span class="logo-text">SVA</span>
          </div>
          <div class="d-flex flex-column">
            <span class="text-h6 font-weight-bold line-height-1">SG</span>
            <span class="text-caption font-weight-medium text-grey-darken-1 mt-n1">{{ i18n.t('nav.brand') }}</span>
          </div>
        </div>

        <v-spacer></v-spacer>

        <!-- Navigation Links -->
        <div class="d-none d-sm-flex align-center ga-4 mr-6">
          <v-btn
            to="/"
            variant="text"
            class="nav-link font-weight-bold"
            :active-color="'primary'"
            rounded="xl"
          >
            {{ i18n.t('nav.check') }}
          </v-btn>
          <v-btn
            to="/admin"
            variant="tonal"
            color="primary"
            class="nav-link font-weight-bold"
            rounded="xl"
            prepend-icon="mdi-cog-outline"
          >
            {{ i18n.t('nav.admin') }}
          </v-btn>
        </div>

        <!-- Language Selection -->
        <div class="d-flex align-center ga-1 mr-2">
          <v-btn
            density="compact"
            variant="text"
            :color="i18n.locale === 'de' ? 'primary' : 'grey'"
            class="font-weight-bold text-caption pa-0"
            min-width="32"
            @click="i18n.setLocale('de')"
          >DE</v-btn>
          <span class="text-grey-lighten-1">|</span>
          <v-btn
            density="compact"
            variant="text"
            :color="i18n.locale === 'en' ? 'primary' : 'grey'"
            class="font-weight-bold text-caption pa-0"
            min-width="32"
            @click="i18n.setLocale('en')"
          >EN</v-btn>
        </div>

        <!-- Mobile Menu (Planned/Implicit) -->
        <v-btn icon="mdi-menu" variant="text" class="d-flex d-sm-none"></v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <RouterView />
    </v-main>

    <!-- Simple Footer -->
    <v-footer class="text-center d-flex flex-column bg-white border-t py-4">
      <div class="text-caption text-grey">
        &copy; {{ new Date().getFullYear() }} SVA St.Gallen — Sozialversicherungsanstalt des Kantons St.Gallen
      </div>
    </v-footer>
  </v-app>
</template>

<style>
.logo-box {
  background-color: var(--st-gallen-red);
  color: white;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 1.1rem;
}

.logo-text {
  letter-spacing: -1px;
}

.line-height-1 {
  line-height: 1;
}

.nav-link {
  text-transform: none !important;
  letter-spacing: 0 !important;
  transition: all 0.2s ease-in-out;
}

.v-btn--active::before {
  opacity: 0.05 !important;
}

/* Global hover effect for nav links */
.nav-link:hover {
  transform: translateY(-1px);
}

.border-b {
  border-bottom: 1px solid #e1e1e1 !important;
}

.border-t {
  border-top: 1px solid #e1e1e1 !important;
}
</style>
