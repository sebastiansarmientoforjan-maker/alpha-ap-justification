import { getDataService } from "@/services/data";
import { DeliverFeedbackView } from "@/components/admin/deliver-feedback-view";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface FeedbackDeliveryPageProps {
  params: {
    assignmentId: string;
  };
}

export default async function FeedbackDeliveryPage({ params }: FeedbackDeliveryPageProps) {
  const dataService = await getDataService();
  const { assignmentId } = params;

  // Get assignment
  const assignment = await dataService.getFRQAssignmentById(assignmentId);
  if (!assignment) {
    notFound();
  }

  // Get submission
  const submissions = await dataService.getFRQSubmissionsByAssignment(assignmentId);
  const submission = submissions[0];
  if (!submission) {
    notFound();
  }

  // Get student info
  const student = await dataService.getUserById(assignment.studentId);
  if (!student) {
    notFound();
  }

  return (
    <DeliverFeedbackView
      assignment={assignment}
      submission={submission}
      student={student}
    />
  );
}
