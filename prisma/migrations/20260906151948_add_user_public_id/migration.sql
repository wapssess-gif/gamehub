-- AlterTable: add a short auto-incrementing public id.
-- SERIAL creates a sequence and fills every existing row with a distinct
-- sequential value; the sequence is left positioned for future inserts.
ALTER TABLE "users" ADD COLUMN "publicId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_publicId_key" ON "users"("publicId");
