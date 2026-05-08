import { http, clearAccessTokenCookie } from "@/lib/http";
import { LoginAdminReq, TokenRes, MeAdminRes } from "@/types/auth/auth";
import { MenuAdmin } from "@/types/(admin)/auth/index";

export const adminAuthService = {
  /**
   * Melakukan login admin ke sistem
   * @param data {LoginAdminReq} - Berisi username dan password
   * @returns {Promise<TokenRes>} - Mengembalikan token JWT jika berhasil
   */
  login: async (data: LoginAdminReq): Promise<TokenRes> => {
    return await http<TokenRes>("/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Mengambil daftar menu untuk admin
   * @returns {Promise<{ menus: MenuAdmin[] }>}
   */
  getMenus: async (): Promise<{ menus: MenuAdmin[] }> => {
    return await http<{ menus: MenuAdmin[] }>("/admin/menus");
  },

  /**
   * Mengambil data profil admin yang sedang login
   * @returns {Promise<MeAdminRes>}
   */
  me: async (): Promise<MeAdminRes> => {
    return await http<MeAdminRes>("/admin/me");
  },

  /**
   * Melakukan logout admin
   */
  logout: async (): Promise<void> => {
    try {
      await http<{ ok: boolean }>("/admin/logout", { method: "POST" });
    } catch {}
    clearAccessTokenCookie("admin");
  },
};
