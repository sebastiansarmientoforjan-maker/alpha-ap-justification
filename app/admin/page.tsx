import { getDataService } from "@/services/data";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const dataService = await getDataService();

  // Get all student summaries
  const studentSummaries = await dataService.getAllStudentProgressSummaries();

  // Get all quizzes that haven't been assigned FRQs
  const allQuizzes = await dataService.getAllQuizzes();
  const unassignedQuizzes = allQuizzes.filter(q => !q.frqAssigned);

  return (
    <AdminDashboard
      studentSummaries={studentSummaries}
      unassignedQuizzes={unassignedQuizzes}
    />
  );
}
