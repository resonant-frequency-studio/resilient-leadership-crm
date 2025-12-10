import Link from "next/link";

interface ViewAllLinkProps {
  href: string;
  label?: string;
}

export default function ViewAllLink({ href, label = "View All →" }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium ml-auto"
    >
      {label}
    </Link>
  );
}

