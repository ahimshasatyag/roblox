"use client"

import { useState, useEffect, useCallback } from "react"
import { adminUserRolesService } from "@/services/(admin)/userroles/index"
import { UserRole } from "@/types/(admin)/users/index"

export function useRoles() {
    const [roles, setRoles] = useState<UserRole[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchRoles = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await adminUserRolesService.getRoles()
            setRoles(res.roles || [])
        } catch (err: any) {
            setError(err.message || "Failed to fetch roles")
            setRoles([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    return { roles, loading, error, refreshRoles: fetchRoles }
}
