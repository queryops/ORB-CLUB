"use client"

/**
 * GitHub-based persistence for events.
 *
 * Why: localStorage is browser-local. Events created in admin must be visible
 * to all visitors on any device/browser. This module uses GitHub's Contents API
 * to store events as a JSON file in the repository, and reads them from
 * raw.githubusercontent.com so changes appear globally within ~5 minutes.
 *
 * Setup (admin, one time):
 *   1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained
 *   2. Repo: queryops/ORB-CLUB, Permission: Contents → Read & Write
 *   3. Paste token in Admin → Configuración → Sincronización GitHub
 */

import type { OrbEvent } from "./events-store"

const OWNER = "queryops"
const REPO = "ORB-CLUB"
const BRANCH = "main"
const EVENTS_PATH = "public/data/events.json"
const GH_TOKEN_KEY = "orb_gh_token"

// ─── Token management ────────────────────────────────────────────────────────

export function getGithubToken(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(GH_TOKEN_KEY) ?? ""
}

export function setGithubToken(token: string): void {
  localStorage.setItem(GH_TOKEN_KEY, token.trim())
}

export function clearGithubToken(): void {
  localStorage.removeItem(GH_TOKEN_KEY)
}

export function hasGithubToken(): boolean {
  return getGithubToken().length > 0
}

// ─── Read from GitHub (public, no auth) ─────────────────────────────────────

/**
 * Fetch events from raw.githubusercontent.com.
 * Cache-busted with timestamp so visitors always get the latest version.
 * Returns null on failure (caller should fall back to localStorage).
 */
export async function pullEventsFromGitHub(): Promise<OrbEvent[] | null> {
  try {
    const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${EVENTS_PATH}?t=${Date.now()}`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

// ─── Write to GitHub (requires PAT) ─────────────────────────────────────────

export type SyncResult = { ok: true } | { ok: false; error: string }

/**
 * Write the full events array to the JSON file in the GitHub repo.
 * Requires a personal access token with Contents: Read & Write on this repo.
 */
export async function pushEventsToGitHub(
  events: OrbEvent[],
  token?: string
): Promise<SyncResult> {
  const tok = token ?? getGithubToken()
  if (!tok) return { ok: false, error: "Sin token de GitHub. Configúralo en Ajustes." }

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${EVENTS_PATH}`
  const headers: Record<string, string> = {
    Authorization: `Bearer ${tok}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
  }

  try {
    // 1. Get current file SHA (required by GitHub API for updates)
    const getRes = await fetch(apiUrl, { headers })
    if (!getRes.ok) {
      const body = await getRes.json().catch(() => ({}))
      return { ok: false, error: body.message ?? `Error ${getRes.status} al leer archivo` }
    }
    const current = await getRes.json()

    // 2. Base64-encode new content (TextEncoder → btoa, no deprecated unescape)
    const json = JSON.stringify(events, null, 2)
    const bytes = new TextEncoder().encode(json)
    let binary = ""
    bytes.forEach((b) => (binary += String.fromCharCode(b)))
    const content = btoa(binary)

    // 3. Commit update ([skip ci] avoids triggering a full redeploy)
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "chore: update events via admin [skip ci]",
        content,
        sha: current.sha,
        branch: BRANCH,
      }),
    })

    if (!putRes.ok) {
      const body = await putRes.json().catch(() => ({}))
      return { ok: false, error: body.message ?? `Error ${putRes.status} al guardar` }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: "Error de red al sincronizar con GitHub" }
  }
}

/**
 * Validate a token by checking the repository permissions object.
 * Uses GET /repos/{owner}/{repo} which returns { permissions: { push, pull, admin } }
 * for the authenticated user — no commit is created.
 *
 * "push: true" means the token can write contents (Contents: Read & Write scope).
 */
export async function verifyGithubToken(token: string): Promise<SyncResult> {
  const repoUrl = `https://api.github.com/repos/${OWNER}/${REPO}`
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  }

  try {
    const res = await fetch(repoUrl, { headers })

    if (res.status === 401) return { ok: false, error: "Token inválido o expirado" }
    if (res.status === 403) return { ok: false, error: "Token sin acceso a este repositorio" }
    if (res.status === 404) return { ok: false, error: "Repositorio no encontrado. Verifica el nombre del repo." }
    if (!res.ok) return { ok: false, error: `Error ${res.status} al verificar token` }

    const data = await res.json()

    // Fine-grained tokens may not expose `permissions` — fall back to checking `data.permissions`
    const perms = data.permissions as { push?: boolean; admin?: boolean } | undefined
    if (perms && perms.push === false && perms.admin === false) {
      return {
        ok: false,
        error: "Token sin permiso de escritura. Ve a GitHub → token → Contents: Read AND Write",
      }
    }

    // Confirm we can also read the events file path
    const fileRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${EVENTS_PATH}`,
      { headers }
    )
    if (fileRes.status === 404) {
      return { ok: false, error: `Archivo "${EVENTS_PATH}" no encontrado en el repo` }
    }
    if (!fileRes.ok) {
      const body = await fileRes.json().catch(() => ({}))
      return { ok: false, error: body.message ?? `Error ${fileRes.status} al leer events.json` }
    }

    return { ok: true }
  } catch {
    return { ok: false, error: "Error de red al verificar token" }
  }
}
