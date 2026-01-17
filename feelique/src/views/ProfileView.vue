<template>
  <div class="profile-page">
    <div class="profile-container">
      <h1>Mein Profil</h1>
      <p class="subtitle">Personalisiere dein Feelique-Konto</p>

      <form @submit.prevent="saveProfile">
        <div class="input-group">
          <label>Vorname</label>
          <input v-model="firstName" type="text" placeholder="Max" />
        </div>

        <div class="input-group">
          <label>Nachname</label>
          <input v-model="lastName" type="text" placeholder="Mustermann" />
        </div>

        <div class="input-group">
          <label>E-Mail</label>
          <input v-model="email" type="email" disabled />
          <small>E-Mail kann nicht geändert werden</small>
        </div>

        <button type="submit" class="save-btn">Speichern</button>
      </form>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
// WICHTIG: Import der zentralen API-URL
import { API_BASE_URL } from '@/config/api'

export default {
  name: "ProfileView",
  data() {
    return {
      email: "",
      firstName: "",
      lastName: "",
      successMessage: ""
    }
  },
  async mounted() {
    await this.loadProfile()
  },
  methods: {
    async loadProfile() {
      try {
        const token = localStorage.getItem("sessionToken")
        // Nutze API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { "X-Session-Token": token }
        })

        if (response.ok) {
          const user = await response.json()
          this.email = user.email
          this.firstName = user.firstName || ""
          this.lastName = user.lastName || ""
        }
      } catch (e) {
        console.error("Fehler beim Laden:", e)
      }
    },

    async saveProfile() {
      try {
        const token = localStorage.getItem("sessionToken")
        // Nutze API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Session-Token": token
          },
          body: JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName
          })
        })

        if (response.ok) {
          const user = await response.json()

          // 1. Im LocalStorage speichern für die Sidebar
          localStorage.setItem("userFirstName", user.firstName || "")
          localStorage.setItem("userLastName", user.lastName || "")

          // 2. Signal an die Sidebar senden (für Echtzeit-Update)
          window.dispatchEvent(new Event('storage-update'))

          this.successMessage = "Profil erfolgreich gespeichert!"
          setTimeout(() => this.successMessage = "", 3000)
        } else {
          alert("Fehler beim Speichern auf dem Server.")
        }
      } catch (e) {
        console.error("Fehler beim Speichern:", e)
        alert("Serverfehler! Läuft das Backend?")
      }
    }
  }
}
</script>

<style scoped>
/* Dein Style bleibt gleich */
.profile-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.profile-container {
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  background: linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

h1 { color: #ffffff; font-size: 2rem; margin-bottom: 0.5rem; }
.subtitle { color: #94a3b8; margin-bottom: 2rem; }
.input-group { text-align: left; margin-bottom: 1.5rem; }
label { display: block; color: #c4b5fd; margin-bottom: 0.5rem; font-size: 0.9rem; }
input { width: 100%; padding: 12px 16px; background: #0f172a; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 10px; color: white; font-size: 1rem; }
input:disabled { opacity: 0.5; cursor: not-allowed; }
small { color: #64748b; font-size: 0.8rem; }
.save-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); border: none; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; margin-top: 1rem; }
.save-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4); }
.success { margin-top: 1rem; color: #10b981; font-weight: bold; text-align: center; }
</style>
