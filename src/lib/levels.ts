// ─── Level thresholds & rank titles ──────────────────────────────────────────
// Each index = level-1. LEVEL_THRESHOLDS[0] = 0 XP needed for level 1, etc.

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000,
] as const;

export const RANK_TITLES = [
  "Beginner Coder",
  "Code Explorer",
  "Bug Hunter",
  "Junior Builder",
  "Project Maker",
  "Full-Stack Apprentice",
  "Problem Solver",
  "Software Engineer in Training",
  "Job-Ready Developer",
  "Elite Builder",
] as const;

export const MAX_LEVEL = LEVEL_THRESHOLDS.length;

/** Returns the current level (1-10) for the given XP amount. */
export function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}

/** Returns the rank title for a given level (1-10). */
export function calculateRankTitle(level: number): string {
  return RANK_TITLES[Math.min(level - 1, RANK_TITLES.length - 1)];
}

export interface LevelInfo {
  level: number;
  rankTitle: string;
  xpForCurrent: number;
  xpForNext: number;
  progress: number; // 0-100
}

/** Returns detailed level progress info for displaying XP bars. */
export function getLevelProgress(xp: number): LevelInfo {
  const level = calculateLevel(xp);
  const rankTitle = calculateRankTitle(level);
  const xpForCurrent = LEVEL_THRESHOLDS[level - 1];
  const isMaxLevel = level >= MAX_LEVEL;
  const xpForNext = isMaxLevel
    ? LEVEL_THRESHOLDS[MAX_LEVEL - 1]
    : LEVEL_THRESHOLDS[level];
  const progress = isMaxLevel
    ? 100
    : Math.min(100, ((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100);

  return { level, rankTitle, xpForCurrent, xpForNext, progress };
}
