import { User } from "@/types/auth/auth";

export interface AdminUser extends User {}

export interface AdminLoginResponse {
  token: string;
}

export interface MenuAdmin {
  id_menu: string;
  nm_menu: string;
  id_parent: string;
  no_urut: number;
  nm_folder: string;
  nm_icon: string;
}
