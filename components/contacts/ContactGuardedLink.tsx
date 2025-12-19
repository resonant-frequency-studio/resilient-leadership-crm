"use client";

import { useContext } from "react";
import Link from "next/link";
import { ContactAutosaveContext } from "./ContactAutosaveProvider";
import GuardedLink from "../shared/GuardedLink";

interface ContactGuardedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: unknown;
}

export default function ContactGuardedLink({
  href,
  children,
  className,
  onClick,
  ...linkProps
}: ContactGuardedLinkProps) {
  const context = useContext(ContactAutosaveContext);

  // If context is not available, use regular Link
  if (!context) {
    return (
      <Link href={href} className={className} onClick={onClick} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { hasUnsavedChanges, flush, isSaving, pendingCount } = context;

  const checkUnsavedChanges = async (): Promise<boolean> => {
    // If no unsaved changes, allow navigation
    if (!hasUnsavedChanges && pendingCount === 0 && !isSaving) {
      return true;
    }

    // Flush all pending saves
    try {
      const success = await flush();
      return success;
    } catch (error) {
      return false;
    }
  };

  return (
    <GuardedLink
      href={href}
      className={className}
      onClick={onClick}
      checkUnsavedChanges={checkUnsavedChanges}
      {...linkProps}
    >
      {children}
    </GuardedLink>
  );
}

