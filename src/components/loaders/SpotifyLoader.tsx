import { cn } from "@/lib/utils";

interface SpotifyLoaderProps {
  className?: string;
}

export function SpotifyLoader({ className }: SpotifyLoaderProps) {
  return (
    <div className={cn("animate-pulse space-y-8", className)}>
      {/* Hero Section Loader */}
      <div className="relative h-[300px] rounded-lg bg-gray-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/10 to-transparent shimmer" />
        <div className="absolute inset-0 flex items-center justify-between p-8">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-gray-700/50 rounded-lg" />
            <div className="h-6 w-96 bg-gray-700/50 rounded-lg" />
            <div className="h-10 w-32 bg-gray-700/50 rounded-full mt-4" />
          </div>
          <div className="w-64 h-64 bg-gray-700/50 rounded-lg" />
        </div>
      </div>

      {/* Category Section Loaders */}
      {[1, 2].map((section) => (
        <div key={section} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 w-48 bg-gray-700/50 rounded-lg" />
              <div className="h-4 w-72 bg-gray-700/50 rounded-lg mt-2" />
            </div>
            <div className="h-9 w-20 bg-gray-700/50 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="group cursor-pointer space-y-4">
                <div className="aspect-square bg-gray-700/50 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-gray-700/10 to-transparent shimmer" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-gray-700/50 rounded" />
                  <div className="h-3 w-1/2 bg-gray-700/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}