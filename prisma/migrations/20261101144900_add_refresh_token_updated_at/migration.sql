-- 기존 RefreshToken에는 생성 시각을 수정 시각의 초기값으로 사용한다.
ALTER TABLE "RefreshToken" ADD COLUMN "updatedAt" TIMESTAMP(3);

UPDATE "RefreshToken"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

ALTER TABLE "RefreshToken"
ALTER COLUMN "updatedAt" SET NOT NULL;
