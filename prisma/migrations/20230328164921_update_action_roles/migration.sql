/*
  Warnings:

  - You are about to drop the column `type` on the `roles` table. All the data in the column will be lost.
  - Added the required column `subject` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RolesAction" ADD VALUE 'CREATE';

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "type",
ADD COLUMN     "subject" "RolesType" NOT NULL;
