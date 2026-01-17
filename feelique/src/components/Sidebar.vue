<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)
const userEmail = ref('')
const userFirstName = ref('') // NEU: Variable für den Vornamen
const userLastName = ref('') // NEU: Variable für den Nachnamen

// Funktion zum Prüfen des Login-Status
const checkLogin = () => {
  const token = localStorage.getItem('sessionToken')
  isLoggedIn.value = !!token

  if (isLoggedIn.value) {
    userEmail.value = localStorage.getItem('userEmail') || 'User'
    userFirstName.value = localStorage.getItem('userFirstName') || ''
    userLastName.value = localStorage.getItem('userLastName') || ''
  }
}

// Prüfe bei jedem Seitenwechsel
watch(() => route.path, () => {
  checkLogin()
}, { immediate: true })

onMounted(() => {
  checkLogin()

  // NEU: Höre auf Profil-Updates
  window.addEventListener('storage-update', () => {
    console.log("✅ Sidebar: Profil wurde aktualisiert!")
    checkLogin()
  })

  // Optional: Reagiere auch auf Storage-Änderungen aus anderen Tabs
  window.addEventListener('storage', checkLogin)
})

const logout = () => {
  localStorage.removeItem('sessionToken')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userFirstName')
  localStorage.removeItem('userLastName')
  isLoggedIn.value = false
  userEmail.value = ''
  userFirstName.value = ''
  userLastName.value = ''
  router.push('/login')
}

// Computed: Zeige Vorname oder E-Mail-Teil
const displayName = () => {
  if (userFirstName.value) {
    return userFirstName.value
  }
  return userEmail.value.split('@')[0]
}
</script>

<template>
  <nav class="sidebar">
    <div class="logo">
      <span class="logo-icon">🐾</span>
      Feelique
    </div>

    <div class="nav-links">
      <router-link to="/" class="nav-link">
        <span class="icon">🏠</span>
        Home
      </router-link>
      <router-link to="/about" class="nav-link">
        <span class="icon">ℹ️</span>
        About
      </router-link>

      <!-- Nur sichtbar wenn eingeloggt -->
      <router-link v-if="isLoggedIn" to="/moodtracker" class="nav-link">
        <span class="icon">😊</span>
        MoodTracker
      </router-link>

      <!-- NEU: Link zur Profil-Seite -->
      <router-link v-if="isLoggedIn" to="/profile" class="nav-link">
        <span class="icon">⚙️</span>
        Profil
      </router-link>
    </div>

    <div class="auth-area">
      <!-- Profil-Badge -->
      <div v-if="isLoggedIn" class="user-profile">
        <div class="avatar">
          {{ (displayName() || 'U').substring(0, 1).toUpperCase() }}
        </div>
        <div class="user-info">
          <span class="user-name">{{ displayName() }}</span>
          <span class="user-status">● Online</span>
        </div>
      </div>

      <router-link v-if="!isLoggedIn" to="/login" class="login-btn">
        Anmelden
      </router-link>
      <router-link v-if="!isLoggedIn" to="/register" class="register-btn">
        Registrieren
      </router-link>
      <button v-else @click="logout" class="logout-btn">
        Abmelden
      </button>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(139, 92, 246, 0.3);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #c4b5fd;
  margin-bottom: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-shadow: 0 2px 10px rgba(139, 92, 246, 0.4);
}

.logo-icon {
  font-size: 2rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.nav-link {
  color: #cbd5e1;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 500;
}

.nav-link .icon {
  font-size: 1.3rem;
}

.nav-link:hover {
  background: rgba(139, 92, 246, 0.2);
  color: #c4b5fd;
  transform: translateX(5px);
}

.nav-link.router-link-active {
  background: rgba(139, 92, 246, 0.3);
  color: #c4b5fd;
  border-left: 3px solid #8b5cf6;
}

.auth-area {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 12px;
  margin-bottom: 10px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  font-size: 0.7rem;
  color: #10b981;
}

.logout-btn, .login-btn, .register-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
  text-align: center;
}

.logout-btn {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
}

.login-btn {
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
}

.login-btn:hover {
  background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.register-btn {
  background: rgba(139, 92, 246, 0.2);
  color: #c4b5fd;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.register-btn:hover {
  background: rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}
</style>
