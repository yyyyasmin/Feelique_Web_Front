import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'

// 🔧 Pfad ggf. anpassen
import CalendarView from '@/views/CalendarView.vue'

describe('CalendarView', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()

    // ✅ Initialer fetch in mounted(): leere moodEntries
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => []
      })
    )
  })

  it('rendert Kalender-Header und Navigation', async () => {
    const wrapper = shallowMount(CalendarView)
    await flushPromises()

    // Header buttons + Jahr (z.B. 2026 etc.)
    expect(wrapper.findAll('button.nav-btn').length).toBe(2)
    expect(wrapper.find('.calendar-header').exists()).toBe(true)
    expect(wrapper.text()).toMatch(/\d{4}/) // Jahr steht drin
  })

  it('rendert Wochentage und Kalendertage (Grid)', async () => {
    const wrapper = shallowMount(CalendarView)
    await flushPromises()

    // 7 Wochentage
    expect(wrapper.findAll('.weekday').length).toBe(7)

    // Kalender hat immer 42 day-cells (6 Wochen Ansicht)
    expect(wrapper.findAll('.calendar-day').length).toBe(42)
  })

  it('hat Filter-Leiste mit "Alle" und Mood-Filtern', async () => {
    const wrapper = shallowMount(CalendarView)
    await flushPromises()

    expect(wrapper.text()).toContain('Filtern nach:')
    expect(wrapper.text()).toContain('Alle')

    // Es gibt mehrere Filter-Chips (Alle + Emojis)
    const chips = wrapper.findAll('button.filter-chip')
    expect(chips.length).toBeGreaterThan(1)
  })
})
