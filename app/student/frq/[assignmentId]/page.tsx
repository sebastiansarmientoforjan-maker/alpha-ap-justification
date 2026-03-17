import { getDataService } from "@/services/data";
import { FRQSolver } from "@/components/student/frq-solver";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface FRQPageProps {
  params: {
    assignmentId: string;
  };
}

export default async function FRQPage({ params }: FRQPageProps) {
  const dataService = await getDataService();
  const { assignmentId } = params;

  // Fetch FRQ assignment
  const assignment = await dataService.getFRQAssignmentById(assignmentId);

  if (!assignment) {
    notFound();
  }

  // Fetch submission if exists
  const submissions = await dataService.getFRQSubmissionsByAssignment(assignmentId);
  const submission = submissions[0] || null;

  // Mock current user - in production, get from auth
  const currentUserId = assignment.studentId;
  const user = await dataService.getUserById(currentUserId);

  return (
    <FRQSolver
      assignment={assignment}
      submission={submission}
      user={user}
    />
  );
}
