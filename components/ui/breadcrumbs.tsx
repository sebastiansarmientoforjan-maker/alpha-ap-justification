/**
 * Breadcrumbs Component
 * Consistent navigation breadcrumbs across the app
 */
"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      <Link
        href="/"
        className="flex items-center gap-1.5 text-primary-400 hover:text-accent-400 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>

      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-primary-500" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-primary-400 hover:text-accent-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

/**
 * Auto-generate breadcrumbs from pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Format segment label
    let label = segment.replace(/-/g, " ");
    label = label.charAt(0).toUpperCase() + label.slice(1);

    // Special cases
    if (segment === "student") label = "Dashboard";
    if (segment === "materials") label = "Materials";
    if (segment === "week") label = "Week";
    if (segment === "practice") label = "Practice";
    if (segment === "frq") label = "FRQ";
    if (segment === "admin") label = "Admin";

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}
