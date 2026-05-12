"use client"

import { create } from "zustand";
import { Robux, CreateRobuxRequest, UpdateRobuxRequest } from "@/types/(admin)/robux/index";
import { adminRobuxService } from "@/services/(admin)/robux/index";

interface RobuxStore {
    robuxes: Robux[];
    loading: boolean;
    error: string | null;
    fetchRobuxes: () => Promise<void>;
    createRobux: (data: CreateRobuxRequest) => Promise<void>;
    updateRobux: (id: number, data: UpdateRobuxRequest) => Promise<void>;
    deleteRobux: (id: number) => Promise<void>;
}

export const useRobuxStore = create<RobuxStore>((set, get) => ({
    robuxes: [],
    loading: false,
    error: null,

    fetchRobuxes: async () => {
        set({ loading: true, error: null });
        try {
            const res = await adminRobuxService.getRobuxes();
            set({ robuxes: res.robuxes, loading: false });
        } catch (err: any) {
            set({ error: err.message || "Failed to fetch robux list", loading: false });
        }
    },

    createRobux: async (data: CreateRobuxRequest) => {
        set({ loading: true, error: null });
        try {
            const res = await adminRobuxService.createRobux(data);
            set((state) => ({
                robuxes: [...state.robuxes, res.robux],
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to create robux", loading: false });
            throw err;
        }
    },

    updateRobux: async (id: number, data: UpdateRobuxRequest) => {
        set({ loading: true, error: null });
        try {
            const res = await adminRobuxService.updateRobux(id, data);
            set((state) => ({
                robuxes: state.robuxes.map((r) => (r.id === id ? res.robux : r)),
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to update robux", loading: false });
            throw err;
        }
    },

    deleteRobux: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await adminRobuxService.deleteRobux(id);
            set((state) => ({
                robuxes: state.robuxes.filter((r) => r.id !== id),
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to delete robux", loading: false });
            throw err;
        }
    },
}));
