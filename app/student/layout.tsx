import { CourseProvider } from "@/app/providers/course-provider";
import { Suspense } from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseProvider>
        {children}
      </CourseProvider>
    </Suspense>
  );
}
