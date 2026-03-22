"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams, usePathname } from "next/navigation";

type Course = "calculus-ab" | "calculus-bc" | "statistics";

interface CourseContextType {
  course: Course;
  studentId: string;
  studentName: string;
}

const CourseContext = createContext<CourseContextType>({
  course: "calculus-bc",
  studentId: "ananya-001",
  studentName: "Ananya Kakarlapudi",
});

// Map student IDs to courses (from mock data)
const STUDENT_COURSE_MAP: Record<string, { course: Course; name: string }> = {
  "ananya-001": { course: "calculus-bc", name: "Ananya Kakarlapudi" },
  "elle-001": { course: "calculus-bc", name: "Elle Liemandt" },
  "sloka-001": { course: "calculus-ab", name: "Sloka Vudumu" },
  "alex-001": { course: "calculus-bc", name: "Alex Mathew" },
  "emily-001": { course: "statistics", name: "Emily Smith" },
  "maddie-001": { course: "calculus-ab", name: "Maddie Price" },
  "sloane-001": { course: "calculus-ab", name: "Sloane Price" },
};

export function CourseProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Get student ID from URL param or default to ananya-001
  const studentIdFromUrl = searchParams.get("student") || "ananya-001";

  // Get course and name from student ID
  const studentData = STUDENT_COURSE_MAP[studentIdFromUrl] || STUDENT_COURSE_MAP["ananya-001"];

  const [courseData] = useState<CourseContextType>({
    course: studentData.course,
    studentId: studentIdFromUrl,
    studentName: studentData.name,
  });

  // Update when URL changes
  useEffect(() => {
    const newStudentId = searchParams.get("student") || "ananya-001";
    const newStudentData = STUDENT_COURSE_MAP[newStudentId] || STUDENT_COURSE_MAP["ananya-001"];

    // Force re-render by reloading if student changes
    if (newStudentId !== courseData.studentId) {
      window.location.href = pathname + (newStudentId !== "ananya-001" ? `?student=${newStudentId}` : "");
    }
  }, [searchParams, pathname, courseData.studentId]);

  return (
    <CourseContext.Provider value={courseData}>
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = () => useContext(CourseContext);
