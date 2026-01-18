import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import MoodComponent from "@/components/MoodComponent.vue"
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import CalendarView from '../views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/moodTracker',
      name: 'moodTracker',
      component: MoodComponent,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: CalendarView,
      meta: { requiresAuth: true }
    },
    {
      path: '/stats',
      name: 'Statistics',
      component: () => import('../views/StatisticsView.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('sessionToken');

  console.log("Navigiere zu:", to.path, "| Token vorhanden:", !!token);

  // Wenn ein eingeloggter User auf die Landingpage (/) geht, schicken wir ihn zum Tracker
  if (to.path === '/' && token && token !== "undefined" && token !== "null") {
    console.log("Eingeloggter User auf Landingpage -> Redirect zu MoodTracker");
    next('/moodTracker');
    return;
  }

  // Normale Auth-Prüfung für geschützte Routen
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token || token === "undefined" || token === "null") {
      console.warn("Zugriff verweigert: Kein Token gefunden.");
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
