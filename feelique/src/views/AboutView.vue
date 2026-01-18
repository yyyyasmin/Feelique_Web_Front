<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Dein emotionales Tagebuch – einfach & sicher</h1>
        <p>Tracke deine Stimmung, füge Notizen hinzu und erkenne Muster in deinem Wohlbefinden mit Feelique.</p>
        <a href="#" class="cta-button" @click.prevent="handleCTA">Jetzt mein Tagebuch starten</a>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <h2>Warum Feelique?</h2>
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
        <h2>Bereit für mehr Achtsamkeit?</h2>
        <p>Starte noch heute damit, deine Emotionen besser zu verstehen und festzuhalten.</p>
        <a href="#" class="cta-button" @click.prevent="handleCTA">Kostenlos registrieren</a>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="container">
        <p>&copy; 2024 Feelique MoodTracker. Alle Rechte vorbehalten.</p>
        <p style="margin-top: 0.5rem; opacity: 0.8;">Privat & Sicher | Made with ❤️</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      features: [
        {
          id: 1,
          icon: '📊',
          title: 'Visueller Kalender',
          description: 'Behalte den Überblick über deinen Monat mit unserer intuitiven Kalenderansicht.'
        },
        {
          id: 2,
          icon: '🔒',
          title: 'Sicherer Login',
          description: 'Deine emotionalen Daten sind durch dein persönliches Konto geschützt und nur für dich einsehbar.'
        },
        {
          id: 3,
          icon: '📝',
          title: 'Notiz-Funktion',
          description: 'Halte fest, warum du dich so fühlst – ergänze jeden Mood-Eintrag mit persönlichen Gedanken.'
        },
        {
          id: 4,
          icon: '📅',
          title: 'Nachträglich eintragen',
          description: 'Vergessen zu tracken? Kein Problem, trage deine Stimmung einfach für vergangene Tage nach.'
        },
        {
          id: 5,
          icon: '🔍',
          title: 'Intelligente Filter',
          description: 'Finde Muster, indem du deinen Kalender nach spezifischen Emotionen filterst.'
        },
        {
          id: 6,
          icon: '⚡',
          title: 'Schnelles Tracking',
          description: 'Wähle deine Stimmung mit nur einem Klick aus – einfach, schnell und effektiv.'
        }
      ],
      steps: [
        {
          number: 1,
          title: 'Konto erstellen',
          description: 'Registriere dich sicher mit deiner E-Mail-Adresse.'
        },
        {
          number: 2,
          title: 'Stimmung wählen',
          description: 'Wähle täglich aus 10 verschiedenen Emojis deine aktuelle Verfassung.'
        },
        {
          number: 3,
          title: 'Details hinzufügen',
          description: 'Ergänze eine optionale Notiz, um den Kontext deines Tages festzuhalten.'
        },
        {
          number: 4,
          title: 'Reflektieren',
          description: 'Nutze den Kalender und die Filter, um deine emotionale Reise zu verstehen.'
        }
      ]
    }
  },
  methods: {
    handleCTA() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
/* Ich habe den CSS-Teil beibehalten, da er bereits sehr gut aussah,
   nur kleine Anpassungen für die Abstände gemacht. */
.about-page {
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #5b21b6 100%);
  padding: 120px 0 80px;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero p {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: white;
  padding: 16px 45px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s;
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
  margin-bottom: 3.5rem;
  color: #a78bfa;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
}

.feature-card {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(139, 92, 246, 0.5);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  color: #c4b5fd;
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

.feature-card p {
  color: #cbd5e1;
  line-height: 1.6;
}

/* How It Works */
.how-it-works {
  padding: 80px 0;
  background: #0f172a;
}

.how-it-works h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 4rem;
  color: #a78bfa;
}

.steps {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 3rem;
}

.step {
  flex: 1;
  min-width: 200px;
  text-align: center;
}

.step-number {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%);
  padding: 100px 0;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

/* Footer */
footer {
  background: #020617;
  color: #94a3b8;
  padding: 3rem 0;
  text-align: center;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

@media (max-width: 768px) {
  .hero h1 { font-size: 2.2rem; }
  .feature-grid { grid-template-columns: 1fr; }
}
</style>
