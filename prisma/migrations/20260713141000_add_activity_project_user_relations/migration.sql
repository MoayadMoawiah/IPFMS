-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_responsibleUserId_fkey" FOREIGN KEY ("responsibleUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
