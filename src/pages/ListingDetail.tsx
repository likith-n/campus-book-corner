import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, ArrowLeft, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { listingsAPI, requestsAPI, authAPI } from "@/services/api";
import { getImageUrl } from "@/lib/getImageUrl";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      const result = await listingsAPI.getById(id!);
      if (result.success) {
        setListing(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch listing:', error);
      toast.error('Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async () => {
    if (!requestMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!authAPI.isAuthenticated()) {
      toast.error("Please login to send a request");
      navigate('/login');
      return;
    }
    
    setSending(true);
    try {
      const result = await requestsAPI.create({
        listing_id: parseInt(id!),
        message: requestMessage
      });

      if (result.success) {
        toast.success("Request sent! The owner will be notified.");
        setRequestMessage("");
        setIsDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Failed to send request:', error);
      toast.error(error.message || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded" />
              <div className="h-6 w-1/2 bg-muted rounded" />
              <div className="h-12 w-1/3 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Book not found</h1>
        <Button asChild className="mt-4">
          <Link to="/listings">Back to Listings</Link>
        </Button>
      </div>
    );
  }

  const conditionColors: Record<string, string> = {
    new: "bg-success text-success-foreground",
    'like-new': "bg-green-100 text-green-800",
    good: "bg-primary text-primary-foreground",
    fair: "bg-secondary text-secondary-foreground",
    acceptable: "bg-orange-100 text-orange-800",
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
          {(() => {
            let images: string[] = [];
            if (listing.image_urls) {
              try {
                const parsed = JSON.parse(listing.image_urls);
                images = parsed.map((url: string) => getImageUrl(url));
              } catch {
                images = [];
              }
            }
            const mainImage = images[0] || '/placeholder.svg';
            return (
              <>
                <div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={mainImage}
                    alt={`${listing.title} cover`}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${listing.title} ${idx + 1}`}
                        className="h-20 w-20 shrink-0 rounded-md border border-border object-cover cursor-pointer hover:opacity-80"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                      />
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Book Details */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-start justify-between">
              <h1 className="text-3xl font-bold">{listing.title}</h1>
              <Badge className={conditionColors[listing.condition_type as keyof typeof conditionColors]}>
                {listing.condition_type}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{listing.author}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">₹{listing.price}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-muted/50 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Edition</p>
              <p className="font-semibold">{listing.edition || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-semibold">{listing.subject}</p>
            </div>
            {listing.publisher && (
              <div>
                <p className="text-sm text-muted-foreground">Publisher</p>
                <p className="font-semibold">{listing.publisher}</p>
              </div>
            )}
            {listing.publication_year && (
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-semibold">{listing.publication_year}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="text-muted-foreground">
              {listing.description || listing.book_description || 'No description available'}
            </p>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold">Seller Information</h3>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {listing.owner_name?.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Link 
                    to={`/profile/${listing.owner_id}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {listing.owner_name}
                  </Link>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      {listing.owner_rating || 'New'}
                    </span>
                    {listing.owner_location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {listing.owner_location}
                      </span>
                    )}
                  </div>
                  {listing.owner_year && listing.owner_department && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {listing.owner_year}, {listing.owner_department}
                    </p>
                  )}
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
                  Send a message to {listing.owner_name} about this book
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
                    disabled={sending}
                  />
                </div>
                <Button 
                  onClick={handleRequestSubmit} 
                  className="w-full"
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Listed on {new Date(listing.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
