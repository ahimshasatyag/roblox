export type LoginAdminReq = { username: string; password: string }
export type LoginClientReq = { email: string; password: string }
export type TokenRes = { token: string }

export type User = {
  id: number
  role_id?: number | null
  fullname: string
  username: string
  created_at: string
  email?: string | null
}

export type UserAccount = {
  id: number
  full_name: string
  email: string
  pic?: string
  no_hp?: string | null
  is_active: boolean
  created_at: string
}

export type MeAdminRes = { user: User }
export type MeClientRes = { user_account: UserAccount }
export type RegisterClientReq = { full_name: string; email: string; password: string; pic?: string | null; no_hp?: string | null }
export type UpdateClientReq = {
  full_name?: string
  email?: string
  no_hp?: string | null
  pic?: string | null
}
