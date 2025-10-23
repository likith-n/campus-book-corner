import { useParams, Link } from "react-router-dom";
import { mockBooks, mockUsers } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, ArrowLeft, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

const ListingDetail = () => {
  const { id } = useParams();
  const book = mockBooks.find((b) => b.id === id);
  const owner = mockUsers.find((u) => u.id === book?.ownerId);
  const [requestMessage, setRequestMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!book || !owner) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Book not found</h1>
        <Button asChild className="mt-4">
          <Link to="/listings">Back to Listings</Link>
        </Button>
      </div>
    );
  }

  const handleRequestSubmit = () => {
    if (!requestMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    toast.success("Request sent! The owner will be notified.");
    setRequestMessage("");
    setIsDialogOpen(false);
  };

  const conditionColors = {
    new: "bg-success text-success-foreground",
    good: "bg-primary text-primary-foreground",
    fair: "bg-secondary text-secondary-foreground",
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/listings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
            <img
              src={book.images[0]}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          </div>
          {book.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {book.images.slice(1).map((img, idx) => (
                <div key={idx} className="aspect-square overflow-hidden rounded-md border border-border bg-muted">
                  <img src={img} alt={`${book.title} ${idx + 2}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-start justify-between">
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <Badge className={conditionColors[book.condition]}>
                {book.condition}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{book.author}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">₹{book.price}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/50 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Edition</p>
              <p className="font-semibold">{book.edition}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-semibold">{book.subject}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="text-muted-foreground">{book.description}</p>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold">Seller Information</h3>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {owner.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Link 
                    to={`/profile/${owner.id}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {owner.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      {owner.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {owner.location}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {owner.year}, {owner.department}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full gap-2">
                <MessageCircle className="h-5 w-5" />
                Request This Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send a Request</DialogTitle>
                <DialogDescription>
                  Send a message to {owner.name} about this book
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Hi! I'm interested in this book. When can we meet?"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleRequestSubmit} className="w-full">
                  Send Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Listed on {new Date(book.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
