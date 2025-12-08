import Card from "@/components/Card";

export default function ContactDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back Button Skeleton - Mobile */}
      <div className="lg:hidden animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-24" />
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-5 bg-gray-200 rounded w-64" />
          </div>
        </div>
        {/* Back Button Skeleton - Desktop */}
        <div className="hidden lg:block animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-24" />
        </div>
      </div>

      {/* Contact Editor Skeleton */}
      <Card padding="md">
        <div className="space-y-6">
          {/* Form fields */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          ))}
          
          {/* Action Items Section */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

