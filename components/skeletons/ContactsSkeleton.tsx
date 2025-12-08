import Card from "@/components/Card";
import Link from "next/link";
import { Button } from "@/components/Button";

export default function ContactsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-6 bg-gray-200 rounded w-64" />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:shrink-0 w-full sm:w-auto">
          <Link href="/contacts/new" className="w-full sm:w-auto">
            <Button
              variant="gradient-blue"
              size="md"
              fullWidth
              className="whitespace-nowrap"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Add Contact
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Section Skeleton */}
      <Card padding="md" className="animate-pulse">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="h-4 bg-gray-200 rounded w-28 mb-2" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </Card>

      {/* Contacts Grid Skeleton */}
      <div className="grid grid-cols-1 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} padding="md" className="animate-pulse">
            <div className="flex items-center gap-4">
              {/* Avatar skeleton */}
              <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
              
              {/* Content skeleton */}
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
              
              {/* Arrow skeleton */}
              <div className="w-5 h-5 bg-gray-200 rounded shrink-0" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

