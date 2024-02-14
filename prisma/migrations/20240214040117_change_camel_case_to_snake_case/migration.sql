/*
  Warnings:

  - You are about to drop the column `actionData` on the `action_logs` table. All the data in the column will be lost.
  - You are about to drop the column `actionType` on the `action_logs` table. All the data in the column will be lost.
  - Added the required column `action_data` to the `action_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action_type` to the `action_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "action_logs" DROP COLUMN "actionData",
DROP COLUMN "actionType",
ADD COLUMN     "action_data" JSONB NOT NULL,
ADD COLUMN     "action_type" "ActionLogType" NOT NULL;
