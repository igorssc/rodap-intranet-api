/*
  Warnings:

  - The values [MANAGE,READ,UPDATE,DELETE,CREATE] on the enum `RolesAction` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `subject` on the `roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RolesSubject" AS ENUM ('USER');

-- AlterEnum
BEGIN;
CREATE TYPE "RolesAction_new" AS ENUM ('manage', 'create', 'read', 'update', 'delete');
ALTER TABLE "roles" ALTER COLUMN "action" TYPE "RolesAction_new" USING ("action"::text::"RolesAction_new");
ALTER TYPE "RolesAction" RENAME TO "RolesAction_old";
ALTER TYPE "RolesAction_new" RENAME TO "RolesAction";
DROP TYPE "RolesAction_old";
COMMIT;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "subject",
ADD COLUMN     "subject" "RolesSubject" NOT NULL;

-- DropEnum
DROP TYPE "RolesType";
