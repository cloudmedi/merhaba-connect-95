import ContentLoader from 'react-content-loader';

export function FeaturedPlaylistLoader() {
  return (
    <div className="mb-12 rounded-lg overflow-hidden h-[300px]">
      <ContentLoader
        speed={2}
        width="100%"
        height={300}
        backgroundColor="#f3f4f6"
        foregroundColor="#e5e7eb"
        className="w-full h-full"
      >
        {/* Background */}
        <rect x="0" y="0" width="100%" height="300" />
        
        {/* Text area */}
        <rect x="40" y="80" width="200" height="40" />
        <rect x="40" y="140" width="300" height="30" />
        <rect x="40" y="190" width="120" height="40" />
        
        {/* Image placeholder */}
        <rect x="75%" y="50" width="200" height="200" rx="8" />
      </ContentLoader>
    </div>
  );
}