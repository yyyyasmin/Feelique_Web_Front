<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <!-- Neuer Dark Header -->
  <header>
    <nav class="container">
      <div class="logo">
        <img
          src="https://i.pinimg.com/736x/2f/4e/d2/2f4ed21c03a01c38746ea93d73503577.jpg"
          alt="Feelique"
          class="logo-image"
        />
        <span>Feelique</span>
      </div>
      <ul class="nav-links">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
        <li><RouterLink to="/moodTracker">MoodTracker</RouterLink></li>
        <li>
          <button class="sidebar-toggle" @click="toggleSidebar">
            Toggle Sidebar
          </button>
        </li>
      </ul>
    </nav>
  </header>

  <!-- Sidebar (bleibt wie gehabt, nur Dark-Design) -->
  <section class="sidebar-wrapper overlay" v-if="isSidebarOpen">
    <div class="sidebar">
      <button class="close-btn" @click="toggleSidebar">×</button>
      <h2>Sidebar Content</h2>
      <p>
        hiuhisuhisluhclsuhclisuahhhhhhhhhhhsiuchhhhhhh
        hasuichasuihxnkjanskauhxiusah
      </p>
    </div>
  </section>

  <!-- Hauptinhalt -->
  <RouterView />
</template>

<style>
/* Globale Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header - Dark Design */
header {
  background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%);
  color: white;
  padding: 1rem 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(139, 92, 246, 0.3);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
}

.logo-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
}

/* Navigation Links */
.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  align-items: center;
}

.nav-links a {
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding-bottom: 4px;
  transition: color 0.3s;
}

.nav-links a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background: #c4b5fd;
  transition: width 0.3s ease;
}

.nav-links a:hover {
  color: #ffffff;
}

.nav-links a:hover::after {
  width: 100%;
}

.nav-links a.router-link-active {
  color: #ffffff;
  font-weight: 600;
}

.nav-links a.router-link-active::after {
  width: 100%;
}

/* Sidebar Toggle Button */
.sidebar-toggle {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border: none;
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.sidebar-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
}

/* Sidebar - Dark Design */
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.sidebar {
  position: relative;
  width: 300px;
  height: 100%;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  padding: 2rem;
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  color: #e2e8f0;
}

.sidebar h2 {
  color: #c4b5fd;
  margin-bottom: 1rem;
}

.sidebar p {
  color: #cbd5e1;
  line-height: 1.6;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(139, 92, 246, 0.2);
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #e2e8f0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(139, 92, 246, 0.4);
  color: #ffffff;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
    font-size: 0.9rem;
  }

  .logo {
    font-size: 1.4rem;
  }

  .logo-image {
    width: 32px;
    height: 32px;
  }

  .sidebar {
    width: 250px;
  }
}
</style>
