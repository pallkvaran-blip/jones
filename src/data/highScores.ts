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

const STORAGE_KEY = 'jones_high_scores'
const MAX_PER_DIFFICULTY = 5

function loadRaw(): HighScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HighScoreEntry[]) : []
  } catch {
    return []
  }
}

function persist(scores: HighScoreEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
  } catch {
    // ignore quota errors
  }
}

export function addHighScore(entry: HighScoreEntry): void {
  const all = loadRaw()
  all.push(entry)
  const trimmed = (['short', 'medium', 'long'] as Difficulty[]).flatMap(diff =>
    all
      .filter(s => s.difficulty === diff)
      .sort((a, b) => b.money - a.money)
      .slice(0, MAX_PER_DIFFICULTY)
  )
  persist(trimmed)
}

export function getHighScores(): Record<Difficulty, HighScoreEntry[]> {
  const all = loadRaw()
  const result = { short: [] as HighScoreEntry[], medium: [] as HighScoreEntry[], long: [] as HighScoreEntry[] }
  for (const diff of ['short', 'medium', 'long'] as Difficulty[]) {
    result[diff] = all
      .filter(s => s.difficulty === diff)
      .sort((a, b) => b.money - a.money)
      .slice(0, MAX_PER_DIFFICULTY)
  }
  return result
}
