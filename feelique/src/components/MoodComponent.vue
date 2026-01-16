<script setup lang="ts">
import { ref } from 'vue';
// --> wenn sich Daten ändern, aktualisiert sich die Webseite automatisch

// Interface für die Mood-Datenstruktur
interface Mood {
  id: number;
  emoji: string;
  name: string;

}

// Array mit verschiedenen Stimmungen
const moods = ref<Mood[]>([
  {
    id: 1,
    emoji: '😊',
    name: 'Glücklich',

  },
  {
    id: 2,
    emoji: '😐',
    name: 'Neutral',
  },
  {
    id: 3,
    emoji: '😢',
    name: 'Traurig',

  },
  {
    id: 4,
    emoji: '😴',
    name: 'Müde',
  },
  {
    id: 5,
    emoji: '😤',
    name: 'Gestresst',
  }
]);

// speichert die ausgewählte Stimmung
// startet mit null
// kann entweder Mood oder null sein
const selectedMood = ref<Mood | null>(null);

// wird aufgerufen wenn mood gewählt wird
// Mood wird in selectedMood gespeichert und in der Konsole ausgegeben
const selectMood = (mood: Mood) => {
  selectedMood.value = mood;
  console.log('Ausgewählte Stimmung:', mood.name);
};
</script>

<template>
  <div class="mood-tracker">
    <h2> Mein Mood Tracker</h2>
    <p class="subtitle">Wie fühlst du dich heute?</p>


    <!-- erstellt für jedes Mood eine Liste  -->

    <!-- v-for = Für jedes Element -->
    <!-- mood = "Nenne das aktuelle Element 'mood'" -->
    <!-- in moods = "...aus dem Array 'moods'" -->
    <!-- :key="mood.id" = "Gib jedem eine eindeutige ID (wichtig für Vue)" -->

    <ul class="mood-list">
      <li
        v-for="mood in moods"
        :key="mood.id"
        class="mood-item"
        @click="selectMood(mood)"
      >
        <span class="mood-emoji">{{ mood.emoji }}</span>
        <div class="mood-info">
          <div class="mood-name">{{ mood.name }}</div>

        </div>
      </li>
    </ul>

    <!-- Zeigt die ausgewählte Stimmung an -->
    <div v-if="selectedMood" class="selected-mood">
      <p>
        Du hast gewählt: <strong>{{ selectedMood.emoji }} {{ selectedMood.name }}</strong>
      </p>
    </div>
  </div>
</template>

<style scoped>
.mood-tracker {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.mood-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mood-item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin: 10px 0;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.mood-item:hover {
  background: #e8f4f8;
  transform: translateX(5px);
}

.mood-emoji {
  font-size: 40px;
  margin-right: 15px;
}

.mood-info {
  flex: 1;
}

.mood-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.mood-description {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.selected-mood {
  margin-top: 20px;
  padding: 15px;
  background: #e8f4f8;
  border-radius: 8px;
  text-align: center;
}

.selected-mood p {
  margin: 0;
  color: #333;
}
</style>
