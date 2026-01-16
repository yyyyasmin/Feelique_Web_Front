<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

/* =======================
   Interfaces
======================= */
interface Mood {
  id: number
  emoji: string
  name: string
}

interface MoodEntryDto {
  id?: number
  mood: string
  time: string
}

/* =======================
   Emoji Mapping
======================= */
const emojiMap: Record<string, string> = {
  'Glücklich': '😊',
  'Neutral': '😐',
  'Traurig': '😢',
  'Müde': '😴',
  'Gestresst': '😤',
  'Aufgeregt': '🤩',
  'Sauer': '😡',
  'Entspannt': '😌',
  'Gelangweilt': '🥱',
  'Schlecht': '😞'
}

/* =======================
   Mood-Katalog (Frontend)
======================= */
const moods = ref<Mood[]>([
  { id: 1, name: 'Glücklich', emoji: '😊' },
  { id: 2, name: 'Neutral', emoji: '😐' },
  { id: 3, name: 'Traurig', emoji: '😢' },
  { id: 4, name: 'Müde', emoji: '😴' },
  { id: 5, name: 'Gestresst', emoji: '😤' },
  { id: 6, name: 'Aufgeregt', emoji: '🤩' },
  { id: 7, name: 'Sauer', emoji: '😡' },
  { id: 8, name: 'Entspannt', emoji: '😌' },
  { id: 9, name: 'Gelangweilt', emoji: '🥱' },
  { id: 10, name: 'Schlecht', emoji: '😞' }
])

/* =======================
   State
======================= */
const selectedMood = ref<Mood | null>(null)
const savedMoods = ref<MoodEntryDto[]>([])
const hasSavedMood = ref(false)

/* =======================
   Backend URL
======================= */
const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

/* =======================
   GET gespeicherte Moods
======================= */
async function loadSavedMoods() {
  if (!baseUrl) return

  const response: AxiosResponse<MoodEntryDto[]> =
    await axios.get(`${baseUrl}/moods`)

  savedMoods.value = response.data
}

/* =======================
   POST Mood (FINAL)
======================= */
async function saveMoodToBackend(moodName: string) {
  if (!baseUrl) return

  const payload = {
    mood: moodName,
    time: new Date().toISOString()
  }

  await axios.post(`${baseUrl}/moods`, payload)
  await loadSavedMoods()
}

/* =======================
   Klick → EINMAL FINAL
======================= */
const selectMood = async (mood: Mood) => {
  if (hasSavedMood.value) return

  // 🔒 Zustand sofort fixieren
  hasSavedMood.value = true
  selectedMood.value = mood

  try {
    await saveMoodToBackend(mood.name)
  } catch (e) {
    console.error(e)
  }
}

/* =======================
   On Mount
======================= */
onMounted(() => {
  loadSavedMoods()
})
</script>

<template>
  <div class="mood-tracker">
    <h2>Mein Mood Tracker</h2>
    <p class="subtitle">Wie fühlst du dich heute?</p>

    <ul class="mood-list">
      <li
        v-for="mood in moods"
        :key="mood.id"
        class="mood-item"
        :class="{ selected: selectedMood?.id === mood.id }"
        @click="!hasSavedMood && selectMood(mood)"
      >
        <span class="mood-emoji">{{ mood.emoji }}</span>
        <div class="mood-name">{{ mood.name }}</div>
      </li>
    </ul>

    <div v-if="selectedMood" class="selected-mood">
      Du hast gewählt:
      <strong>{{ selectedMood.emoji }} {{ selectedMood.name }}</strong>
    </div>

    <div v-if="hasSavedMood" class="saved-hint">
      ✅ Deine Stimmung wurde gespeichert
    </div>

    <div class="saved-moods" v-if="savedMoods.length">
      <h3>Gespeicherte Einträge</h3>
      <ul>
        <li v-for="(entry, index) in savedMoods" :key="index">
          {{ emojiMap[entry.mood] ?? '❓' }}
          {{ entry.mood }} –
          {{ new Date(entry.time).toLocaleString() }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.mood-tracker {
  max-width: 500px;
  margin: 0 auto;
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  color: #222;
}

.subtitle {
  text-align: center;
  color: #444;
  margin-bottom: 20px;
}

.mood-list {
  list-style: none;
  padding: 0;
}

.mood-item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin: 10px 0;
  background: #f4f4f4;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.mood-item:hover {
  background: #e0f2ff;
}

.mood-item.selected {
  background: #d1f0ff;
  border: 2px solid #4da3ff;
  pointer-events: none; /* 🔒 physisch nicht klickbar */
}

.mood-emoji {
  font-size: 32px;
  margin-right: 15px;
}

.mood-name {
  font-size: 18px;
  font-weight: 600;
}

.selected-mood {
  margin-top: 20px;
  padding: 15px;
  background: #dff1ff;
  border-radius: 8px;
  text-align: center;
}

.saved-hint {
  margin-top: 15px;
  padding: 12px;
  background: #e6ffe6;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
  color: #1a7f1a;
}

.saved-moods {
  margin-top: 30px;
  padding: 20px;
  background: #eee;
  border-radius: 8px;
}

.saved-moods ul {
  list-style: none;
  padding: 0;
}

.saved-moods li {
  padding: 6px 0;
  border-bottom: 1px solid #ccc;
}
</style>
