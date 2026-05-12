"use client"

import { useEffect } from "react"
import { useUserStore } from "@/stores/(admin)/users/index"

export function useUsers() {
    const { users, loading, error, fetchUsers } = useUserStore()

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    return {
        users,
        loading,
        error,
    }
}
