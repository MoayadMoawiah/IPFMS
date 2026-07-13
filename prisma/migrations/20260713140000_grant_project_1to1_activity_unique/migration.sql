-- Sync existing projects to mirror their parent grant (1:1 model)
UPDATE "projects" p
SET
  "code" = g."code",
  "name" = g."name",
  "startDate" = g."startDate",
  "endDate" = g."endDate",
  "budget" = g."totalBudget",
  "description" = g."description",
  "targetBeneficiaries" = g."targetBeneficiaries",
  "updatedAt" = NOW()
FROM "grants" g
WHERE p."grantId" = g."id"
  AND p."deletedAt" IS NULL
  AND g."deletedAt" IS NULL;

-- Create mirrored projects for grants that have none
INSERT INTO "projects" (
  "id",
  "grantId",
  "code",
  "name",
  "description",
  "startDate",
  "endDate",
  "budget",
  "status",
  "targetBeneficiaries",
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid()::text,
  g."id",
  g."code",
  g."name",
  g."description",
  g."startDate",
  g."endDate",
  g."totalBudget",
  CASE WHEN g."status" = 'ACTIVE' THEN 'ACTIVE'::"ProjectStatus" ELSE 'PLANNING'::"ProjectStatus" END,
  g."targetBeneficiaries",
  NOW(),
  NOW()
FROM "grants" g
WHERE g."deletedAt" IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "projects" p
    WHERE p."grantId" = g."id"
      AND p."deletedAt" IS NULL
  );

-- Enforce one project per grant
CREATE UNIQUE INDEX "projects_grantId_key" ON "projects"("grantId");

-- Enforce unique activity codes within a project
CREATE UNIQUE INDEX "activities_projectId_code_key" ON "activities"("projectId", "code");
