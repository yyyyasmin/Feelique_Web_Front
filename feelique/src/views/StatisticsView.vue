<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { API_BASE_URL } from '@/config/api'

interface MoodStat {
  mood: string
  count: number
}

const stats = ref<MoodStat[]>([])
const loading = ref(false)
const selectedRange = ref<'all' | 'month'>('month')

const emojiMap: Record<string, string> = {
  'Glücklich': '😊', 'Neutral': '😐', 'Traurig': '😢', 'Müde': '😴',
  'Gestresst': '😤', 'Aufgeregt': '🤩', 'Sauer': '😡', 'Entspannt': '😌',
  'Gelangweilt': '🥱', 'Schlecht': '😞'
}

async function loadStats() {
  loading.value = true
  try {
    const token = localStorage.getItem('sessionToken')
    let url = `${API_BASE_URL}/moods/stats`

    // Wenn "Diesen Monat" gewählt ist, berechnen wir Start- und Enddatum für das Backend
    if (selectedRange.value === 'month') {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
      url += `?from=${firstDay}&to=${lastDay}`
    }

    const response = await fetch(url, {
      headers: { 'X-Session-Token': token || '' }
    })

    if (response.ok) {
      stats.value = await response.json()
    }
  } catch (e) {
    console.error("Fehler beim Laden der Statistik:", e)
  } finally {
    loading.value = false
  }
}

const totalEntries = computed(() => stats.value.reduce((sum, s) => sum + s.count, 0))

const processedStats = computed(() => {
  if (totalEntries.value === 0) return []
  return stats.value.map(s => ({
    ...s,
    emoji: emojiMap[s.mood] || '😶',
    percent: Math.round((s.count / totalEntries.value) * 100)
  }))
})

// Automatisch neu laden, wenn der User den Filter umschaltet
watch(selectedRange, () => loadStats())

onMounted(() => loadStats())
</script>

<template>
  <div class="stats-page">
    <div class="stats-container">
      <h2>📊 Deine Statistik</h2>

      <div class="range-selector">
        <button
          :class="{ active: selectedRange === 'month' }"
          @click="selectedRange = 'month'"
        >
          Diesen Monat
        </button>
        <button
          :class="{ active: selectedRange === 'all' }"
          @click="selectedRange = 'all'"
        >
          Gesamt
        </button>
      </div>

      <div v-if="loading" class="info-text">Lade Statistik...</div>

      <div v-else-if="processedStats.length > 0" class="stats-list">
        <div v-for="item in processedStats" :key="item.mood" class="stat-item">
          <div class="label">
            <span class="emoji">{{ item.emoji }}</span>
            <span class="name">{{ item.mood }}</span>
          </div>
          <div class="bar-container">
            <div class="bar" :style="{ width: item.percent + '%' }"></div>
          </div>
          <div class="values">
            <span class="count">{{ item.count }}x</span>
            <span class="percent">{{ item.percent }}%</span>
          </div>
        </div>
        <div class="summary">
          Gesamtanzahl der Einträge: <strong>{{ totalEntries }}</strong>
        </div>
      </div>

      <div v-else class="no-data">
        Keine Daten für diesen Zeitraum gefunden.
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-page { min-height: 100vh; padding: 40px 20px; display: flex; justify-content: center; }
.stats-container {
  width: 100%; max-width: 600px; background: #1e293b; padding: 2.5rem;
  border-radius: 20px; border: 1px solid #8b5cf6; color: white;
}
h2 { text-align: center; margin-bottom: 2rem; color: #a78bfa; }

.range-selector { display: flex; gap: 10px; margin-bottom: 2rem; }
.range-selector button {
  flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #8b5cf6;
  background: transparent; color: white; cursor: pointer; transition: 0.3s;
}
.range-selector button.active { background: #8b5cf6; }

.stat-item { margin-bottom: 1.5rem; }
.label { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
.emoji { font-size: 1.5rem; }
.bar-container {
  height: 12px; background: #0f172a; border-radius: 6px; overflow: hidden; margin-bottom: 5px;
}
.bar { height: 100%; background: linear-gradient(90deg, #8b5cf6, #d8b4fe); border-radius: 6px; }
.values { display: flex; justify-content: space-between; font-size: 0.85rem; color: #94a3b8; }

.summary { margin-top: 2rem; text-align: center; padding-top: 1rem; border-top: 1px solid #334155; color: #94a3b8; }
.no-data, .info-text { text-align: center; color: #94a3b8; margin-top: 2rem; }
</style>
