-- AlterTable: OAuth signups need a "pick your @username" step; onboardedAt=null
-- marks a user who hasn't done it. Existing users are all considered onboarded.
ALTER TABLE "users" ADD COLUMN "onboardedAt" TIMESTAMP(3);
UPDATE "users" SET "onboardedAt" = "createdAt" WHERE "onboardedAt" IS NULL;
