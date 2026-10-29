import Link from "next/link";

const ADMIN_LINKS = [
  { href: "/admin/suggestions", label: "Suggestions" },
  { href: "/admin/recruitments", label: "Recrutements" },
  { href: "/admin/jeunes", label: "Jeûne des Jeunes" },
  { href: "/admin/seminaire", label: "Séminaire" },
  { href: "/admin/conference", label: "Conférence Pro" },
  { href: "/admin/camp", label: "Camp" },
  { href: "/admin/scanner", label: "Scanner" },
] as const;

export type AdminSection = (typeof ADMIN_LINKS)[number]["href"];

export function AdminNav({ active }: { active: AdminSection }) {
  return (
    <nav className="flex flex-wrap gap-1 mr-2">
      {ADMIN_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            link.href === active
              ? "px-3 py-1.5 text-sm font-medium rounded-lg bg-royal-100 text-royal-700"
              : "px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
