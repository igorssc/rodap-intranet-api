/*
  Warnings:

  - The values [CREATE_TICKET,UPDATE_TICKET,DELETE_TICKET] on the enum `ActionLogType` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `support_tickets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'CLOSED', 'PROGRESS');

-- CreateEnum
CREATE TYPE "SupportTicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterEnum
BEGIN;
CREATE TYPE "ActionLogType_new" AS ENUM ('LOGIN', 'CREATE_USER', 'UPDATE_USER', 'UPDATE_PROFILE', 'DELETE_USER', 'CREATE_SUPPORT_TICKET', 'UPDATE_SUPPORT_TICKET', 'DELETE_SUPPORT_TICKET');
ALTER TABLE "action_logs" ALTER COLUMN "action_type" TYPE "ActionLogType_new" USING ("action_type"::text::"ActionLogType_new");
ALTER TYPE "ActionLogType" RENAME TO "ActionLogType_old";
ALTER TYPE "ActionLogType_new" RENAME TO "ActionLogType";
DROP TYPE "ActionLogType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "RolesSubject" ADD VALUE 'SUPPORT_TICKET';

-- AlterTable
ALTER TABLE "support_tickets" ADD COLUMN     "priority" "SupportTicketPriority" NOT NULL DEFAULT 'LOW',
DROP COLUMN "status",
ADD COLUMN     "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN';

-- DropEnum
DROP TYPE "TicketStatus";
