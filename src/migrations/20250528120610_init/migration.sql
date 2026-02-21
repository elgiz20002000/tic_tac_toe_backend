/*
  Warnings:

  - You are about to drop the column `playerName` on the `GameHistory` table. All the data in the column will be lost.
  - Added the required column `opponentName` to the `GameHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `GameHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameHistory" DROP COLUMN "playerName",
ADD COLUMN     "opponentName" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GameHistory" ADD CONSTRAINT "GameHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
