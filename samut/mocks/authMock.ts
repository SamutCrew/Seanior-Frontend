// Fake "sign in" for demo mode: no Firebase project, no password checking,
// just a role -> seeded user lookup that's remembered in localStorage so a
// refresh keeps you logged in as the same demo account.
import { DEMO_USER_IDS } from "./seedData"
import { getUserById } from "./store"

const SESSION_KEY = "seanior_demo_session_v1"

export type DemoRole = "student" | "instructor" | "admin"

const DEMO_CREDENTIALS: Record<string, DemoRole> = {
  "student@demo.com": "student",
  "instructor@demo.com": "instructor",
  "admin@demo.com": "admin",
}

function roleToUserId(role: DemoRole) {
  if (role === "admin") return DEMO_USER_IDS.admin
  if (role === "instructor") return DEMO_USER_IDS.instructor
  return DEMO_USER_IDS.student
}

export function demoRoleForEmail(email: string): DemoRole | null {
  return DEMO_CREDENTIALS[email.trim().toLowerCase()] || null
}

export function demoLogin(role: DemoRole) {
  const userId = roleToUserId(role)
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, userId)
  }
  return getUserById(userId)
}

export function demoLogout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY)
  }
}

export function getDemoSession() {
  if (typeof window === "undefined") return null
  const userId = window.localStorage.getItem(SESSION_KEY)
  if (!userId) return null
  return getUserById(userId)
}
