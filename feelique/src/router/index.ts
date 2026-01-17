import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MoodComponent from "@/components/MoodComponent.vue"
import AboutView from '../views/AboutView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
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
      meta: { requiresAuth: true } // Nur eingeloggte User
    }
  ],
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('sessionToken');

  // Debugging: Zeigt dir in der F12-Konsole an, was passiert
  console.log("Navigiere zu:", to.path, "| Token vorhanden:", !!token);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token || token === "undefined" || token === "null") {
      // Falls kein Token da ist oder er ungültig ist -> Login
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
