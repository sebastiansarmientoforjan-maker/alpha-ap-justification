import { getDataService } from "@/services/data";
import { getAuthUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { FRQsContent } from "@/components/student/frqs-content";

export const dynamic = "force-dynamic";

export default async function FRQsPage({
  searchParams,
}: {
  searchParams: { student?: string };
}) {
  const authUser = await getAuthUser();
  const currentUserId = searchParams.student || authUser?.id || "ananya-001";

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

  return (
    <FRQsContent
      pendingFRQs={pendingFRQs}
      submittedFRQs={submittedFRQs}
      gradedFRQs={gradedFRQs}
      completedFRQs={completedFRQs}
    />
  );
}
