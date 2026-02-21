-- DropForeignKey
ALTER TABLE "OnlinePlayer" DROP CONSTRAINT "OnlinePlayer_userId_fkey";

-- AddForeignKey
ALTER TABLE "OnlinePlayer" ADD CONSTRAINT "OnlinePlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
