"use client"

// ─── Auth module — SHA-256 hash via Web Crypto API ─────────────────────────
// Default credentials: username=admin  password=ORBadmin2026
// Password can be changed from the admin dashboard (new hash saved in localStorage)

const SESSION_KEY = 'orb_admin_session'
const PASSWORD_HASH_KEY = 'orb_admin_pwd_hash'

export const ADMIN_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'ORBadmin2026'

// ─── Crypto helpers ─────────────────────────────────────────────────────────

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text)
  const hashBuf = await window.crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function login(username: string, password: string): Promise<boolean> {
  if (username.trim().toLowerCase() !== ADMIN_USERNAME) return false

  const inputHash = await sha256(password)
  const storedHash = localStorage.getItem(PASSWORD_HASH_KEY)
  const validHash = storedHash ?? (await sha256(DEFAULT_PASSWORD))

  if (inputHash !== validHash) return false

  const session = {
    username,
    loginAt: Date.now(),
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return true
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return false
    const { expiresAt } = JSON.parse(raw) as { expiresAt: number }
    return Date.now() < expiresAt
  } catch {
    return false
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

/** Returns true if password changed successfully, false if currentPassword is wrong or newPassword too short */
export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  if (newPassword.length < 8) return false
  const currentHash = await sha256(currentPassword)
  const storedHash = localStorage.getItem(PASSWORD_HASH_KEY)
  const validHash = storedHash ?? (await sha256(DEFAULT_PASSWORD))
  if (currentHash !== validHash) return false
  localStorage.setItem(PASSWORD_HASH_KEY, await sha256(newPassword))
  return true
}
