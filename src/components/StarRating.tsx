import { Star } from "lucide-react";
import { useState } from "react";

const StarRating = ({
  rating: currentRating,
  onRatingChange,
  interactive = false,
  size = "w-5 h-5",
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: string;
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          className={`${size} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        >
          <Star className={`w-full h-full ${star <= (interactive ? hoverRating || currentRating : currentRating) ? "fill-black text-black" : "text-gray-300"}`} />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
