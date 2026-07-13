-- AlterTable
ALTER TABLE "GroupTokenCall" ADD COLUMN     "callerId" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "callerUsername" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "mcAtCall" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "priceAtCall" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "GroupTokenCall_groupId_callerId_idx" ON "GroupTokenCall"("groupId", "callerId");
