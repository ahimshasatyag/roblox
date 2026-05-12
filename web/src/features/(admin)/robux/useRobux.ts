import { useEffect } from "react"
import { useRobuxStore } from "@/stores/(admin)/robux/index"

export const useRobux = () => {
    const { 
        robuxes, 
        loading, 
        error, 
        fetchRobuxes, 
        createRobux, 
        updateRobux, 
        deleteRobux 
    } = useRobuxStore()

    useEffect(() => {
        fetchRobuxes()
    }, [])

    return {
        robuxes,
        loading,
        error,
        fetchRobuxes,
        createRobux,
        updateRobux,
        deleteRobux
    }
}
