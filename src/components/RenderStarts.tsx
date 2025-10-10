import { Star } from "lucide-react";

const RenderStars = ({rating, size = "sm"}: {rating: number, size?: "sm" | "md"}) => {
    const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`${starSize} ${star <= rating ? "fill-black text-black" : "text-gray-300"}`} />
        ))}
      </div>
    );
  };

export default RenderStars;