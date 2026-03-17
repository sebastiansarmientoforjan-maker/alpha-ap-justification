import { getDataService } from "@/services/data";
import { StudentDashboard } from "@/components/student/student-dashboard";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  // Require student authentication
  const authUser = await requireRole("student");
  const currentUserId = authUser.id;

  const dataService = await getDataService();

  // Get student info
  const user = await dataService.getUserById(currentUserId);
  if (!user) {
    notFound();
  }

  // Fetch student's FRQ assignments
  const pendingFRQs = await dataService.getFRQAssignmentsByStudent(currentUserId, "pending");
  const submittedFRQs = await dataService.getFRQAssignmentsByStudent(currentUserId, "submitted");
  const gradedFRQs = await dataService.getFRQAssignmentsByStudent(currentUserId, "graded");
  const completedFRQs = await dataService.getFRQAssignmentsByStudent(currentUserId, "feedback_delivered");

  const allProgress = await dataService.getProgressByUser(currentUserId);

  // Calculate total XP
  const totalXP = allProgress.reduce((sum, week) => sum + week.xpEarned, 0);

  // Get all badges
  const allBadges = allProgress.flatMap(week => week.badges);

  return (
    <StudentDashboard
      user={user}
      pendingFRQs={pendingFRQs}
      submittedFRQs={submittedFRQs}
      gradedFRQs={gradedFRQs}
      completedFRQs={completedFRQs}
      totalXP={totalXP}
      badges={allBadges}
    />
  );
}
