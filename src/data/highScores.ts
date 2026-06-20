import type { Difficulty } from '../state/types'

export interface HighScoreEntry {
  playerName: string
  difficulty: Difficulty
  money: number
  score: number
  grade: string
  winCondition: string | null
  weeksReached: number
  timestamp: number
}

// ---------------------------------------------------------------------------
// Supabase (global leaderboard)
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
// ---------------------------------------------------------------------------

const SB_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? ''
const SB_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? ''
const TABLE = 'high_scores'
const MAX_SCORES = 10

function supabaseEnabled(): boolean {
  return SB_URL.length > 0 && SB_KEY.length > 0
}

function sbHeaders(): HeadersInit {
  return {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
  }
}

async function sbInsert(entry: HighScoreEntry): Promise<void> {
  const res = await fetch(`${SB_URL}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: { ...sbHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify({
      player_name: entry.playerName,
      difficulty: entry.difficulty,
      money: entry.money,
      score: entry.score,
      grade: entry.grade,
      win_condition: entry.winCondition,
      weeks_reached: entry.weeksReached,
      timestamp: entry.timestamp,
    }),
  })
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status}`)
}

async function sbGetTop(difficulty: Difficulty): Promise<HighScoreEntry[]> {
  const res = await fetch(
    `${SB_URL}/rest/v1/${TABLE}?difficulty=eq.${difficulty}&order=money.desc&limit=${MAX_SCORES}`,
    { headers: sbHeaders() },
  )
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`)
  const rows = (await res.json()) as Array<Record<string, unknown>>
  return rows.map((r) => ({
    playerName: r.player_name as string,
    difficulty: r.difficulty as Difficulty,
    money: r.money as number,
    score: r.score as number,
    grade: r.grade as string,
    winCondition: r.win_condition as string | null,
    weeksReached: r.weeks_reached as number,
    timestamp: r.timestamp as number,
  }))
}

// ---------------------------------------------------------------------------
// localStorage (local fallback / offline cache)
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'jones_high_scores'
const MAX_LOCAL = 5

function loadLocal(): HighScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HighScoreEntry[]) : []
  } catch {
    return []
  }
}

function saveLocal(entries: HighScoreEntry[]): void {
  try {
    const trimmed = (['short', 'medium', 'long'] as Difficulty[]).flatMap((diff) =>
      entries
        .filter((s) => s.difficulty === diff)
        .sort((a, b) => b.money - a.money)
        .slice(0, MAX_LOCAL),
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // ignore quota errors
  }
}

function getLocal(): Record<Difficulty, HighScoreEntry[]> {
  const all = loadLocal()
  const result = { short: [] as HighScoreEntry[], medium: [] as HighScoreEntry[], long: [] as HighScoreEntry[] }
  for (const diff of ['short', 'medium', 'long'] as Difficulty[]) {
    result[diff] = all
      .filter((s) => s.difficulty === diff)
      .sort((a, b) => b.money - a.money)
      .slice(0, MAX_LOCAL)
  }
  return result
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function addHighScore(entry: HighScoreEntry): Promise<void> {
  // Always cache locally first (instant, works offline)
  const all = loadLocal()
  all.push(entry)
  saveLocal(all)

  // Fire-and-forget to Supabase; silently swallow network errors
  if (supabaseEnabled()) {
    sbInsert(entry).catch(() => undefined)
  }
}

export async function getHighScores(): Promise<Record<Difficulty, HighScoreEntry[]>> {
  if (supabaseEnabled()) {
    try {
      const [short, medium, long] = await Promise.all([
        sbGetTop('short'),
        sbGetTop('medium'),
        sbGetTop('long'),
      ])
      return { short, medium, long }
    } catch {
      // network failure — fall through to local cache
    }
  }
  return getLocal()
}
