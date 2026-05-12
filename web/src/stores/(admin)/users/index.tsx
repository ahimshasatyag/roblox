"use client"

import { create } from "zustand";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types/(admin)/users/index";
import { adminUserService } from "@/services/(admin)/users/index";

interface UserStore {
    users: User[];
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    createUser: (data: CreateUserRequest) => Promise<User>;
    updateUser: (id: number, data: UpdateUserRequest) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const res = await adminUserService.getUsers();
            set({ users: res.users, loading: false });
        } catch (err: any) {
            set({ error: err.message || "Failed to fetch users", loading: false });
        }
    },

    createUser: async (data: CreateUserRequest) => {
        set({ loading: true, error: null });
        try {
            const res = await adminUserService.createUser(data);
            set((state) => ({
                users: [res.user, ...state.users],
                loading: false,
            }));
            return res.user;
        } catch (err: any) {
            set({ error: err.message || "Failed to create user", loading: false });
            throw err;
        }
    },

    updateUser: async (id: number, data: UpdateUserRequest) => {
        set({ loading: true, error: null });
        try {
            const res = await adminUserService.updateUser(id, data);
            set((state) => ({
                users: state.users.map((u) => (u.id === id ? res.user : u)),
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to update user", loading: false });
            throw err;
        }
    },

    deleteUser: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await adminUserService.deleteUser(id);
            set((state) => ({
                users: state.users.filter((u) => u.id !== id),
                loading: false,
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to delete user", loading: false });
            throw err;
        }
    },
}));
