import Card from "@/components/Card";

export default function ActionItemsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-96" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} padding="md" className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-16 mb-1" />
            <div className="h-8 bg-gray-200 rounded w-12" />
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
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

      {/* Action Items List Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} padding="md" className="animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Checkbox and text */}
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="h-5 bg-gray-200 rounded flex-1 max-w-md" />
                </div>
                
                {/* Contact info */}
                <div className="flex items-center gap-2 ml-7">
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
                
                {/* Date info */}
                <div className="ml-7 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <div className="w-8 h-8 bg-gray-200 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

