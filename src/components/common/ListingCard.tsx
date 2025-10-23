import { Link } from "react-router-dom";
import { Book } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ListingCardProps {
  book: Book;
}

const conditionColors = {
  new: "bg-success text-success-foreground",
  good: "bg-primary text-primary-foreground",
  fair: "bg-secondary text-secondary-foreground",
};

const ListingCard = ({ book }: ListingCardProps) => {
  return (
    <Link to={`/listings/${book.id}`}>
      <article className="group h-full overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={book.images[0]}
            alt={`${book.title} cover`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <Badge className={conditionColors[book.condition]}>
              {book.condition}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-primary">₹{book.price}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-secondary text-secondary" />
              <span>{book.ownerRating}</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {book.ownerName} • {book.subject}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ListingCard;
