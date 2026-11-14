import { describe, expect, it } from "@jest/globals";
import { LevelPolicy } from "./level-policy";

describe("레벨 정책", () => {
  it("경험치 구간에 맞는 레벨을 계산한다", () => {
    expect(LevelPolicy.levelFor(0)).toBe(1);
    expect(LevelPolicy.levelFor(100)).toBe(2);
    expect(LevelPolicy.levelFor(300)).toBe(3);
  });

  it("레벨 기준보다 낮은 경험치는 이전 레벨을 유지한다", () => {
    expect(LevelPolicy.levelFor(299)).toBe(2);
  });
});
