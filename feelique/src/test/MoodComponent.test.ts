import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import axios from 'axios'
import MoodComponent from '@/components/MoodComponent.vue'

vi.mock('axios')

describe('MoodComponentTest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('rendert den Titel und eine Mood-Option', async () => {
    // falls loadSavedMoods doch läuft: GET abfangen
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })

    const wrapper = shallowMount(MoodComponent)
    await flushPromises()

    expect(wrapper.text()).toContain('Mein Mood Tracker')
    expect(wrapper.text()).toContain('Glücklich')
  })

  it('Mood auswählen zeigt Auswahl + Notizfeld + Save-Button', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })

    const wrapper = shallowMount(MoodComponent)
    await flushPromises()

    const items = wrapper.findAll('.mood-item')
    expect(items.length).toBeGreaterThan(0)

    await items[0]!.trigger('click')
    await nextTick() // UI aktualisieren

    // Auswahltext sichtbar
    expect(wrapper.text()).toContain('Du hast gewählt:')

    // Notizfeld + Button sichtbar (weil selectedMood && !hasVotedToday)
    expect(wrapper.find('#note').exists()).toBe(true)
    expect(wrapper.find('button.save-button').exists()).toBe(true)
  })

  // Falls du die Backend-Tests noch drin hast, bitte so lassen:
  // it.skip('lädt gespeicherte Moods vom Backend', async () => {})
  // it.skip('speichert eine Mood-Auswahl mit Notiz (POST)', async () => {})
})
