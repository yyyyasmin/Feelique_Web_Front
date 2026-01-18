import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Sidebar from '@/components/Sidebar.vue' // ✅ ggf. anpassen

// ✅ vue-router mocken (useRouter + useRoute)
const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
  useRoute: () => ({ path: '/' })
}))

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('zeigt Login + Registrieren wenn NICHT eingeloggt', () => {
    // kein sessionToken -> isLoggedIn false
    const wrapper = shallowMount(Sidebar, {
      global: {
        stubs: {
          'router-link': { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.text()).toContain('Anmelden')
    expect(wrapper.text()).toContain('Registrieren')

    // About-Link soll sichtbar sein, wenn nicht eingeloggt
    expect(wrapper.text()).toContain('About')
  })

  it('zeigt MoodTracker/Kalender/Statistik/Profil + Abmelden wenn eingeloggt', () => {
    localStorage.setItem('sessionToken', 'token123')
    localStorage.setItem('userEmail', 'maria@test.de')
    localStorage.setItem('userFirstName', 'Maria')

    const wrapper = shallowMount(Sidebar, {
      global: {
        stubs: {
          'router-link': { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.text()).toContain('MoodTracker')
    expect(wrapper.text()).toContain('Kalender')
    expect(wrapper.text()).toContain('Statistik')
    expect(wrapper.text()).toContain('Profil')

    // Login/Register sollen weg sein
    expect(wrapper.text()).not.toContain('Anmelden')
    expect(wrapper.text()).not.toContain('Registrieren')

    // Abmelden-Button sichtbar
    expect(wrapper.text()).toContain('Abmelden')

    // Profil-Anzeige (Vorname bevorzugt)
    expect(wrapper.text()).toContain('Maria')
  })
})
