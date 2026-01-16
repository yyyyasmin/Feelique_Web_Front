<template>
  <div>
    <!-- Header -->


    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Verstehe deine Emotionen besser</h1>
        <p>Tracke deine Stimmung täglich und entdecke Muster in deinem emotionalen Wohlbefinden</p>
        <a href="#" class="cta-button" @click.prevent="handleCTA">Jetzt kostenlos starten</a>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <h2>Warum MoodTracker?</h2>
        <div class="feature-grid">
          <div v-for="feature in features" :key="feature.id" class="feature-card">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="how-it-works">
      <div class="container">
        <h2>So funktioniert's</h2>
        <div class="steps">
          <div v-for="step in steps" :key="step.number" class="step">
            <div class="step-number">{{ step.number }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="cta" class="cta-section">
      <div class="container">
        <h2>Bereit, deine Reise zu starten?</h2>
        <p>Schließe dich tausenden zufriedenen Nutzern an, die ihre mentale Gesundheit verbessern</p>
        <a href="#" class="cta-button" @click.prevent="handleCTA">Kostenlos registrieren</a>
        <a href="#" class="cta-button cta-secondary" style="margin-left: 1rem;" @click.prevent="handleLearnMore">Mehr erfahren</a>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="container">
        <p>&copy; 2024 MoodTracker. Alle Rechte vorbehalten.</p>
        <p style="margin-top: 0.5rem; opacity: 0.8;">Datenschutz | AGB | Kontakt</p>
      </div>
    </footer>
  </div>
</template>

<script>
import MoodComponent from "@/components/MoodComponent.vue";

export default {
  name: 'LandingPage',
  components: {MoodComponent},
  data() {
    return {
      features: [
        {
          id: 1,
          icon: '📊',
          title: 'Detaillierte Analysen',
          description: 'Visualisiere deine Stimmungstrends über Tage, Wochen und Monate hinweg'
        },
        {
          id: 2,
          icon: '🔒',
          title: '100% Privat',
          description: 'Deine Daten bleiben sicher und privat. Nur du hast Zugriff darauf'
        },
        {
          id: 3,
          icon: '💡',
          title: 'Persönliche Insights',
          description: 'Erhalte wertvolle Einblicke in deine emotionalen Muster und Trigger'
        },
        {
          id: 4,
          icon: '⏰',
          title: 'Tägliche Erinnerungen',
          description: 'Verpasse keine Einträge mit sanften Erinnerungen zur richtigen Zeit'
        },
        {
          id: 5,
          icon: '📱',
          title: 'Überall verfügbar',
          description: 'Nutze MoodTracker auf allen deinen Geräten - Web, iOS und Android'
        },
        {
          id: 6,
          icon: '🎯',
          title: 'Ziele setzen',
          description: 'Definiere persönliche Ziele und verfolge deinen Fortschritt'
        }
      ],
      steps: [
        {
          number: 1,
          title: 'Registrieren',
          description: 'Erstelle dein kostenloses Konto in weniger als einer Minute'
        },
        {
          number: 2,
          title: 'Stimmung tracken',
          description: 'Trage täglich deine Stimmung und Notizen ein'
        },
        {
          number: 3,
          title: 'Muster erkennen',
          description: 'Analysiere deine Daten und verstehe deine Emotionen besser'
        },
        {
          number: 4,
          title: 'Wachsen',
          description: 'Nutze die Erkenntnisse für dein persönliches Wachstum'
        }
      ]
    }
  },
  methods: {
    handleCTA() {
      // Navigation zur Registrierungsseite
      this.$router.push('/register');
      // oder: window.location.href = '/register';
    },
    handleLearnMore() {
      // Navigation zur Info-Seite
      this.$router.push('/about');
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
header {
  background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%);
  color: white;
  padding: 1rem 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(139, 92, 246, 0.3);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.8rem;
  font-weight: bold;
}

.logo-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #c4b5fd;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #5b21b6 100%);
  color: white;
  padding: 150px 0 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
}

.hero > .container {
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: fadeInUp 1s ease;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeInUp 1s ease 0.2s backwards;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: white;
  padding: 15px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeInUp 1s ease 0.4s backwards;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  cursor: pointer;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.6);
}

/* Features Section */
.features {
  padding: 80px 0;
  background: #1e293b;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #a78bfa;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
  border-color: rgba(139, 92, 246, 0.5);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}

.feature-card h3 {
  color: #c4b5fd;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #cbd5e1;
}

/* How It Works */
.how-it-works {
  padding: 80px 0;
  background: #0f172a;
}

.how-it-works h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #a78bfa;
}

.steps {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
}

.step {
  flex: 1;
  min-width: 250px;
  text-align: center;
}

.step h3 {
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}

.step p {
  color: #94a3b8;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #5b21b6 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
}

.cta-section > .container {
  position: relative;
  z-index: 1;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-secondary {
  background: transparent;
  border: 2px solid #a78bfa;
  color: white;
}

.cta-secondary:hover {
  background: #a78bfa;
  color: #1e1b4b;
  box-shadow: 0 10px 30px rgba(167, 139, 250, 0.4);
}

/* Footer */
footer {
  background: #020617;
  color: #94a3b8;
  padding: 2rem 0;
  text-align: center;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
