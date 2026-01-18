import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'

// 🔧 Pfad ggf. anpassen
import StatisticsView from '@/views/StatisticsView.vue'

describe('StatisticsView', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()

    // ✅ Standard-Fetch-Mock: keine Daten
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => []
      })
    )
  })

  it('rendert Titel und Filter-Buttons', async () => {
    const wrapper = shallowMount(StatisticsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Deine Statistik')
    expect(wrapper.text()).toContain('Diesen Monat')
    expect(wrapper.text()).toContain('Gesamt')
  })

  it('zeigt Hinweis wenn keine Statistikdaten vorhanden sind', async () => {
    const wrapper = shallowMount(StatisticsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Daten für diesen Zeitraum gefunden.')
  })

  it('rendert Statistik-Einträge wenn Backend Daten liefert', async () => {
    ;(globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { mood: 'Glücklich', count: 3 },
        { mood: 'Traurig', count: 1 }
      ]
    })

    const wrapper = shallowMount(StatisticsView)
    await flushPromises()

    expect(wrapper.text()).toContain('Glücklich')
    expect(wrapper.text()).toContain('3x')
    expect(wrapper.text()).toContain('Traurig')
    expect(wrapper.text()).toContain('1x')
  })
})
