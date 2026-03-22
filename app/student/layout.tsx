import { CourseProvider } from "@/app/providers/course-provider";
import { GlobalHeader } from "@/components/student/global-header";
import { getDataService } from "@/services/data";
import { getAuthUser } from "@/lib/auth";
import { Suspense } from "react";

export default async function StudentLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams?: { student?: string };
}) {
  // Get current user for header
  const authUser = await getAuthUser();
  const currentUserId = searchParams?.student || authUser?.id || "ananya-001";

  const dataService = await getDataService();
  const user = await dataService.getUserById(currentUserId);

  // Get progress for XP/badges
  const allProgress = await dataService.getProgressByUser(currentUserId);
  const totalXP = allProgress.reduce((sum, week) => sum + week.xpEarned, 0);
  const allBadges = allProgress.flatMap(week => week.badges);

  // Get pending FRQs count
  const pendingFRQs = await dataService.getFRQAssignmentsByStudent(currentUserId, "pending");
  const activePendingFRQs = pendingFRQs.filter(frq => !frq.blocked);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseProvider>
        <div className="min-h-screen">
          {/* Global header - visible on all student pages */}
          {user && (
            <GlobalHeader
              userName={user.name}
              userCourse={user.course || "calculus-bc"}
              totalXP={totalXP}
              badges={allBadges}
              pendingFRQsCount={activePendingFRQs.length}
            />
          )}

          {/* Page content */}
          {children}
        </div>
      </CourseProvider>
    </Suspense>
  );
}
