/*
  Warnings:

  - The `status` column on the `Friendship` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `currentStatus` column on the `OnlinePlayer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `GameHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EOnlinePlayerStatus" AS ENUM ('Online', 'Offline', 'Playing');

-- CreateEnum
CREATE TYPE "EGameStatus" AS ENUM ('Won', 'Lost', 'Draw');

-- CreateEnum
CREATE TYPE "EInviteStatus" AS ENUM ('Pending', 'Accepted', 'Denied');

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "status",
ADD COLUMN     "status" "EInviteStatus" NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "GameHistory" DROP COLUMN "status",
ADD COLUMN     "status" "EGameStatus" NOT NULL;

-- AlterTable
ALTER TABLE "OnlinePlayer" DROP COLUMN "currentStatus",
ADD COLUMN     "currentStatus" "EOnlinePlayerStatus" NOT NULL DEFAULT 'Online';
