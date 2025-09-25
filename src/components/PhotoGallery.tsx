import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, ImageIcon } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  title?: string;
  className?: string;
}

export function PhotoGallery({
  photos,
  title = 'Photos',
  className,
}: PhotoGalleryProps) {
  // Convert photo URLs to the format expected by react-image-gallery
  const galleryImages = photos.map(photo => ({
    original: photo,
    thumbnail: photo,
    originalAlt: 'Pickup photo',
    thumbnailAlt: 'Pickup photo thumbnail',
  }));

  // If no photos, show empty state
  if (!photos || photos.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-muted-foreground">
              No photos uploaded for this pickup
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {title} ({photos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden">
          <ImageGallery
            items={galleryImages}
            showThumbnails={true}
            showFullscreenButton={true}
            showPlayButton={false}
            showBullets={photos.length > 1}
            showNav={photos.length > 1}
            autoPlay={false}
            slideInterval={3000}
            slideDuration={450}
            thumbnailPosition="bottom"
            useBrowserFullscreen={true}
            showIndex={true}
            lazyLoad={true}
            renderItem={item => (
              <div className="image-gallery-image">
                <img
                  src={item.original}
                  alt={item.originalAlt}
                  className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  loading="lazy"
                />
              </div>
            )}
            renderThumbInner={item => (
              <div className="image-gallery-thumbnail-inner">
                <img
                  src={item.thumbnail}
                  alt={item.thumbnailAlt}
                  className="w-full h-20 object-cover"
                  loading="lazy"
                />
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
