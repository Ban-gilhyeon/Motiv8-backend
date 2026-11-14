export type LevelRule = { readonly level: number; readonly minExperience: number };

export const LEVEL_RULES: readonly LevelRule[] = [
  { level: 1, minExperience: 0 },
  { level: 2, minExperience: 100 },
  { level: 3, minExperience: 300 },
  { level: 4, minExperience: 600 },
  { level: 5, minExperience: 1000 },
];

export class LevelPolicy {
  static levelFor(experience: number): number {
    return LEVEL_RULES.filter((rule) => rule.minExperience <= experience).at(-1)?.level ?? 1;
  }
}
