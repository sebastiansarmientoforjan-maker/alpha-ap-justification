import { getDataService } from "@/services/data";
import { FRQReviewDashboard } from "@/components/admin/frq-review-dashboard";

export const dynamic = "force-dynamic";

export default async function FRQReviewPage() {
  const dataService = await getDataService();

  // Get all students to map IDs to names
  const allStudents = await dataService.getAllStudents();

  // Get all FRQ assignments and submissions
  const allAssignments = await dataService.getAllFRQAssignments();

  // Filter assignments that need review (submitted or graded status)
  const submittedAssignments = allAssignments.filter(a => a.status === "submitted");
  const gradedAssignments = allAssignments.filter(a => a.status === "graded");

  // Get submissions for these assignments
  const submittedWithSubmissions = await Promise.all(
    submittedAssignments.map(async (assignment) => {
      const submissions = await dataService.getFRQSubmissionsByAssignment(assignment.id);
      const student = allStudents.find(s => s.id === assignment.studentId);
      return {
        assignment,
        submission: submissions[0] || null,
        studentName: student?.name || "Unknown Student",
      };
    })
  );

  const gradedWithSubmissions = await Promise.all(
    gradedAssignments.map(async (assignment) => {
      const submissions = await dataService.getFRQSubmissionsByAssignment(assignment.id);
      const student = allStudents.find(s => s.id === assignment.studentId);
      return {
        assignment,
        submission: submissions[0] || null,
        studentName: student?.name || "Unknown Student",
      };
    })
  );

  return (
    <FRQReviewDashboard
      submittedFRQs={submittedWithSubmissions}
      gradedFRQs={gradedWithSubmissions}
    />
  );
}
