<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>Registrieren</h1>
      <p class="subtitle">Erstelle dein kostenloses Konto</p>

      <form @submit.prevent="register">
        <div class="input-group">
          <label>E-Mail</label>
          <input v-model="email" type="email" placeholder="deine@email.com" required />
        </div>

        <div class="input-group">
          <label>Passwort</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="auth-button">Konto erstellen</button>
      </form>

      <p class="switch-auth">
        Schon ein Konto? <a href="#" @click.prevent="$router.push('/login')">Hier anmelden</a>
      </p>
    </div>
  </div>
</template>

<script>
// HIER: Import der zentralen API-Konfiguration
import { API_BASE_URL } from '@/config/api'

export default {
  name: "RegisterView",
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    async register() {
      try {
        // HIER: Nutze API_BASE_URL und füge den Pfad /auth/register hinzu
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const user = await response.json();

        if (response.ok && user.sessionToken) {
          localStorage.setItem("sessionToken", user.sessionToken);
          localStorage.setItem("userEmail", user.email);

          // Falls das Backend Namen mitschickt, auch diese speichern
          if (user.firstName) localStorage.setItem("userFirstName", user.firstName);
          if (user.lastName) localStorage.setItem("userLastName", user.lastName);

          this.$router.push('/moodtracker');
        } else {
          alert("Registrierung fehlgeschlagen: " + (user.message || "Unbekannter Fehler"));
        }
      } catch (e) {
        console.error(e);
        alert("Serverfehler! Läuft das Backend?");
      }
    }
  }
}
</script>

<style scoped>
/* Dein Style bleibt genau gleich wie vorher */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  padding-top: 80px;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.2);
  text-align: center;
}

h1 {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 2rem;
}

.input-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: #c4b5fd;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 12px 16px;
  background: #0f172a;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #8b5cf6;
}

.auth-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 1rem;
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
}

.switch-auth {
  margin-top: 1.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.switch-auth a {
  color: #a78bfa;
  text-decoration: none;
  font-weight: bold;
}

.switch-auth a:hover {
  text-decoration: underline;
}
</style>
