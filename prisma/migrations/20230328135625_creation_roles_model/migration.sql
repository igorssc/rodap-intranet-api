-- CreateEnum
CREATE TYPE "RolesType" AS ENUM ('USER');

-- CreateEnum
CREATE TYPE "RolesAction" AS ENUM ('MANAGE', 'READ', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "type" "RolesType" NOT NULL,
    "action" "RolesAction" NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
