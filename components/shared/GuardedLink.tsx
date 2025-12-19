"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface GuardedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  checkUnsavedChanges?: () => Promise<boolean>; // Optional function to check and flush
  [key: string]: unknown; // Allow other Link props
}

export default function GuardedLink({
  href,
  children,
  className,
  onClick,
  checkUnsavedChanges,
  ...linkProps
}: GuardedLinkProps) {
  const router = useRouter();
  const [isFlushing, setIsFlushing] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call custom onClick if provided
      if (onClick) {
        onClick(e);
      }

      // If no check function provided, navigate normally
      if (!checkUnsavedChanges) {
        return; // Let Link handle navigation
      }

      // Prevent default navigation
      e.preventDefault();

      // Show saving state
      setIsFlushing(true);

      try {
        // Check and flush unsaved changes
        const canNavigate = await checkUnsavedChanges();

        if (canNavigate) {
          // All saves succeeded, navigate
          router.push(href);
        } else {
          // Save failed, show error
          alert("Couldn't save changes. Please try saving manually before navigating.");
        }
      } catch (error) {
        // Error occurred, show user-friendly message
        alert("Couldn't save changes. Please try saving manually before navigating.");
      } finally {
        setIsFlushing(false);
      }
    },
    [href, checkUnsavedChanges, router, onClick]
  );

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      {...linkProps}
    >
      {isFlushing ? "Saving…" : children}
    </Link>
  );
}

