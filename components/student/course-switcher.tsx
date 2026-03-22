"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

interface CourseSwitcherProps {
  currentCourse: string;
  currentStudentName: string;
}

const DEMO_STUDENTS = [
  {
    id: "ananya-001",
    name: "Ananya Kakarlapudi",
    course: "calculus-bc",
    label: "BC Student",
  },
  {
    id: "sloka-001",
    name: "Sloka Vudumu",
    course: "calculus-ab",
    label: "AB Student",
  },
  {
    id: "emily-001",
    name: "Emily Smith",
    course: "statistics",
    label: "Stats Student",
  },
];

export function CourseSwitcher({ currentCourse, currentStudentName }: CourseSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentStudent = DEMO_STUDENTS.find(s => s.name === currentStudentName) || DEMO_STUDENTS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSwitch = (studentId: string) => {
    // Navigate with student param
    router.push(`/student?student=${studentId}`);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-400/50 transition-all backdrop-blur-sm group"
      >
        <BookOpen className="w-4 h-4 text-purple-400" />
        <div className="flex flex-col items-start">
          <span className="text-xs text-purple-300/70">Demo Mode</span>
          <span className="text-sm font-semibold text-purple-200">{currentStudent.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 rounded-xl border border-white/10 bg-primary-900/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
          <div className="p-3 border-b border-white/10">
            <p className="text-xs text-primary-400">Switch Student View</p>
          </div>

          <div className="p-2">
            {DEMO_STUDENTS.map((student) => (
              <button
                key={student.id}
                onClick={() => handleSwitch(student.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  student.id === currentStudent.id
                    ? "bg-purple-500/20 border border-purple-500/30"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{student.name}</div>
                    <div className="text-xs text-primary-400">
                      {student.course === "calculus-bc" && "AP Calculus BC"}
                      {student.course === "calculus-ab" && "AP Calculus AB"}
                      {student.course === "statistics" && "AP Statistics"}
                    </div>
                  </div>
                  {student.id === currentStudent.id && (
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-white/10 bg-primary-950/50">
            <p className="text-xs text-primary-500">All content unlocked for review</p>
          </div>
        </div>
      )}
    </div>
  );
}
