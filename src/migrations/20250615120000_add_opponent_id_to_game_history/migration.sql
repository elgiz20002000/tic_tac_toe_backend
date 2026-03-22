-- AlterTable
ALTER TABLE "GameHistory" ADD COLUMN "opponentId" TEXT;

-- Backfill opponentId from opponentName where a matching User exists
UPDATE "GameHistory" gh
SET "opponentId" = u.id
FROM "User" u
WHERE gh."opponentName" = u.name AND gh."opponentId" IS NULL;

-- CreateForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
