"use client"

import { useAuth as useAuthStore } from "../stores/auth/auth"

export function useAuth() {
  return useAuthStore()
}

export function useAuthToken() {
  return useAuthStore().token
}

export function useSetAuthToken() {
  return useAuthStore().setToken
}

export function useIsAuthenticated() {
  return useAuthStore().token !== null
}

export function useAuthActions() {
  const { setToken } = useAuthStore()
  return {
    logout: () => setToken(null),
  }
}
