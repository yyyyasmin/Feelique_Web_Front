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
  note?: string
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
const hasVotedToday = ref(false)
const note = ref('')
const loading = ref(false)

/* =======================
   Backend URL
======================= */
const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL

/* =======================
   GET gespeicherte Moods (mit Token)
======================= */
async function loadSavedMoods() {
  if (!baseUrl) return
  const token = localStorage.getItem("sessionToken")
  if (!token) return

  try {
    const response: AxiosResponse<MoodEntryDto[]> = await axios.get(
      `${baseUrl}/moods`,
      {
        headers: {
          "X-Session-Token": token
        }
      }
    )
    savedMoods.value = response.data

    // NEU: Prüfen, ob heute schon ein Eintrag existiert
    checkIfVotedToday()
  } catch (e: any) {
    if (e.response?.status === 401) {
      localStorage.removeItem("sessionToken")
      window.location.href = "/login"
    }
  }
}

/* =======================
   NEU: Prüfen ob heute schon abgestimmt
======================= */
function checkIfVotedToday() {
  const today = new Date().toISOString().split('T')[0]
  hasVotedToday.value = savedMoods.value.some(entry => {
    const entryDate = new Date(entry.time).toISOString().split('T')[0]
    return entryDate === today
  })
}

/* =======================
   POST Mood (mit Token)
======================= */
async function saveMoodToBackend(moodName: string) {
  if (!baseUrl) return
  const token = localStorage.getItem("sessionToken")
  if (!token) {
    alert("Bitte logge dich zuerst ein!")
    window.location.href = "/login"
    return
  }

  const payload = {
    mood: moodName,
    time: new Date().toISOString(),
    note: note.value
  }

  loading.value = true

  try {
    await axios.post(`${baseUrl}/moods`, payload, {
      headers: {
        "X-Session-Token": token
      }
    })
    await loadSavedMoods()
    hasVotedToday.value = true
    alert("✅ Mood für heute gespeichert!")
  } catch (e: any) {
    if (e.response?.status === 401) {
      alert("Sitzung abgelaufen.")
      window.location.href = "/login"
    } else if (e.response?.status === 400) {
      // Backend sagt: Heute schon abgestimmt oder Zukunft
      alert(e.response.data || "Du hast heute bereits abgestimmt!")
      hasVotedToday.value = true
    } else {
      alert("Fehler beim Speichern")
    }
  } finally {
    loading.value = false
  }
}

/* =======================
   Klick-Logik
======================= */
const selectMood = (mood: Mood) => {
  if (hasVotedToday.value) {
    alert("Du hast heute bereits abgestimmt! Lösche den Eintrag im Kalender, um neu zu wählen.")
    return
  }
  selectedMood.value = mood
}

const saveSelectedMood = async () => {
  if (!selectedMood.value || hasVotedToday.value || loading.value) return
  try {
    await saveMoodToBackend(selectedMood.value.name)
  } catch (e) {
    console.error(e)
  }
}

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
        @click="selectMood(mood)"
      >
        <span class="mood-emoji">{{ mood.emoji }}</span>
        <div class="mood-name">{{ mood.name }}</div>
      </li>
    </ul>

    <div v-if="selectedMood" class="selected-mood">
      Du hast gewählt:
      <strong>{{ selectedMood.emoji }} {{ selectedMood.name }}</strong>
    </div>

    <div v-if="selectedMood && !hasVotedToday" class="note-section">
      <label for="note">Notiz (optional):</label>
      <textarea
        id="note"
        v-model="note"
        rows="3"
        placeholder="Möchtest du etwas zu deiner Stimmung aufschreiben?"
      ></textarea>

      <button
        @click="saveSelectedMood"
        class="save-button"
        :disabled="hasVotedToday || loading"
      >
        {{ hasVotedToday ? '✓ Heute bereits gespeichert' : 'Stimmung & Notiz speichern' }}
      </button>
    </div>

    <div v-if="hasVotedToday" class="saved-hint">
      ✅ Du hast heute bereits abgestimmt
    </div>

    <div class="saved-moods" v-if="savedMoods.length">
      <h3>Gespeicherte Einträge</h3>
      <ul>
        <li v-for="(entry, index) in savedMoods" :key="index">
          {{ emojiMap[entry.mood] ?? '❓' }}
          {{ entry.mood }} –
          {{ new Date(entry.time).toLocaleString() }}
          <span v-if="entry.note" class="note-text">
            <br>💬 {{ entry.note }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.mood-tracker {
  max-width: 800px;
  margin: 100px auto 40px;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  color: #e2e8f0;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.mood-tracker h2 {
  text-align: center;
  color: #c4b5fd;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(139, 92, 246, 0.4);
}

.subtitle {
  text-align: center;
  color: #cbd5e1;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.mood-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #2d2463 0%, #3d2f7a 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(139, 92, 246, 0.2);
  min-height: 120px;
}

.mood-item:hover {
  background: linear-gradient(135deg, #3d2f7a 0%, #4c1d95 100%);
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  border-color: rgba(139, 92, 246, 0.5);
}

.mood-item.selected {
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  border: 2px solid #a78bfa;
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.6);
  pointer-events: none;
  transform: scale(1.05);
}

.mood-emoji {
  font-size: 48px;
  margin-bottom: 10px;
}

.mood-name {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  text-align: center;
}

.selected-mood {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%);
  border-radius: 12px;
  text-align: center;
}

.note-section {
  margin-top: 20px;
  padding: 20px;
  background: rgba(30, 27, 75, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.note-section textarea {
  width: 100%;
  padding: 12px;
  background: #0f172a;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  color: white;
  margin-bottom: 15px;
}

.save-button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.saved-moods {
  margin-top: 40px;
  padding: 25px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
}

.saved-moods li {
  padding: 12px;
  margin: 8px 0;
  background: rgba(30, 27, 75, 0.5);
  border-radius: 8px;
  border-left: 3px solid #8b5cf6;
}

.note-text {
  display: block;
  margin-top: 8px;
  color: #cbd5e1;
  font-style: italic;
}

.saved-hint {
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #065f46 0%, #047857 100%);
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
  color: #d1fae5;
  border: 1px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
}

@media (max-width: 768px) {
  .mood-tracker {
    margin: 80px 20px 40px;
    padding: 25px;
    max-width: 100%;
  }

  .mood-list {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .mood-item {
    padding: 15px;
    min-height: 100px;
  }

  .mood-emoji {
    font-size: 36px;
  }

  .mood-name {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .mood-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
</style>
