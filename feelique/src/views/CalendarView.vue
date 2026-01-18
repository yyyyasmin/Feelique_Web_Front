<template>
  <div class="calendar-page">
    <div class="calendar-container">
      <div class="calendar-header">
        <button @click="previousMonth" class="nav-btn">◀</button>
        <h2>{{ monthName }} {{ currentYear }}</h2>
        <button @click="nextMonth" class="nav-btn">▶</button>
      </div>

      <!-- NEU: Filter-Leiste -->
      <div class="filter-bar">
        <span class="filter-label">Filtern nach:</span>
        <div class="filter-options">
          <button
            class="filter-chip"
            :class="{ active: filterMood === '' }"
            @click="filterMood = ''"
          >
            Alle
          </button>
          <button
            v-for="mood in availableMoods"
            :key="mood"
            class="filter-chip"
            :class="{ active: filterMood === mood }"
            @click="filterMood = (filterMood === mood ? '' : mood)"
          >
            {{ getMoodEmoji(mood) }}
          </button>
        </div>
      </div>

      <div class="calendar-grid">
        <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>

        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="calendar-day"
          :class="{
            'has-mood': day.mood,
            'other-month': !day.isCurrentMonth,
            'is-future': isFutureDate(day.date),
            'is-filtered': day.isFiltered
          }"
          :style="day.mood ? { backgroundColor: getMoodColor(day.mood) } : {}"
          @click="showMoodDetails(day)"
        >
          <span class="day-number">{{ day.dayNumber }}</span>
          <span v-if="day.mood" class="mood-emoji">{{ getMoodEmoji(day.mood) }}</span>
        </div>
      </div>

      <!-- Detail-Popup -->
      <div v-if="selectedDay" class="mood-detail-popup" @click="selectedDay = null">
        <div class="popup-content" @click.stop>
          <h3>{{ formatDate(selectedDay.date) }}</h3>

          <!-- FALL A: Es existiert bereits ein Eintrag -->
          <div v-if="selectedDay.id">
            <!-- Ansichtsmodus -->
            <div v-if="!isEditing">
              <div class="mood-display">
                <span class="big-emoji">{{ getMoodEmoji(selectedDay.mood) }}</span>
                <p class="mood-name">{{ selectedDay.mood }}</p>
              </div>
              <p class="note">{{ selectedDay.note || 'Keine Notiz vorhanden' }}</p>

              <div class="popup-buttons">
                <button @click="editMood" class="edit-btn">✏️ Bearbeiten</button>
                <button @click="deleteMood" class="delete-btn">🗑️ Löschen</button>
                <button @click="selectedDay = null" class="close-btn">Schließen</button>
              </div>
            </div>

            <!-- Bearbeitungsmodus (PUT) -->
            <div v-else class="edit-mode">
              <label>Stimmung ändern:</label>
              <select v-model="editedMood" class="mood-select">
                <option v-for="mood in availableMoods" :key="mood" :value="mood">
                  {{ getMoodEmoji(mood) }} {{ mood }}
                </option>
              </select>

              <label>Notiz:</label>
              <textarea v-model="editedNote" rows="4" class="note-input"></textarea>

              <div class="popup-buttons">
                <button @click="saveEdit" class="save-btn">💾 Speichern</button>
                <button @click="cancelEdit" class="cancel-btn">Abbrechen</button>
              </div>
            </div>
          </div>

          <!-- FALL B: Nachträglich erstellen (POST) -->
          <div v-else class="edit-mode">
            <p class="info-text">Hier hast du noch nichts eingetragen.</p>

            <label>Stimmung wählen:</label>
            <select v-model="editedMood" class="mood-select">
              <option value="" disabled>Bitte wählen...</option>
              <option v-for="mood in availableMoods" :key="mood" :value="mood">
                {{ getMoodEmoji(mood) }} {{ mood }}
              </option>
            </select>

            <label>Notiz:</label>
            <textarea v-model="editedNote" placeholder="Wie war dein Tag?" rows="4" class="note-input"></textarea>

            <div class="popup-buttons">
              <button @click="createNewEntry" class="save-btn" :disabled="!editedMood">➕ Erstellen</button>
              <button @click="selectedDay = null" class="cancel-btn">Abbrechen</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL } from '@/config/api'

