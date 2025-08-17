import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface VehicleGalleryProps {
  images: string[];
}
export function VehicleGallery({
  images
}: VehicleGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const goToNextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
  };
  const goToPreviousImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
  };
  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  return <div className="mb-8">
      <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-muted">
        {images.length > 0 && <img src={images[currentImageIndex]} alt={`Vehicle image ${currentImageIndex + 1}`} className="w-full h-full object-cover" />}
        {/* Navigation arrows */}
        {images.length > 1 && <>
            <button onClick={goToPreviousImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors" aria-label="Previous image">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={goToNextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors" aria-label="Next image">
              <ChevronRight className="h-6 w-6" />
            </button>
          </>}
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
      {/* Thumbnails */}
      {images.length > 1 && <div className="flex space-x-2 mt-4 overflow-x-auto p-1">
          {images.map((image, index) => <button key={index} onClick={() => selectImage(index)} className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden transition-all ${index === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}>
              <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>)}
        </div>}
    </div>;
}