export default {
  name: "CalendarView",
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      moodEntries: [],
      selectedDay: null,
      weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      isEditing: false,
      editedMood: '',
      editedNote: '',
      filterMood: '' // NEU: Filter-Variable
    }
  },
  computed: {
    monthName() {
      const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
      return months[this.currentMonth]
    },
    calendarDays() {
      const days = []
      const firstDay = new Date(this.currentYear, this.currentMonth, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)

      let startDay = firstDay.getDay()
      startDay = startDay === 0 ? 6 : startDay - 1

      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate()
      for (let i = startDay - 1; i >= 0; i--) {
        days.push({
          dayNumber: prevMonthLastDay - i,
          date: new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i),
          isCurrentMonth: false,
          mood: null,
          isFiltered: false
        })
      }

      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(this.currentYear, this.currentMonth, day)
        const moodEntry = this.getMoodForDate(date)

        // NEU: Prüfen, ob dieser Tag dem Filter entspricht
        const matchesFilter = !this.filterMood || moodEntry?.mood === this.filterMood

        days.push({
          dayNumber: day,
          date: date,
          isCurrentMonth: true,
          mood: moodEntry?.mood || null,
          note: moodEntry?.note || null,
          id: moodEntry?.id || null,
          isFiltered: !matchesFilter // NEU: Wird true, wenn Tag NICHT dem Filter entspricht
        })
      }

      const remainingDays = 42 - days.length
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          dayNumber: day,
          date: new Date(this.currentYear, this.currentMonth + 1, day),
          isCurrentMonth: false,
          mood: null,
          isFiltered: false
        })
      }
      return days
    },
    availableMoods() {
      return ['Glücklich', 'Neutral', 'Traurig', 'Müde', 'Gestresst',
        'Aufgeregt', 'Sauer', 'Entspannt', 'Gelangweilt', 'Schlecht']
    }
  },
  async mounted() {
    await this.loadMoodEntries()
  },
  methods: {
    async loadMoodEntries() {
      try {
        const token = localStorage.getItem("sessionToken")
        const response = await fetch(`${API_BASE_URL}/moods`, {
          headers: { "X-Session-Token": token }
        })
        if (response.ok) {
          this.moodEntries = await response.json()
        }
      } catch (e) {
        console.error("Fehler beim Laden:", e)
      }
    },
    getMoodForDate(date) {
      const dateStr = date.toLocaleDateString('en-CA')
      return this.moodEntries.find(entry => {
        const entryDate = new Date(entry.time).toLocaleDateString('en-CA')
        return entryDate === dateStr
      })
    },
    getMoodColor(mood) {
      const colors = {
        'Glücklich': 'rgba(16, 185, 129, 0.4)',
        'Neutral': 'rgba(148, 163, 184, 0.4)',
        'Traurig': 'rgba(59, 130, 246, 0.4)',
        'Müde': 'rgba(139, 92, 246, 0.4)',
        'Gestresst': 'rgba(239, 68, 68, 0.4)',
        'Aufgeregt': 'rgba(251, 191, 36, 0.4)',
        'Sauer': 'rgba(220, 38, 38, 0.4)',
        'Entspannt': 'rgba(52, 211, 153, 0.4)',
        'Gelangweilt': 'rgba(156, 163, 175, 0.4)',
        'Schlecht': 'rgba(107, 114, 128, 0.4)'
      }
      return colors[mood] || 'rgba(139, 92, 246, 0.2)'
    },
    getMoodEmoji(mood) {
      const emojis = {
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
      return emojis[mood] || '😶'
    },
    isFutureDate(date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const compareDate = new Date(date)
      compareDate.setHours(0, 0, 0, 0)
      return compareDate > today
    },
    showMoodDetails(day) {
      if (this.isFutureDate(day.date)) {
        return
      }

      this.selectedDay = day
      if (day.id) {
        this.isEditing = false
      } else {
        this.isEditing = true
        this.editedMood = ''
        this.editedNote = ''
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('de-DE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    },
    editMood() {
      this.isEditing = true
      this.editedMood = this.selectedDay.mood
      this.editedNote = this.selectedDay.note || ''
    },
    async saveEdit() {
      if (!this.selectedDay || !this.selectedDay.id) return

      try {
        const token = localStorage.getItem("sessionToken")

        const currentDate = new Date()
        const year = this.selectedDay.date.getFullYear()
        const month = String(this.selectedDay.date.getMonth() + 1).padStart(2, '0')
        const day = String(this.selectedDay.date.getDate()).padStart(2, '0')
        const hours = String(currentDate.getHours()).padStart(2, '0')
        const minutes = String(currentDate.getMinutes()).padStart(2, '0')
        const seconds = String(currentDate.getSeconds()).padStart(2, '0')

        const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`

        const response = await fetch(`${API_BASE_URL}/moods/${this.selectedDay.id}`, {
          method: 'PUT',
          headers: {
            "X-Session-Token": token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mood: this.editedMood,
            time: formattedTime,
            note: this.editedNote
          })
        })

        if (response.ok) {
          alert("✅ Eintrag aktualisiert!")
          this.selectedDay = null
          this.isEditing = false
          await this.loadMoodEntries()
        } else {
          const errorText = await response.text()
          console.error("Backend Fehler:", errorText)
          alert("❌ Fehler beim Speichern: " + errorText)
        }
      } catch (e) {
        console.error("Netzwerkfehler:", e)
        alert("❌ Netzwerkfehler beim Speichern")
      }
    },
    cancelEdit() {
      this.isEditing = false
    },
    async deleteMood() {
      if (!this.selectedDay || !this.selectedDay.id) return

      if (!confirm(`Möchtest du den Eintrag vom ${this.formatDate(this.selectedDay.date)} wirklich löschen?`)) {
        return
      }

      try {
        const token = localStorage.getItem("sessionToken")
        const response = await fetch(`${API_BASE_URL}/moods/${this.selectedDay.id}`, {
          method: 'DELETE',
          headers: { "X-Session-Token": token }
        })

        if (response.ok) {
          alert("✅ Eintrag gelöscht!")
          this.selectedDay = null
          await this.loadMoodEntries()
        } else {
          alert("❌ Fehler beim Löschen")
        }
      } catch (e) {
        console.error("Fehler:", e)
        alert("❌ Fehler beim Löschen")
      }
    },
    async createNewEntry() {
      if (!this.editedMood) return

      try {
        const token = localStorage.getItem("sessionToken")

        const year = this.selectedDay.date.getFullYear()
        const month = String(this.selectedDay.date.getMonth() + 1).padStart(2, '0')
        const day = String(this.selectedDay.date.getDate()).padStart(2, '0')
        const formattedTime = `${year}-${month}-${day}T12:00:00`

        const response = await fetch(`${API_BASE_URL}/moods`, {
          method: 'POST',
          headers: {
            "X-Session-Token": token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mood: this.editedMood,
            time: formattedTime,
            note: this.editedNote
          })
        })

        if (response.ok) {
          alert("✅ Eintrag nachträglich erstellt!")
          this.selectedDay = null
          await this.loadMoodEntries()
        } else {
          const errorMsg = await response.text()
          alert("❌ Fehler: " + errorMsg)
        }
      } catch (e) {
        console.error("Fehler:", e)
        alert("❌ Netzwerkfehler")
      }
    },
    previousMonth() {
      if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; }
      else { this.currentMonth--; }
    },
    nextMonth() {
      if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; }
      else { this.currentMonth++; }
    }
  }
}
</script>

<style scoped>
.calendar-page { min-height: 100vh; padding: 40px 20px; display: flex; justify-content: center; }
.calendar-container {
  width: 100%; max-width: 800px;
  background: linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%);
  border-radius: 20px; padding: 2rem; border: 1px solid rgba(139, 92, 246, 0.2);
}
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.calendar-header h2 { color: white; margin: 0; }
.nav-btn { background: #0f172a; border: 1px solid #8b5cf6; color: white; padding: 8px 15px; border-radius: 8px; cursor: pointer; }

/* NEU: Filter Leiste */
.filter-bar {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.filter-label {
  color: #a78bfa;
  font-size: 0.9rem;
  font-weight: bold;
}
.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.filter-chip {
  background: #0f172a;
  border: 1px solid #8b5cf6;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}
.filter-chip:hover {
  background: rgba(139, 92, 246, 0.2);
  transform: translateY(-2px);
}
.filter-chip.active {
  background: #8b5cf6;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  font-weight: bold;
}

.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.weekday { text-align: center; color: #a78bfa; font-weight: bold; padding-bottom: 10px; }
.calendar-day {
  aspect-ratio: 1; background: rgba(15, 23, 42, 0.5); border-radius: 10px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; border: 1px solid transparent; transition: all 0.3s;
}
.calendar-day.other-month { opacity: 0.2; cursor: default; }
.calendar-day.has-mood { border-color: #8b5cf6; }
.day-number { color: #94a3b8; font-size: 0.8rem; }
.mood-emoji { font-size: 1.2rem; }

.calendar-day.is-future {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

/* NEU: Gefilterte Tage ausblenden */
.calendar-day.is-filtered {
  opacity: 0.15;
  filter: grayscale(100%);
}

.mood-detail-popup {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.popup-content {
  background: #1e293b; padding: 2rem; border-radius: 20px; width: 90%; max-width: 400px; text-align: center;
  border: 1px solid #8b5cf6;
}
.big-emoji { font-size: 4rem; display: block; }
.mood-name { color: white; font-size: 1.5rem; margin: 0.5rem 0; }
.note { background: #0f172a; padding: 1rem; border-radius: 10px; color: #cbd5e1; margin: 1rem 0; }
.info-text { color: #94a3b8; margin-bottom: 1rem; }

.popup-buttons { display: flex; gap: 10px; margin-top: 1rem; }

.delete-btn {
  flex: 1; padding: 10px;
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  border: none; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; transition: all 0.3s;
}
.delete-btn:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  transform: translateY(-2px); box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
}

.close-btn {
  flex: 1; padding: 10px; background: #8b5cf6;
  border: none; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; transition: all 0.3s;
}
.close-btn:hover { background: #7c3aed; transform: translateY(-2px); }

.edit-mode label {
  display: block; color: #a78bfa; font-weight: bold;
  margin-top: 1rem; margin-bottom: 0.5rem; text-align: left;
}

.mood-select {
  width: 100%; padding: 10px; background: #0f172a; border: 1px solid #8b5cf6;
  border-radius: 8px; color: white; font-size: 1rem; cursor: pointer;
}

.note-input {
  width: 100%; padding: 10px; background: #0f172a; border: 1px solid #8b5cf6;
  border-radius: 8px; color: white; font-family: inherit; resize: vertical;
}

.edit-btn {
  flex: 1; padding: 10px;
  background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
  border: none; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; transition: all 0.3s;
}
.edit-btn:hover {
  background: linear-gradient(135deg, #0e7490 0%, #0891b2 100%);
  transform: translateY(-2px); box-shadow: 0 4px 15px rgba(8, 145, 178, 0.4);
}

.save-btn {
  flex: 1; padding: 10px;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border: none; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; transition: all 0.3s;
}
.save-btn:hover {
  background: linear-gradient(135deg, #047857 0%, #059669 100%);
  transform: translateY(-2px); box-shadow: 0 4px 15px rgba(5, 150, 105, 0.4);
}
.save-btn:disabled {
  opacity: 0.5; cursor: not-allowed;
}

.cancel-btn {
  flex: 1; padding: 10px; background: #64748b;
  border: none; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; transition: all 0.3s;
}
.cancel-btn:hover { background: #475569; transform: translateY(-2px); }
</style>
